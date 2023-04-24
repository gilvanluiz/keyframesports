import * as React from 'react';
import { useState, useEffect } from 'react';
import { Popover, Typography } from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';
import { compose } from 'fp-ts/lib/function';
// import { SoundBar } from './SoundBar';
import { ProgressBar } from './ProgressBar';
import {
    TelestrationPlayAction,
    TelestrationStopAction,
    withTelestrationState,
} from '../State';
import { ITelestrationStateMgr } from '../Types';
import { TimeBar } from './TimeBar';
import { ShapeRows } from './ShapeRows';

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
    videoTitle: string;

    telestrationStateMgr: ITelestrationStateMgr;
}

export const playControls = ({
    classes,
    videoTitle,
    telestrationStateMgr,
}: IPlayControlProps) => {
    const [volumeState, setVolumeState]: [any, any] = useState({
        previous: 1,
        current: 1,
    });
    const [keyState, setKeyState]: [string, any] = useState('');
    const { state, dispatchAction } = telestrationStateMgr;
    const { telestrationTimeTrackStoped } = state;
    const { recording } = state;
    const { videoRef } = recording;

    const [popover, setPopover]: [any, any] = useState(null);
    // const [pauseVideoDuration, setPauseVideoDuration]: [number, any] = useState(
    // 0
    // );
    // const [videoDuration, setVideoDuration]: [number, any] = useState(0);

    const handlePopoverClose = () => {
        setPopover(null);
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

    const keyDownHandler = (event: any) => {
        const { code } = event;

        /* tslint:disable-next-line */
        if (!window['STOP_KEY_LISTENERS']) {
            event.preventDefault();
            event.stopPropagation();
            setKeyState(code);
        }
    };

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

    const keyStateHandler = () => {
        const { current: video } = videoRef;
        if (video) {
            switch (keyState) {
                case 'KeyK':
                case 'Space': {
                    dispatchAction(
                        telestrationTimeTrackStoped
                            ? TelestrationPlayAction()
                            : TelestrationStopAction()
                    );
                    break;
                }
                // case 'Up':
                // case 'ArrowUp': {
                //     return video.paused ? video.play() : null;
                // }
                // case 'Down':
                // case 'ArrowDown': {
                //     return !video.paused ? video.pause() : null;
                // }
                // case 'Left':
                // case 'ArrowLeft': {
                //     const time = video.currentTime - 2;
                //     video.currentTime = time;
                //     updatePreview(time);
                //     return video.currentTime;
                // }
                // case 'Right':
                // case 'ArrowRight': {
                //     const time = video.currentTime + 2;
                //     video.currentTime = time;
                //     updatePreview(time);
                //     return video.currentTime;
                // }
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
                    // return video.volume;
                }
            }
        }
    };

    useEffect(keyStateHandler, [keyState]);

    const controlsListener = () => {
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', () => {
            setKeyState('');
        });
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', () => {
                setKeyState('');
            });
        };
    };

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
                <ProgressBar />
                <TimeBar />

                <ShapeRows />
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
