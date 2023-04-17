import { gsap } from 'gsap';

export class FadeInOutAnimation {
    constructor(manager, timer, owner, startOpacity, isClose) {
        this.opacity = startOpacity;
        this.targetOpacity = isClose ? 0 : 1;
        this.time = timer;
        this.owner = owner;
        this.manager = manager;
        this.tween = gsap.to(this, timer, { opacity: this.targetOpacity });
        this.tween.eventCallback('onComplete', () => {
            if (isClose) {
                this.manager.removeClosingObject(this.owner);
            } else {
                this.owner.animation = null;
            }
        });
    }

    cancel = function () {
        this.tween.kill();
    };

    set = function (context) {
        context.globalAlpha = this.opacity;
    };
}
