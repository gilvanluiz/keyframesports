export class DrawnObjectDetail {
    constructor(object, currentVideoTime) {
        this.object = object;
        this.videoPauseDuration = {
            startTime: currentVideoTime,
            endTime: currentVideoTime + 5,
        };
        this.objectDuration = {
            startTime: currentVideoTime,
            endTime: currentVideoTime + 4,
        };
    }
    setObjectDuration = function (startT, endT) {
        this.objectDuration.startTime = startT;
        this.objectDuration.endTime = endT;
    };

    setVideoPauseDuration = function (startT, endT) {
        this.videoPauseDuration.startTime = startT;
        this.videoPauseDuration.endTime = endT;
    };
}
