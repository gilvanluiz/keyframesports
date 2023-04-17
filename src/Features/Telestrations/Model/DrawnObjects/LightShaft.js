import { KeyFrameManager } from '../KeyFrameManager';
import { FadeInOutAnimation } from '../Animations/FadeInOutAnimation';

export class LightShaft {
    constructor(
        manager,
        initialTime,
        initialPosition,
        isTemporal,
        cursorRadius,
        zAngle
    ) {
        this.isClosing = false;
        this.closeTimer = 0;
        this.zAngle = zAngle;

        this.keyFrames = new KeyFrameManager();
        this.keyFrames.pushKeyFrame(initialTime, initialPosition);

        this.position = initialPosition;

        this.alpha = 0.35;
        this.radius = cursorRadius;

        this.manager = manager;
        this.animation = null;

        this.angleTimeOffset = 0;
    }

    startOpenTimer = function (timer) {
        this.animation = new FadeInOutAnimation(
            this.manager,
            this.manager.config.FADE_IN_TIME,
            this,
            0,
            false
        );
    };

    setRadius = function (newRadius) {
        this.radius = newRadius;
    };

    setZAngle = function (zAngle) {
        this.zAngle = zAngle;
    };

    update = function (delta) {
        this.angleTimeOffset += delta * Math.PI * 0.6;
    };

    draw = function (context, time, background) {
        let position = this.position;

        this.manager.setObjectPerspectiveMode(this, context);
        position = this.manager.transformToAbsolutePosition(position, this);

        let opacityModifier = this.animation ? this.animation.opacity : 1;
        // now draw the inner secondary color arcs ars
        context.save();

        context.globalAlpha = opacityModifier * this.alpha;
        context.fillStyle = '#ffffff';
        context.strokeStyle = '#ffffff';

        // calculate appropiate radius
        let radius = this.radius;

        context.save();

        if (background) {
            let largeGradient = context.createRadialGradient(
                position.x,
                position.y,
                0,
                position.x,
                position.y,
                radius * 1.8
            );
            largeGradient.addColorStop(0, 'white');
            largeGradient.addColorStop(0.9, 'white');
            largeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            let ringGradient = context.createRadialGradient(
                position.x,
                position.y,
                radius * 0.3,
                position.x,
                position.y,
                radius * 1.5
            );
            ringGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            ringGradient.addColorStop(0.4, 'white');
            ringGradient.addColorStop(0.6, 'white');
            ringGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            context.beginPath();
            context.arc(position.x, position.y, radius * 1.8, 0, 2 * Math.PI);

            context.save();
            context.globalAlpha = opacityModifier * (this.alpha + 0.15);
            context.fillStyle = ringGradient;
            context.fill();

            context.globalAlpha = opacityModifier * 0.1;
            context.fillStyle = largeGradient;
            context.fill();
            context.restore();

            context.restore();

            this.drawAnimatingLight(
                context,
                position,
                radius * 1.2,
                opacityModifier
            );
        } else {
            context.beginPath();
            let topRadiusFraction = 1;
            let starty = -5;
            context.moveTo(position.x - radius * topRadiusFraction, starty);
            context.lineTo(position.x + radius * topRadiusFraction, starty);
            context.lineTo(position.x + radius, position.y);
            context.lineTo(position.x - radius, position.y);
            context.lineTo(position.x - radius * topRadiusFraction, starty);

            context.shadowBlur = 10;
            context.shadowColor = '#ffffff';

            let yscale = 1 + 2 / Math.pow(this.zAngle, 1.3);
            context.scale(1, yscale);
            let lightGradient = context.createRadialGradient(
                position.x,
                position.y / yscale,
                radius,
                position.x,
                position.y / yscale,
                5000 / yscale
            );
            lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            lightGradient.addColorStop(0.01 * yscale, 'white');
            lightGradient.addColorStop(1, 'white');

            context.fillStyle = lightGradient;
            context.fill();
            context.restore();
        }

        context.restore();

        this.manager.unsetPerspectiveMode(context);
    };

    drawAnimatingLight = function (context, position, radius, opacityModifier) {
        let lightPosition = {
            x: position.x + Math.cos(this.angleTimeOffset) * radius,
            y: position.y + Math.sin(this.angleTimeOffset) * radius,
        };

        radius = radius * 0.6;
        context.save();
        // render images for closing
        context.translate(lightPosition.x, lightPosition.y);
        context.rotate(this.angleTimeOffset);
        context.translate(-lightPosition.x, -lightPosition.y);

        context.shadowBlur = 2;
        context.shadowColor = 'white';
        context.globalAlpha = opacityModifier * 0.3;
        context.drawImage(
            this.manager.sharpLightImage,
            lightPosition.x - radius / 2,
            lightPosition.y - radius / 2,
            radius,
            radius
        );
        context.restore();
    };

    setKeyFrame = function (time, position) {
        this.position = position;
        this.keyFrames.setKeyFrame(time, position);
    };
}
