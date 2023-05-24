import { Rectangle } from './Rectangle';
import { Arrow, Utils as ArrowUtils } from './Arrows';
import { FadeInOutAnimation } from '../Animations/FadeInOutAnimation';

let PlayerCutOutStateEnum = {
    COMPLETED: 2,
    PLACING_RECTANGLE_FIRST: 0,
    PLACING_RECTANGLE_SECOND: 1,
};

export class PlayerCutOut {
    constructor(manager, arrowColor) {
        this.manager = manager;
        this.state = PlayerCutOutStateEnum.PLACING_RECTANGLE_FIRST;
        this.firstRectangle = new Rectangle(this.manager, 'red', 2, 0.5);
        this.secondRectangle = null;
        this.arrow = new Arrow(
            this.manager,
            arrowColor,
            'white',
            true,
            this.manager.zAngle
        );
        this.cutout = null;
        this.zAngle = null;
        this.opacity = 1;
    }

    setLastPointPosition = function (position) {
        switch (this.state) {
            case PlayerCutOutStateEnum.PLACING_RECTANGLE_FIRST:
                this.firstRectangle.setLastPointPosition(position);
                break;
            case PlayerCutOutStateEnum.PLACING_RECTANGLE_SECOND:
                this.secondRectangle.setCenterPosition(position);
                this.setSecondArrowPosition();
                break;
        }
    };

    getSize = function () {
        return this.arrow.getSize();
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

    setZAngle = function (zAngle) {
        this.zAngle = zAngle;
    };

    hasPlacedPoints = function () {
        return !(
            this.state === PlayerCutOutStateEnum.PLACING_RECTANGLE_FIRST &&
            this.firstRectangle.points.length === 1
        );
    };

    isPlacingPoints = function () {
        return true;
    };

    isFinished = function () {
        return this.state === PlayerCutOutStateEnum.COMPLETED;
    };

    generateCutOut = function () {
        this.cutout = document.createElement('canvas');
        this.cutout.width = this.firstRectangle.getAbsoluteWidth();
        this.cutout.height = this.firstRectangle.getAbsoluteHeight();
        let context = this.cutout.getContext('2d');
        context.globalAlpha = this.opacity;
        context.drawImage(
            this.manager.videoForegroundCanvas,
            this.firstRectangle.points[0].x *
                this.manager.videoForegroundCanvas.width,
            this.firstRectangle.points[0].y *
                this.manager.videoForegroundCanvas.height,
            this.cutout.width,
            this.cutout.height,
            0,
            0,
            this.cutout.width,
            this.cutout.height
        );
    };

    pointGoodForClosingRectangle = function (position) {
        let ok = true;
        if (this.state === PlayerCutOutStateEnum.PLACING_RECTANGLE_FIRST) {
            let firstPoint = this.firstRectangle.points[0];
            if (firstPoint) {
                if (
                    Utils.dist(
                        firstPoint.x,
                        firstPoint.y,
                        position.x,
                        position.y
                    ) <
                        0.005 * 1.41 ||
                    Math.abs(firstPoint.x - position.x) < 0.005 ||
                    Math.abs(firstPoint.y - position.y) < 0.005
                ) {
                    ok = false;
                }
            }
        }
        return ok;
    };

    setFirstArrowPosition = function () {
        const [firstPoint, secondPoint] = this.firstRectangle.points;
        const center = {
            x: (firstPoint.x + secondPoint.x) / 2,
            y: secondPoint.y,
        };
        this.arrow.addPoint({ ...center });
        this.arrow.addPoint({ ...center });
    };

    setSecondArrowPosition = function () {
        const [firstPoint, secondPoint] = this.secondRectangle.points;
        const center = {
            x: (firstPoint.x + secondPoint.x) / 2,
            y: secondPoint.y,
        };
        this.arrow.setLastPoint({ ...center });
        const [firstDot, lastDot] = this.arrow.getAbsolutePositionDots();
        const { arrowHeadWidth } = this.arrow.getDrawingProperties();
        const point = ArrowUtils.getLastPointWithoutHeadLength(
            firstDot,
            lastDot,
            arrowHeadWidth
        );
        this.arrow.setLastPoint(
            this.manager.transformToCanvasPosition(point, this)
        );
    };

    setArrowColor = function (newColor) {
        this.arrow.setColor(newColor);
    };
    
    setColor = function (newColor) {
        this.arrow.setColor(newColor);
    }
    setArrowZAngle = function (zAngle) {
        this.arrow.setZAngle(zAngle);
    };

    setArrowWidth = function (width) {
        this.arrow.setWidth(width);
    };

    placePoint = function (position) {
        switch (this.state) {
            case PlayerCutOutStateEnum.PLACING_RECTANGLE_FIRST:
                if (this.firstRectangle.points.length === 2) {
                    this.firstRectangle.opacity = 1;
                    this.state = PlayerCutOutStateEnum.PLACING_RECTANGLE_SECOND;

                    this.firstRectangle.sortPoints();

                    this.secondRectangle = new Rectangle(
                        this.manager,
                        'red',
                        2,
                        0.5
                    );
                    this.secondRectangle.copyPoints(this.firstRectangle);
                    this.setFirstArrowPosition();
                    this.generateCutOut();
                } else {
                    this.firstRectangle.addPoint(position);
                }
                break;
            case PlayerCutOutStateEnum.PLACING_RECTANGLE_SECOND:
                this.arrow.finishArrow();
                this.manager.arrows.push(this.arrow);
                this.firstRectangle.color = 'rgba(0, 0, 0, 0)';
                this.secondRectangle.color = 'rgba(0, 0, 0, 0)';
                this.state = PlayerCutOutStateEnum.COMPLETED;
                break;
        }
    };

    draw = function (context, time, ignorePerspective, borderContext) {
        context.save();
        borderContext.save();
        if (this.animation) {
            this.animation.set(context);
            this.animation.set(borderContext);
        }

        this.firstRectangle.draw(borderContext);

        // draw the first rectangle with opacity

        if (this.secondRectangle) {
            let cutoutPosition = this.secondRectangle.getAbsolutePositionPoints()[0];
            context.globalAlpha = this.opacity;
            this.arrow.opacity = this.opacity;

            if (this.state !== PlayerCutOutStateEnum.COMPLETED) {
                this.arrow.draw(context);
            }

            context.drawImage(this.cutout, cutoutPosition.x, cutoutPosition.y);
            this.secondRectangle.draw(borderContext);
        }

        context.restore();
        borderContext.restore();
    };
}

var Utils = {};

Utils.sqr = function (x) {
    return x * x;
};

Utils.dist2 = function (x1, y1, x2, y2) {
    return Utils.sqr(x1 - x2) + Utils.sqr(y1 - y2);
};

Utils.dist = function (x1, y1, x2, y2) {
    return Math.sqrt(Utils.dist2(x1, y1, x2, y2));
};
