import { FadeInOutAnimation } from '../Animations/FadeInOutAnimation';

export class Cursor {
    constructor(manager, time, position, radius, opacity, color, zAngle) {
        this.time = time;
        this.position = position;

        this.isClosing = false;
        this.manager = manager;
        // external animations
        this.animation = null;

        this.radius = radius;
        this.opacity = opacity;
        this.angleTimeOffset = 0;
        this.zAngle = zAngle;

        this.color = color;
    }

    setRadius = function (radius) {
        this.radius = radius;
    };

    setColor = function (color) {
        this.color = color;
    };

    setZAngle = function (zAngle) {
        this.zAngle = zAngle;
    };

    setKeyFrame = function (time, position) {
        this.position = position;
    };

    update = function (delta) {
        this.angleTimeOffset += delta * Math.PI * 0.3;
    };

    draw = function (context, time, ignorePerspective) {
        if (!ignorePerspective) {
            this.manager.setObjectPerspectiveMode(this, context);
        }

        let position = this.getAbsolutePosition();
        let props = this.getDrawingProperties();

        // now draw the inner secondary color arcs ars
        context.save();
        if (this.animation) {
            this.animation.set(context);
        } else if (this.opacity < 1) {
            context.globalAlpha = this.opacity;
        }

        this.manager.setShadowBlur(context);

        context.lineWidth = props.firstLineWidth;
        context.strokeStyle = 'white';
        for (let i = 0; i < props.segmentCount; i++) {
            context.beginPath();
            context.arc(
                position.x,
                position.y,
                props.radius,
                this.angleTimeOffset +
                    i * (props.segmentWidth + props.segmentSpacing),
                this.angleTimeOffset +
                    (i + 1) * props.segmentWidth +
                    i * props.segmentSpacing
            );
            context.stroke();
        }

        context.lineWidth = props.secondLineWidth;
        context.strokeStyle = this.color;
        for (let i = 0; i < props.segmentCount; i++) {
            context.beginPath();
            context.arc(
                position.x,
                position.y,
                props.radius + props.firstLineWidth,
                this.angleTimeOffset +
                    i * (props.segmentWidth + props.segmentSpacing),
                this.angleTimeOffset +
                    (i + 1) * props.segmentWidth +
                    i * props.segmentSpacing
            );
            context.stroke();
        }

        context.restore();
        if (!ignorePerspective) {
            this.manager.unsetPerspectiveMode(context);
        }
    };

    getAbsolutePosition = function () {
        return this.manager.transformToAbsolutePosition(this.position, this);
    };

    setPosition = function (position) {
        this.x = position.x;
        this.y = position.y;
    };

    startOpenTimer = function (timer) {
        this.animation = new FadeInOutAnimation(
            this.manager,
            this.manager.config.FADE_IN_TIME,
            this,
            0,
            false
        );
    };

    getBaseRadius = function () {
        let radius = this.radius;
        return radius;
    };

    getThicknessModifier = function () {
        let thicknessModifier = 1;
        thicknessModifier *= Utils.clamp(
            this.radius / this.manager.config.MAX_CURSOR_RADIUS,
            0.5,
            1
        );
        return thicknessModifier;
    };

    getDrawingProperties = function () {
        let thicknessModifier = this.getThicknessModifier();

        let radius = this.getBaseRadius();
        let firstLineWidth = 10 * thicknessModifier + radius * 0.2;
        let secondLineWidth = 15 * thicknessModifier + radius * 0.2;

        let segmentCount = 10;
        let segmentSpacing = 0.07;
        let totalSpacing = segmentSpacing * segmentCount;
        let segmentWidth = (2 * Math.PI - totalSpacing) / segmentCount;

        return {
            firstLineWidth: firstLineWidth,
            radius: radius,
            secondLineWidth: secondLineWidth,
            segmentCount: segmentCount,
            segmentSpacing: segmentSpacing,
            segmentWidth: segmentWidth,
            thicknessModifier: thicknessModifier,
            totalSpacing: totalSpacing,
        };
    };

    getOuterRadius = function () {
        let props = this.getDrawingProperties();
        return props.radius + props.firstLineWidth + props.secondLineWidth / 2;
    };
}

let Utils = {};

Utils.clamp = function (value, min, max) {
    return Math.max(Math.min(value, max), min);
};
