import * as React from 'react';
import { useEffect, useState, RefObject } from 'react';
import {
    withStyles,
    WithStyles as IWithStyles,
} from '@material-ui/core/styles';
import { VideoSlider, videoSliderStyles } from './ProgressBarStyles';

interface IProps {
    videoRef: RefObject<HTMLVideoElement>;
    updatePreview: (time: number) => Promise<void>;
    videoTime: number;
    setVideoTime: (value: React.SetStateAction<number>) => void;
}

let needPlay = false;

const ThumbComponent = (props: any) => {
    return (
        <span {...props}>
            <span className='bar' />
            <span className='bar' />
        </span>
    );
};

const progressBar = ({
    videoRef,
    updatePreview,
    classes,
    videoTime,
    setVideoTime,
}: IProps & IWithStyles) => {
    const [progressState, setProgressState] = useState(0);

    useEffect(() => {
        const { current: video } = videoRef;
        if (video) {
            const percentFinished = (videoTime / +video.duration) * 100;
            setProgressState(percentFinished);
        }
    }, [videoTime]);

    function onChange(event: React.ChangeEvent<{}>, value: number) {
        const { current: video } = videoRef;
        if (video) {
            if (!video.paused) {
                video.pause();
                needPlay = true;
            }
            // Call 'setProgressState' in end of event loop
            const newTime = (value * video.duration) / 100;
            setTimeout(() => {
                setProgressState(value);
                setVideoTime(newTime);
            }, 0);
        }
    }

    function onChangeCommitted(event: React.ChangeEvent<{}>, value: number) {
        const { current: video } = videoRef;

        if (video) {
            if (needPlay) {
                video.play();
                needPlay = false;
            }
            const time = (video.duration * value) / 100;
            video.currentTime = time;
            setProgressState(value);
            const newTime = (value * video.duration) / 100;
            setVideoTime(newTime);
            updatePreview(time);
        }
    }

    return (
        <VideoSlider
            ThumbComponent={ThumbComponent}
            className={classes.videoSlider}
            value={progressState}
            onChangeCommitted={onChangeCommitted}
            onChange={onChange}
            step={0.1}
        />
    );
};

export const ProgressBar = withStyles(videoSliderStyles)(progressBar);
