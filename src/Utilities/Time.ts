export const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const mins = Math.floor((time / 60) % 60);
    const secs = Math.floor(time % 60);

    let hoursString = '';
    let minsString = '';
    let secsString = '';

    if (hours < 10) {
        if (hours !== 0) {
            hoursString = '0' + hours + ':';
        }
    } else {
        hoursString = hours + ':';
    }

    if (mins < 10) {
        minsString = '0' + mins;
    } else {
        minsString = mins + ':';
    }

    if (secs < 10) {
        secsString = '0' + secs;
    } else {
        secsString += secs;
    }

    return `${hoursString}${minsString}:${secsString}`;
};
