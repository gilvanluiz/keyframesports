import * as React from 'react';
import {
    Slider,
    makeStyles,
    createStyles,
    Theme as ITheme,
    Divider,
} from '@material-ui/core';

import { compose } from 'fp-ts/lib/function';
import {
    VideoPlayAction,
    VideoStopAction,
    // RelativeCurrentTimeChangeAction,
    // VideoPlayAction,
    // VideoStopAction,
    withTelestrationState,
} from '../State';

import {
    PlayArrow as PlayArrowIcon,
    Pause as PauseIcon,
    FastForward as ForwardIcon,
    FastRewind as RewindIcon,
    // VolumeOff as VolumnOffIcon,
    // VolumeMute as VolumnMuteIcon,
    VolumeDown as VolumnDownIcon,
    // VolumeUp as VolumnUpIcon,
    ZoomIn,
} from '@material-ui/icons';

import { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ITelestrationStateMgr } from '../Types';

const VideoSlider = withStyles({
    root: {
        height: '25px',
        width: '85%',
    },
    track: {
        opacity: 0,
        height: '25px',
    },
    rail: {
        height: '25px',
        background: 'black',
    },
})(Slider);

const ZoomSlider = withStyles({
    root: {
        height: '10px',
        borderRadius: '10px',
    },
    track: {
        opacity: 0,
        height: '0px',
    },
    rail: {
        height: '10px',
        background: 'black',
        borderRadius: '10px',
    },
})(Slider);

let needPlay = false;

const convertTime = (second: number) => {
    if (!second) {
        return '0';
    }
    const padString = Math.floor(second).toString().padStart(2, '0');
    return `00:${padString}`;
};

const useStyles = makeStyles((theme: ITheme) =>
    createStyles({
        // thumbLine: {
        //     backgroundColor: '#fff',
        //     minWidth: '1px',
        //     minHeight: '84px',
        //     borderRadius: '0px',
        // },
        thumbLine: {
            backgroundColor: '#fff',
            minWidth: '7px',
            minHeight: '30px',
            borderRadius: '7px',
        },
        thumbLineZoom: {
            backgroundColor: '#fff',
            minWidth: '5px',
            minHeight: '15px',
            borderRadius: '5px',
        },

        thumbTriangle: {
            marginTop: '-2px',
            fontSize: '0px',
            lineHeight: '0%',
            width: '0px',
            borderBottom: '15px solid #fff',
            borderLeft: '10px solid rgba(0, 0, 0, 0)',
            borderRight: '10px solid rgba(0, 0, 0, 0)',
        },
    })
);

const Thumb = (props: any) => {
    const classes = useStyles();

    const style = {
        ...props.style,
        marginLeft: '0px',
        marginRight: '0px',
        display: 'flex',
        flexDirection: 'column' as 'column',
        width: 'auto',
        height: 'auto',
        top: '15px',
        // boxShadow: '#ebebeb 0 2px 2px',
        '&:focus, &:hover, &$active': {
            boxShadow: '#ccc 0 2px 3px 1px',
        },
    };

    return (
        <div {...props} style={style}>
            <div className={classes.thumbLine} />
        </div>
    );
};

const ThumbZoom = (props: any) => {
    const classes = useStyles();

    const style = {
        ...props.style,
        marginLeft: '0px',
        marginRight: '0px',
        display: 'flex',
        flexDirection: 'column' as 'column',
        width: 'auto',
        height: 'auto',
        top: '15px',
        // boxShadow: '#ebebeb 0 2px 2px',
        '&:focus, &:hover, &$active': {
            boxShadow: '#ccc 0 2px 3px 1px',
        },
    };

    return (
        <div {...props} style={style}>
            <div className={classes.thumbLineZoom} />
        </div>
    );
};

const styles = (theme: ITheme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    controlButtons: {
        minWidth: '70px',
        maxWidth: '70px',
        textAlign: 'center' as 'center',
        '& > svg': {
            cursor: 'pointer',
        },
    },
});

