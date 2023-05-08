import * as React from 'react';
import { formatTime } from '../../../Utilities/Time';

const VideoTime = (telestrationTime: any) => {
    return (
        <div style={{ fontWeight: 'bold' }}>{formatTime(telestrationTime)}</div>
    );
};

export default VideoTime;
