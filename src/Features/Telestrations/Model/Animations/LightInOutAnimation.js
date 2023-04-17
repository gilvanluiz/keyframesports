import { TimelineLite, Power2, Power3 } from 'gsap';

export class LightInOutAnimation {
    constructor(manager, timer, baseRadius, owner, isClose) {
        this.lightAnimationCoefficient = 0;
        this.timeline = new TimelineLite();
        this.owner = owner;
        if (isClose) {
            this.fullyOpen = true;
            this.timeline.to(this, timer * 0.3, {
                ease: Power3.easeOut,
                lightAnimationCoefficient: 1,
            });
            this.timeline.to(this, timer * 0, { lightAnimationCoefficient: 1 });
            this.timeline.set(this, { fullyOpen: false });
            this.timeline.to(this, timer * 0.4, {
                ease: Power2.easeOut,
                lightAnimationCoefficient: 0,
            });
            this.timeline.eventCallback('onComplete', () => {
                this.manager.removeClosingObject(owner);
            });
        } else {
            this.fullyOpen = false;
            this.timeline.to(this, timer * 0.6, {
                ease: Power2.easeOut,
                lightAnimationCoefficient: 1,
            });
            this.timeline.to(this, timer * 0.2, {
                lightAnimationCoefficient: 1,
            });
            this.timeline.set(this, { fullyOpen: true });
            this.timeline.to(this, timer * 0.4, {
                ease: Power2.easeOut,
                lightAnimationCoefficient: 0,
            });
        }

        this.manager = manager;
        this.angleTimeOffset = 0;
        this.baseRadius = baseRadius;
    }

    clear = function () {
        if (this.timeline) {
            this.timeline.kill();
        }
    };

    update = function (delta) {
        this.angleTimeOffset += (delta * 2 * Math.PI) / 2;
    };

    draw = function (context, position) {
        context.save();
        // render images for closing
        context.translate(position.x, position.y);
        context.rotate(this.angleTimeOffset);
        context.translate(-position.x, -position.y);

        let radius = this.baseRadius * this.lightAnimationCoefficient * 2.5;
        context.drawImage(
            this.manager.pointyLightImage,
            position.x - radius / 2,
            position.y - radius / 2,
            radius,
            radius
        );
        context.drawImage(
            this.manager.shinyLightImage,
            position.x - radius / 2,
            position.y - radius / 2,
            radius,
            radius
        );
        context.restore();
    };
}
