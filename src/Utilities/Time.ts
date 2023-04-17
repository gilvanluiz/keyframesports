export const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const mins = Math.floor((time / 60) % 60);
    let secs = `${Math.floor(time % 60)}`;
    if (+secs < 10) {
        secs = '0' + secs;
    }

    return `${hours > 0 ? hours + ':' : ''}${mins}:${secs}`;
};
