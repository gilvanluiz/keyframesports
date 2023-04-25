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
    ITelestrationPercentateChangeAction,
    ITelestrationPercentateCommittedAction,
    TelestrationPlayAction,
    TelestrationStopAction,
    // RelativeCurrentTimeChangeAction,
    // TelestrationPlayAction,
    // TelestrationStopAction,
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
import { ITelestrationStateMgr, IVideoPause } from '../Types';
import { formatTime } from 'src/Utilities/Time';

const VideoSlider = withStyles({
    root: {
        height: '100%',
        width: '100%',
        padding: '0',
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

const useStyles = makeStyles((theme: ITheme) =>
    createStyles({
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
        top: '2px',
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
        top: '14px',
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
        textAlign: 'center' as 'center',
        display: 'flex',
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
        telestrationTimeTrackStoped,
        videoPauseArray,
        recording,
    } = state;

    const { videoRef } = recording;

    const [progressState, setProgressState]: [any, any] = useState(0);
    // const [volumnState, setVolumeState]: [any, any] = useState('volumoff');

    const onChange = (event: any, value: number) => {
        dispatchAction(ITelestrationPercentateChangeAction(value));
    };

    const onChangeCommitted = (event: any, value: number) => {
        dispatchAction(ITelestrationPercentateCommittedAction(value));
    };

    // const updatePreview = async (time: number) => {
    //     const { current: video } = videoRef;

    //     if (video && video.paused) {
    //         const currentVolume = video.volume;
    //         // Turn off volume for update preview without sound.
    //         video.volume = 0;
    //         await video.play();
    //         await video.pause();
    //         video.currentTime = time;
    //         video.volume = currentVolume;
    //     }
    // };

    const play = () => {
        const { current: video } = videoRef;
        if (video) {
            dispatchAction(TelestrationPlayAction());
        }
    };

    const stop = () => {
        const { current: video } = videoRef;
        if (video) {
            dispatchAction(TelestrationStopAction());
        }
    };

    useEffect(() => {
        setProgressState((telestrationTime / totalTelestrationDuration) * 100);
    }, [telestrationTime, totalTelestrationDuration]);

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
            <div className={classes.controlButtons}>
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

            <div
                style={{
                    position: 'relative',
                    width: '85%',
                    height: '25px',
                }}
            >
                {videoPauseArray.map((e: IVideoPause, i: number) => {
                    return (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',

                                width: `${
                                    ((e.endTime - e.startTime) /
                                        totalTelestrationDuration) *
                                    100
                                }%`,
                                left: `${
                                    (e.startTime / totalTelestrationDuration) *
                                    100
                                }%`,

                                height: '100%',
                                top: '0px',
                                background:
                                    'linear-gradient(90deg, rgba(158,158,158,1) 50%, rgba(123,123,123,1) 50%)',
                                backgroundSize: '10px',
                                backgroundRepeat: 'repeat',
                            }}
                        ></div>
                    );
                })}
                <VideoSlider
                    style={{ opacity: 1 }}
                    value={progressState}
                    ThumbComponent={Thumb}
                    onChangeCommitted={onChangeCommitted}
                    onChange={onChange}
                    step={100 / totalTelestrationDuration / 5}
                ></VideoSlider>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: '5px',
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
                    {formatTime(totalTelestrationDuration)}
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
