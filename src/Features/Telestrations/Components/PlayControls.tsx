import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { Popover, Typography } from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';
import { compose } from 'fp-ts/lib/function';
// import { SoundBar } from './SoundBar';
import { ProgressBar } from './ProgressBar';
import {
    RelativeCurrentTimeChangeAction,
    withTelestrationState,
} from '../State';
import { ITelestrationStateMgr } from '../Types';
import { TimeBar } from './TimeBar';
import { ShapeRow } from './ShapeRow';
import { useRef } from 'react';

const styles = (theme: Theme) => ({
    container: {
        background: theme.palette.primary.dark,
    },
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as 'column',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    buttonRow: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlMainContainer: {
        display: 'grid',
        gridTemplateColumns: '200px auto 200px',
    },
    volumeSlider: {
        padding: 0,
    },
    videoTitle: {
        margin: 'auto auto auto 8px',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        maxWidth: '240px',
        whiteSpace: 'nowrap' as 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontWeight: 'bold' as 'bold',
    },
    videoTime: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
    },
    popover: {
        pointerEvents: 'none' as 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
});

interface IPlayControlProps {
    classes: any;
    videoRef: React.RefObject<HTMLVideoElement>;
    videoTitle: string;
    state: any;
    telestrationStateMgr: ITelestrationStateMgr;
}

export const playControls = ({
    classes,
    videoRef,
    videoTitle,
    // state,
    telestrationStateMgr,
}: IPlayControlProps) => {
    const [volumeState, setVolumeState]: [any, any] = useState({
        previous: 1,
        current: 1,
    });
    const { state, dispatchAction } = telestrationStateMgr;
    const [popover, setPopover]: [any, any] = useState(null);
    // const [pauseVideoDuration, setPauseVideoDuration]: [number, any] = useState(
    // 0
    // );
    // const [videoDuration, setVideoDuration]: [number, any] = useState(0);

    const handlePopoverClose = () => {
        setPopover(null);
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
    const updateRelativeVideoTime = (time: number) => {
        dispatchAction(RelativeCurrentTimeChangeAction(time));
    };
    const keyDownHandler = useCallback(
        (event: any) => {
            const { code } = event;
            const { current: video } = videoRef;
            /* tslint:disable-next-line */
            if (window['STOP_KEY_LISTENERS']) {
                return false;
            }

            if (video) {
                switch (code) {
                    case 'KeyK':
                    case 'Space': {
                        event.preventDefault();
                        event.stopPropagation();
                        return video.paused ? video.play() : video.pause();
                    }
                    case 'Up':
                    case 'ArrowUp': {
                        return video.paused ? video.play() : null;
                    }
                    case 'Down':
                    case 'ArrowDown': {
                        return !video.paused ? video.pause() : null;
                    }
                    case 'Left':
                    case 'ArrowLeft': {
                        const time = video.currentTime - 2;
                        video.currentTime = time;
                        updatePreview(time);
                        return video.currentTime;
                    }
                    case 'Right':
                    case 'ArrowRight': {
                        const time = video.currentTime + 2;
                        video.currentTime = time;
                        updatePreview(time);
                        return video.currentTime;
                    }
                    case 'KeyM': {
                        const volume =
                            video.volume > 0
                                ? 0
                                : volumeState.previous === 0
                                ? 1
                                : volumeState.previous;
                        video.volume = volume;
                        setVolumeState({
                            ...volumeState,
                            current: volume,
                        });
                        return video.volume;
                    }
                    default: {
                        return;
                    }
                }
            } else {
                return;
            }
        },
        [volumeState]
    );

    // const dispatchKeyboardEvent = (code: string) => {
    //     const { current: video } = videoRef;

    //     if (
    //         (code === 'Pause' && video?.paused) ||
    //         (code === 'Play' && !video?.paused)
    //     ) {
    //         return;
    //     }

    //     return document.dispatchEvent(
    //         new KeyboardEvent('keydown', {
    //             code: code === 'Play' || code === 'Pause' ? 'Space' : code,
    //         })
    //     );
    // };

    const controlsListener = () => {
        document.addEventListener('keydown', keyDownHandler);

        return () => document.removeEventListener('keydown', keyDownHandler);
    };
    const rowRef = useRef<HTMLDivElement>(null);
    useEffect(controlsListener, [volumeState]);

    // const clickHandle = () => {
    //     const { telestrationManager: tMgr } = state;
    //     if (
    //         tMgr.currentFunction === tMgr.FUNCTION_ENUM.LIVE_MODE_PLACE_CURSOR
    //     ) {
    //         if (tMgr.cursors.length) {

    //         }
    //     }
    // };

    // useEffect(() => {
    //     const { current: video } = videoRef;
    //     if (video) {
    //         window.addEventListener('click', clickHandle);
    //         return () => window.removeEventListener('click', clickHandle);
    //     } else {
    //         return undefined;
    //     }
    // }, []);

    return (
        <div
            className={classes.container}
            // style={{ height: '100%' }}
        >
            <div
                style={{
                    padding: '10px',
                    textAlign: 'center',
                }}
            >
                {videoTitle}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    // padding: '0px 70px 25px 0px',
                }}
            >
                <ProgressBar
                    videoRef={videoRef}
                    updatePreview={updatePreview}
                    relativeCurrentVideoTime={state.relativeCurrentVideoTime}
                    totalVideoDuration={state.totalVideoDuration}
                    videoPauseArray={state.videoPauseArray}
                />
                <TimeBar
                    videoRef={videoRef}
                    totalVideoDuration={state.totalVideoDuration}
                    updatePreview={updatePreview}
                    relativeCurrentVideoTime={state.relativeCurrentVideoTime}
                    updateRelativeVideoTime={updateRelativeVideoTime}
                />
                <div
                    style={{
                        overflowX: 'auto',
                        height: '130px',
                        scrollbarColor: '#aaaaaa',
                        scrollbarWidth: '6px',
                        scrollBehavior: 'auto',
                        gap: '2px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    ref={rowRef}
                >
                    {state.telestrationManager.addedShapes.map(
                        (shape: any, index: number) => (
                            <ShapeRow
                                key={index}
                                title={`Circle ${index + 1}`}
                                shapeDetail={shape}
                                totalVideoDuration={state.totalVideoDuration}
                            />
                        )
                    )}
                </div>
            </div>
            <Popover
                id='mouse-over-popover'
                className={classes.popover}
                classes={{
                    paper: classes.paper,
                }}
                open={!!popover}
                anchorEl={popover?.anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography>{popover?.hint}</Typography>
            </Popover>
        </div>
    );
};

export const PlayControls = compose(
    withTelestrationState,
    withStyles(styles)
)(playControls);
