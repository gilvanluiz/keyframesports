import * as React from 'react';
import { formatTime } from '../../../Utilities/Time';

interface IProps {
    videoTime: number;
}

const VideoTime = ({ videoTime }: IProps) => {
    return <span style={{ fontWeight: 'bold' }}>{formatTime(videoTime)}</span>;
};

export default VideoTime;
