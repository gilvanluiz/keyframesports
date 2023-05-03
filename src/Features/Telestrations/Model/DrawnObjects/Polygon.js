import { FadeInOutAnimation } from '../Animations/FadeInOutAnimation';

export class Polygon {
    constructor(manager, color, borderColor, opacity, zAngle) {
        this.color = color;
        this.borderColor = borderColor;
        this.opacity = 1;
        this.fillOpacity = opacity;
        this.zAngle = zAngle;

        this.manager = manager;

        this.points = [];

        this.finished = false;
    }

    addPoint = function (point) {
        this.points.push(point);

        if (this.points.length === 4) {
            this.finished = true;
        }
    };

    removeLastConfirmedPoint = function () {
        let lastConfirmedIndex = this.points.length - 1;
        if (!this.finished) {
            lastConfirmedIndex--;
        }
        if (lastConfirmedIndex >= 0) {
            this.points.splice(lastConfirmedIndex, 1);
        }
    };

    markAsFinished = function () {
        this.animation = new FadeInOutAnimation(
            this.manager,
            this.manager.config.FADE_IN_TIME,
            this,
            0,
            false
        );
    };

    setLastPoint = function (point) {
        this.points[this.points.length - 1].x = point.x;
        this.points[this.points.length - 1].y = point.y;
    };

    setColor = function (newColor) {
        this.color = newColor;
    };

    setZAngle = function (zAngle) {
        this.zAngle = zAngle;
    };

    isFinished = function () {
        return this.finished;
    };

    getAbsolutePositionPoints = function () {
        return this.points.map((p) =>
            this.manager.transformToAbsolutePosition(p, this)
        );
    };

    draw = function (context) {
        if (this.points.length > 1) {
            this.manager.setObjectPerspectiveMode(this, context);
            let points = this.getAbsolutePositionPoints();

            context.save();
            if (this.animation) {
                this.animation.set(context);
            }
            context.globalAlpha = this.opacity;
            context.lineWidth = 4;
            context.strokeStyle = this.borderColor;

            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                context.lineTo(points[i].x, points[i].y);
            }
            context.closePath();
            context.stroke();

            context.save();
            context.fillStyle = this.color;
            context.globalAlpha =
                (this.animation
                    ? this.animation.opacity * this.fillOpacity
                    : this.fillOpacity) * this.opacity;
            context.fill();
            context.restore();

            // draw anchor circles
            for (let i = 0; i < points.length; i++) {
                context.beginPath();
                context.arc(
                    points[i].x,
                    points[i].y,
                    context.lineWidth * 2,
                    0,
                    2 * Math.PI
                );
                context.fill();
            }

            context.restore();
            this.manager.unsetPerspectiveMode(context);
        }
    };
}
