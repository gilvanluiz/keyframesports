import { ITelestrationState, IVideoPause } from '../Types';

export const getTelestrationTimeFromVideoTime = (
    currentVideoTime: number,
    videoPauseArray: IVideoPause[]
) => {
    if (videoPauseArray.length === 0) {
        return currentVideoTime;
    }
    let before = 0;
    let vT = 0;
    let i = 0;

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

export const getVideoTimeFromTelestrationTime = (
    telestrationTime: number,
    videoPauseArray: IVideoPause[]
) => {
    if (videoPauseArray.length === 0) {
        return telestrationTime;
    }
    let tT = 0;
    let i = 0;

    while (
        i < videoPauseArray.length &&
        videoPauseArray[i].startTime <= telestrationTime
    ) {
        if (!i) {
            tT += videoPauseArray[i].startTime;
        } else {
            tT += videoPauseArray[i].startTime - videoPauseArray[i - 1].endTime;
        }
        i++;
    }
    console.log(videoPauseArray);
    if (videoPauseArray[i - 1].endTime < telestrationTime) {
        tT += telestrationTime - videoPauseArray[i - 1].endTime;
    }

    return tT;
};

export const getTelestrationTimeFromPercentage = (
    progressState: number,
    totalTelestrationDuration: number
) => {
    return (totalTelestrationDuration * progressState) / 100;
};

export const getPercentageFromTeleTime = (
    teleTime: number,
    totalTelestrationDuration: number
) => {
    return (teleTime / totalTelestrationDuration) * 100;
};

export const getTeleTimeFromPercentage = (
    percent: number,
    totalTeleTime: number
) => {
    return (totalTeleTime * percent) / 100;
};

export const calculateTotalTime = (state: ITelestrationState) => {
    // start -> cacullate total video duration and all video paused time
    const { recording } = state;
    const { videoRef } = recording;
    state.totalTelestrationDuration = 0;
    state.videoPauseArray = [];
    if (videoRef.current) {
        state.totalTelestrationDuration += videoRef.current.duration;
    }

    if (state.telestrationManager.addedShapes.length > 0) {
        let pauseD = 0;

        state.telestrationManager.addedShapes.forEach((addedShape: any) => {
            const { videoPauseDuration } = addedShape;

            const overState = {
                startOvered: -1,
                endOvered: -1,
                covered: [] as any,
            };

            state.videoPauseArray.forEach(
                (videoPause: IVideoPause, index: number) => {
                    if (
                        videoPauseDuration.startTime >= videoPause.startTime &&
                        videoPauseDuration.startTime <= videoPause.endTime
                    ) {
                        overState.startOvered = index;
                    }
                    if (
                        videoPauseDuration.endTime >= videoPause.startTime &&
                        videoPauseDuration.endTime <= videoPause.endTime
                    ) {
                        overState.endOvered = index;
                    }

                    if (
                        videoPauseDuration.startTime < videoPause.startTime &&
                        videoPauseDuration.endTime > videoPause.endTime
                    ) {
                        overState.covered.push(index);
                    }
                }
            );

            if (overState.covered.length > 0) {
                console.log('covered object:>>>', overState.covered);
                overState.covered.forEach((c: number, i: number) => {
                    state.videoPauseArray.splice(c - i, 1);
                });
            }

            if (overState.startOvered !== -1 && overState.endOvered !== -1) {
                // full overed
                console.log('full overed');
                if (overState.startOvered !== overState.endOvered) {
                    pauseD +=
                        state.videoPauseArray[overState.endOvered].startTime -
                        state.videoPauseArray[overState.startOvered].endTime;

                    state.videoPauseArray[overState.startOvered].endTime =
                        state.videoPauseArray[overState.endOvered].endTime;

                    state.videoPauseArray.splice(overState.endOvered, 1);
                }
            } else if (
                overState.startOvered !== -1 &&
                overState.endOvered === -1
            ) {
                // only start overed
                console.log('only start overed');
                pauseD +=
                    videoPauseDuration.endTime -
                    state.videoPauseArray[overState.startOvered].endTime;
                state.videoPauseArray[overState.startOvered].endTime =
                    videoPauseDuration.endTime;
            } else if (
                overState.startOvered !== -1 &&
                overState.endOvered === -1
            ) {
                // only end overed
                console.log('only end overed');
                pauseD +=
                    state.videoPauseArray[overState.startOvered].startTime -
                    videoPauseDuration.startTime;

                state.videoPauseArray[overState.startOvered].startTime =
                    videoPauseDuration.startTime;
            } else {
                // no overed
                console.log('no overed');
                pauseD +=
                    videoPauseDuration.endTime - videoPauseDuration.startTime;

                state.videoPauseArray.push({ ...videoPauseDuration });
                state.videoPauseArray.sort((x, y) => {
                    return x.startTime - y.startTime;
                });
            }
        });
        state.totalTelestrationDuration += pauseD;
    }

    // end -> cacullate total video duration and all video pausedtime
};

export const isPuaseTime = (
    teleTime: number,
    videoPauseArray: IVideoPause[]
) => {
    let isPause = false;
    let i = 0;

    while (i < videoPauseArray.length) {
        if (
            teleTime >= videoPauseArray[i].startTime &&
            teleTime <= videoPauseArray[i].endTime
        ) {
            isPause = true;
            break;
        }
        i++;
    }
    return isPause;
};
