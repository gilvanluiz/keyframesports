export class DrawnObjectDetail {
    constructor(object, currentVideoTime, type, index) {
        this.index = index;
        this.type = type;
        this.title = `${type} ${index}`;
        this.object = object;
        this.isSelected = false;
        // this.videoPauseDuration = {
        //     startTime: currentVideoTime - 1 < 0 ? 0 : currentVideoTime - 1,
        //     endTime: currentVideoTime + 4,
        // };
        // this.objectDuration = {
        //     startTime: currentVideoTime,
        //     endTime: currentVideoTime + 3,
        // };
        this.videoPauseDuration = {
            startTime: currentVideoTime,
            endTime: currentVideoTime + 5,
        };
        this.objectDuration = {
            startTime: currentVideoTime + 1,
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
    switchSelected = function () {
        if (this.type === 'circle') {
            this.isSelected ? this.object.lowLight() : this.object.highLight();
        }
        this.isSelected = !this.isSelected;
    };
}
