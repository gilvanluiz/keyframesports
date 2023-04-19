import { IVideoPause } from '../Types';

export const getRelativeTime = (
    currentVideoTime: number,
    videoPauseArray: IVideoPause[]
) => {
    console.log(videoPauseArray);
    let before = 0;
    let vT = 0;
    let i = 0;
    // for (i = 0; i < videoPauseArray.length; i++) {
    //     if (vT + videoPauseArray[i].startTime - before >= currentVideoTime) {
    //         break;
    //     }
    //     before = videoPauseArray[i].endTime;
    //     vT += videoPauseArray[i].startTime - before;
    // }

    while (
        i < videoPauseArray.length &&
        vT + videoPauseArray[i].startTime - before < currentVideoTime
    ) {
        vT += videoPauseArray[i].startTime - before;
        before = videoPauseArray[i].endTime;

        i++;
    }
    return before + currentVideoTime - vT;
};

export const getRelativeTimeFromPercentage = (
    progressState: number,
    totalVideoDuration: number
) => {
    return (totalVideoDuration * progressState) / 100;
};

export const getPercentageFromRelativeTime = (
    relativeCurrentVideoTime: number,
    totalVideoDuration: number
) => {
    return (relativeCurrentVideoTime / totalVideoDuration) * 100;
};
