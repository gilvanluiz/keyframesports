let KeyFrame = function (time, position) {
    this.time = time;
    this.position = position;
};

export class KeyFrameManager {
    constructor() {
        this.keyFrames = [];
    }

    // pre: time > latest keyframe
    pushKeyFrame = function (time, position) {
        let kf = new KeyFrame(time, position);
        this.keyFrames.push(kf);
    };

    setKeyFrame = function (time, newPosition) {
        let position = this.getPosition(time, false);
        if (position) {
            position.x = newPosition.x;
            position.y = newPosition.y;
        } else {
            // TODO: this should call the function below, which inserts ordered
            this.pushKeyFrame(time, position);
        }
    };

    getPosition = function (time, interpolate) {
        for (let i = 0; i < this.keyFrames.length; i++) {
            if (this.keyFrames[i].time == time) {
                return this.keyFrames[i].position;
            }
        }
        if (interpolate) {
            // todo: it should interpolate
        }
        return null;
    };
}