interface IProgressBarProps {
    classes: any;
    telestrationStateMgr: ITelestrationStateMgr;
}

const progressBar = ({ classes, telestrationStateMgr }: IProgressBarProps) => {
    const { state, dispatchAction } = telestrationStateMgr;

    const {
        telestrationTime,
        totalTelestrationDuration,
        // videoPauseArray,
        telestrationTimeTrackStoped,
        recording,
    } = state;

    const { videoRef } = recording;

    const [progressState, setProgressState]: [any, any] = useState(0);
    // const [volumnState, setVolumeState]: [any, any] = useState('volumoff');

    const onChange = (event: any, value: number) => {
        const { current: video } = videoRef;
        if (video) {
            if (!video.paused) {
                video.pause();
                needPlay = true;
            }
            // Call 'setProgressState' in end of event loop
            setTimeout(() => setProgressState(value), 0);
        }
    };

    const onChangeCommitted = (event: any, value: number) => {
        const { current: video } = videoRef;
        if (video) {
            if (needPlay) {
                video.play();
                needPlay = false;
            }
            const time = (video.duration * value) / 100;
            video.currentTime = time;
            setProgressState(value);
            updatePreview(time);
        }
    };

    const updatePreview = async (time: number) => {
        const { current: video } = videoRef;

        if (video && video.paused) {
            const currentVolume = video.volume;
            // Turn off volume for update preview without sound.
            video.volume = 0;
            await video.play();
            await video.pause();
            video.currentTime = time;
            video.volume = currentVolume;
        }
    };

    const play = () => {
        const { current: video } = videoRef;
        if (video) {
            dispatchAction(VideoPlayAction());
            // return video.paused ? video.play() : video.pause();
        }
    };

    const stop = () => {
        const { current: video } = videoRef;
        if (video) {
            dispatchAction(VideoStopAction());
            // return video.paused ? video.play() : video.pause();
        }
    };

    useEffect(() => {
        setProgressState((telestrationTime / totalTelestrationDuration) * 100);
    }, [telestrationTime]);

    return (
        <div
            className={classes.container}
            style={{
                backgroundColor: '#5C5C5C',
                height: '35px',
                paddingRight: '20px',
                fontSize: 'x-large',
            }}
        >
            <div className={classes.controluttons} style={{ display: 'flex' }}>
                {telestrationTimeTrackStoped ? (
                    <PlayArrowIcon fontSize='inherit' onClick={play} />
                ) : (
                    <PauseIcon fontSize='inherit' onClick={stop} />
                )}
                <RewindIcon fontSize='inherit' />
                <ForwardIcon fontSize='inherit' />
                <Divider orientation='vertical' flexItem />
                <VolumnDownIcon fontSize='inherit' />
            </div>

            <VideoSlider
                style={{ opacity: 1 }}
                value={progressState}
                ThumbComponent={Thumb}
                onChangeCommitted={onChangeCommitted}
                onChange={onChange}
                step={0.1}
            ></VideoSlider>
            <div
                style={{
                    display: 'flex',
                    position: 'absolute',
                    width: '85%',
                    left: '12%',
                    backgroundColor: 'red',
                    fontSize: '8px',
                    pointerEvents: 'none',
                    top: '30px',
                }}
            ></div>

            <div
                style={{
                    display: 'flex',
                    gap: '10px',
                    width: '150px',
                    position: 'relative',
                    alignItems: 'center',
                    right: '0px',
                    left: '10px',
                }}
            >
                <div
                    style={{
                        fontSize: '15px',
                        left: '10px',
                    }}
                >
                    {convertTime(totalTelestrationDuration)}
                </div>

                <ZoomSlider value={10} ThumbComponent={ThumbZoom} step={0.1} />
                <ZoomIn fontSize='inherit' />
            </div>
        </div>
    );
};

export const ProgressBar = compose(
    withTelestrationState,
    withStyles(styles)
)(progressBar);
