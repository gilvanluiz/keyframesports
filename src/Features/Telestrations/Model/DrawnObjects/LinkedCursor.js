import { Cursor } from './Cursor';
import { FadeInOutAnimation } from '../Animations/FadeInOutAnimation';

export class LinkedCursor {
    constructor(manager, time, radius, color, zAngle) {
        this.time = time;
        this.opacity = 1;
        this.manager = manager;
        // external animations

        this.radius = radius;
        this.cursors = [];

        this.finished = false;

        this.color = color;
        this.zAngle = zAngle;

        this.animation = null;
    }

    markAsFinished = function () {
        this.animation = new FadeInOutAnimation(
            this.manager,
            this.manager.config.FADE_IN_TIME,
            this,
            0,
            false
        );
    };

    confirmLastCursor = function () {
        if (this.cursors.length > 0) {
            let valid = true;
            let lastIndex = this.cursors.length - 1;
            if (this.cursors.length > 2) {
                // check that cursors aren't WAY too close
                if (
                    Utils.dist(
                        this.cursors[lastIndex].position.x,
                        this.cursors[lastIndex].position.y,
                        this.cursors[lastIndex - 1].position.x,
                        this.cursors[lastIndex - 1].position.y
                    ) < 0.002
                ) {
                    valid = false;
                }
            }
            if (valid) {
                this.cursors[lastIndex].opacity = 1;
                this.cursors[lastIndex].startOpenTimer(
                    this.manager.CURSOR_OPEN_TIME
                );
            } else {
                this.cursors.splice(lastIndex, 1);
            }
        }
    };

    setColor = function (color) {
        this.cursors.map((c) => c.setColor(color));
        this.color = color;
    };

    addCursor = function (position) {
        this.confirmLastCursor();

        let c = new Cursor(
            this.manager,
            this.time,
            position,
            this.radius,
            0.5,
            this.color,
            this.zAngle
        );
        this.cursors.push(c);
    };

    setLastCursorPosition = function (time, position) {
        this.cursors[this.cursors.length - 1].setKeyFrame(time, position);
    };

    setRadius = function (radius) {
        this.radius = radius;

        // if this is still under construction, modify current radius
        if (!this.finished && this.cursors.length > 0) {
            this.cursors[this.cursors.length - 1].setRadius(radius);
        }
    };

    setZAngle = function (zAngle) {
        this.zAngle = zAngle;

        for (let i = 0; i < this.cursors.length; i++) {
            this.cursors[i].setZAngle(zAngle);
        }
    };

    update = function (delta) {
        this.cursors.map((c) => c.update(delta));
    };

    removeLastConfirmedCursor = function () {
        let lastConfirmedIndex = this.cursors.length - 1;
        if (!this.finished) {
            lastConfirmedIndex--;
        }
        if (lastConfirmedIndex >= 0) {
            this.cursors.splice(lastConfirmedIndex, 1);
        }
    };

    drawCursorsLine = function (context, firstCursorIndex, secondCursorIndex) {
        let r1 = this.cursors[firstCursorIndex].getOuterRadius();
        let r2 = this.cursors[secondCursorIndex].getOuterRadius();

        let p1 = this.cursors[firstCursorIndex].getAbsolutePosition();
        let p2 = this.cursors[secondCursorIndex].getAbsolutePosition();
        let distance = Utils.dist(p1.x, p1.y, p2.x, p2.y);

        if (distance > r1 && distance > r2) {
            context.save();
            context.lineWidth = 10;
            context.strokeStyle = this.color;
            context.globalAlpha = this.opacity;
            context.shadowBlur = 4;
            context.shadowColor = 'rgba(255,255,255,0.8)';

            let startx = Utils.lerp(0, distance, r1, p1.x, p2.x);
            let starty = Utils.lerp(0, distance, r1, p1.y, p2.y);

            let endx = Utils.lerp(0, distance, distance - r2, p1.x, p2.x);
            let endy = Utils.lerp(0, distance, distance - r2, p1.y, p2.y);

            context.beginPath();
            context.moveTo(startx, starty);
            context.lineTo(endx, endy);
            context.stroke();

            context.restore();
        }
    };

    draw = function (context, time) {
        this.manager.setObjectPerspectiveMode(this, context);
        if (this.animation) {
            this.animation.set(context);
        }

        for (let i = 1; i < this.cursors.length; i++) {
            this.drawCursorsLine(context, i - 1, i);
        }

        this.cursors.map((c) => {
            c.draw(context, time, true);
            c.opacity = this.opacity;
        });

        this.manager.unsetPerspectiveMode(context);
    };

    isFinished = function () {
        return this.finished;
    };
}

let Utils = {};
Utils.lerp = function (startX, endX, interX, startY, endY) {
    return Utils.linearInterpolation(startY, endY, interX, startX, endX);
};

Utils.linearInterpolation = function (startX, endX, interY, startY, endY) {
    let yInterval = endY - startY;
    let fraction = (interY - startY) / yInterval;
    return startX + (endX - startX) * fraction;
};

Utils.sqr = function (x) {
    return x * x;
};

Utils.dist2 = function (x1, y1, x2, y2) {
    return Utils.sqr(x1 - x2) + Utils.sqr(y1 - y2);
};

Utils.dist = function (x1, y1, x2, y2) {
    return Math.sqrt(Utils.dist2(x1, y1, x2, y2));
};
