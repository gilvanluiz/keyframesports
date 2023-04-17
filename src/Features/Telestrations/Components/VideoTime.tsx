import * as React from 'react';
import { useEffect, useState } from 'react';
import { formatTime } from '../../../Utilities/Time';

const VideoTime = ({ videoRef }: any) => {
    const [videoTime, setVideoTime]: [any, any] = useState('0:0');

    const updateTime = () => {
        const { current: video } = videoRef;

        if (video) {
            const onTick = () => setVideoTime(formatTime(video.currentTime));
            video.addEventListener('timeupdate', onTick);
            return () => video.removeEventListener('timeupdate', onTick);
        }

        return undefined;
    };

    useEffect(updateTime, []);

    return <div style={{ fontWeight: 'bold' }}>{videoTime}</div>;
};

export default VideoTime;
