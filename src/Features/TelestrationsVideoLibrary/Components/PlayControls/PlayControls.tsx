import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Popover, IconButton, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'fp-ts/lib/function';
import { ProgressBar } from '../ProgressBar';
import { setVideoUnmount, withTelestrationState } from '../../State';
import { ITelestrationStateMgr } from '../../Types';
import VideoTime from '../VideoTime';
import { ILocalStateMgr, withLocalState } from 'src/App/LocalState';
import { PlayControlsStyles } from './PlayControlsStyles';
import { controlButtons } from './buttons';
import VolumeUp from '../../Assets/Player/sound.svg';
import VolumeLow from '../../Assets/Player/low-sound.svg';
import VolumeOff from '../../Assets/Player/no-sound.svg';
import VolumeUpEngaged from '../../Assets/Player/Engaged/sound1.svg';
import VolumeLowEngaged from '../../Assets/Player/Engaged/low-sound1.svg';
import VolumeOffEngaged from '../../Assets/Player/Engaged/no-sound1.svg';
import { VolumeSlider } from './VolumeSlider';
import { useHistory } from 'react-router';

interface IPlayControlProps {
    classes: any;
    videoRef: React.RefObject<HTMLVideoElement>;
    videoTitle: string;
    telestrationStateMgr: ITelestrationStateMgr;
    localStateMgr: ILocalStateMgr;
    videoID: string;
}

interface IPopoverState {
    hint: string;
    anchorEl: (EventTarget & HTMLElement) | null;
}

export const playControls = ({
    classes,
    videoRef,
    videoTitle,
    telestrationStateMgr,
    localStateMgr,
    videoID,
}: IPlayControlProps) => {
    const history = useHistory();
    const nextAndPreviousVideoRef: React.MutableRefObject<string[]> = useRef(
        []
    );
    const { state } = localStateMgr;
    const [volumeState, setVolumeState] = useState<any>({
        current: 1,
        muted: false,
    });
    const [popover, setPopover] = useState<IPopoverState | null>(null);
    const [endagedElement, setEndagedElement] = useState<Element | null>(null);
    const [videoTime, setVideoTime] = useState(0);

    useEffect(updateTime, []);
    useEffect(controlsListener, []);
    useEffect(keyDownListener, []);

    useEffect(() => {
        nextAndPreviousVideoRef.current = state.userVideos;
    }, [state.userVideos]);

    function controlsListener() {
        document.addEventListener('keydown', keyDownHandler);

        return () => document.removeEventListener('keydown', keyDownHandler);
    }

    function keyDownListener() {
        document.addEventListener('keyup', keyUpHandler);

        return () => document.removeEventListener('keyup', keyUpHandler);
    }

    function updateTime() {
        const { current: video } = videoRef;
        if (video) {
            const onTick = (event: any) => {
                if (event.target.currentTime - videoTime >= 1) {
                    setVideoTime(event.target.currentTime);
                }
            };
            video.addEventListener('timeupdate', onTick);
            return () => video.removeEventListener('timeupdate', onTick);
        }
        return;
    }

    function keyDownHandler(event: KeyboardEvent) {
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
                case 'KeyZ': {
                    handlePopoverOpenKeyboard(
                        document.querySelector('#prev-video')
                    );
                    redirectToVideo('previous');
                    return;
                }
                case 'KeyA': {
                    handlePopoverOpenKeyboard(
                        document.querySelector('#fast-backward')
                    );
                    const time = video.currentTime - 0.5;
                    video.currentTime = time;
                    updatePreview(time);
                    return;
                }
                case 'KeyS': {
                    handlePopoverOpenKeyboard(
                        document.querySelector('#rewind-backward')
                    );
                    const time = video.currentTime - 0.1;
                    video.currentTime = time;
                    updatePreview(time);
                    return video.currentTime;
                }
                case 'Left':
                case 'ArrowLeft': {
                    handlePopoverOpenKeyboard(
                        document.querySelector('#replay')
                    );
                    const time = video.currentTime - 2;
                    video.currentTime = time;
                    updatePreview(time);
                    return video.currentTime;
                }
                case 'Right':
                case 'ArrowRight': {
                    handlePopoverOpenKeyboard(
                        document.querySelector('#forward')
                    );
                    const time = video.currentTime + 2;
                    video.currentTime = time;
                    updatePreview(time);
                    return video.currentTime;
                }
                case 'KeyD': {
                    handlePopoverOpenKeyboard(
                        document.querySelector('#rewind-forward')
                    );
                    const time = video.currentTime + 0.1;
                    video.currentTime = time;
                    updatePreview(time);
                    return;
                }
                case 'KeyF': {
                    handlePopoverOpenKeyboard(
                        document.querySelector('#fast-forward')
                    );
                    const time = video.currentTime + 0.5
                    video.currentTime = time;
                    updatePreview(time);
                    return;
                }
                case 'KeyX': {
                    handlePopoverOpenKeyboard(
                        document.querySelector('#next-video')
                    );
                    redirectToVideo('next');
                    return;
                }
                case 'KeyM': {
                    handlePopoverOpenKeyboard(
                        document.querySelector('#volume')
                    );
                    handleToggleVideoMuted();
                }
                default: {
                    return;
                }
            }
        } else {
            return;
        }
    }

    function redirectToVideo(relativeIndex: 'previous' | 'next') {
        const lastIndex = nextAndPreviousVideoRef.current.length - 1;
        const currentVideoIndex = nextAndPreviousVideoRef.current.indexOf(
            videoID
        );
        const nextVideoIndex =
            relativeIndex === 'previous'
                ? currentVideoIndex === 0
                    ? lastIndex
                    : currentVideoIndex - 1
                : currentVideoIndex === lastIndex
                ? 0
                : currentVideoIndex + 1;
        telestrationStateMgr.dispatchAction(setVideoUnmount());
        history.push(
            `/telestrations/${nextAndPreviousVideoRef.current[nextVideoIndex]}`
        );
    }

    function keyUpHandler(event: KeyboardEvent) {
        const { code } = event;
        const { current: video } = videoRef;
        /* tslint:disable-next-line */
        if (window['STOP_KEY_LISTENERS']) {
            return false;
        }

        if (video) {
            switch (code) {
                case 'KeyK':
                case 'Up':
                case 'ArrowUp':
                case 'Down':
                case 'ArrowDown':
                case 'KeyZ':
                case 'KeyA':
                case 'KeyS':
                case 'Left':
                case 'ArrowLeft':
                case 'Right':
                case 'ArrowRight':
                case 'KeyD':
                case 'KeyF':
                case 'KeyX':
                case 'KeyM':
                    setTimeout(() => {
                        handlePopoverCloseKeyboard();
                    }, 100);
                    return;
                default: {
                    return;
                }
            }
        } else {
            return;
        }
    }

    const handlePopoverOpen = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        hint: string
    ) => {
        setPopover({
            hint,
            anchorEl: event.currentTarget,
        });
    };

    const handlePopoverOpenKeyboard = (element: Element | null) => {
        setEndagedElement(element);
    };

    const handlePopoverCloseKeyboard = () => {
        setEndagedElement(null);
    };

    const handlePopoverClose = () => {
        setPopover(null);
    };

    const onVolumeChange = (event: React.ChangeEvent<{}>, value: number) => {
        const { current: video } = videoRef;
        if (
            video &&
            (Math.abs(volumeState.current - value / 100) > 0.1 ||
                (value === 0 && volumeState.current !== 0) ||
                (value === 100 && volumeState.current !== 1))
        ) {
            const volume = value / 100;
            video.volume = volume;
            setVolumeState({
                current: volume,
                muted: value === 0 ? true : false,
            });
            video.muted = false;
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

    function handleToggleVideoMuted() {
        const { current: video } = videoRef;
        if (video) {
            video.muted = !video.muted;
            setVolumeState((prev: any) => ({ ...prev, muted: video.muted }));
        }
    }

    const dispatchKeyboardEvent = (code: string, name: string) => {
        return document.dispatchEvent(
            new KeyboardEvent('keydown', {
                code,
            })
        );
    };

    return (
        <div className={classes.root}>
            <div className={classes.controlMainContainer}>
                <div className={classes.videoTitle}>{videoTitle}</div>
                <div className={classes.buttonRow}>
                    {controlButtons.map(
                        (
                            { name, hint, icon, engagedIcon, keyboardEvent },
                            index: number
                        ) => {
                            const { current: video } = videoRef;
                            return (
                                <IconButton
                                    id={name}
                                    key={index}
                                    aria-haspopup='true'
                                    onMouseEnter={(e) =>
                                        handlePopoverOpen(
                                            e,
                                            hint(video?.paused)
                                        )
                                    }
                                    onMouseLeave={handlePopoverClose}
                                    onClick={() =>
                                        dispatchKeyboardEvent(
                                            keyboardEvent,
                                            name
                                        )
                                    }
                                    classes={{ root: classes.iconButton }}
                                >
                                    {(popover &&
                                        popover.hint === hint(video?.paused)) ||
                                    (endagedElement &&
                                        endagedElement.id === name)
                                        ? engagedIcon(
                                              name === 'play/pause'
                                                  ? video?.paused
                                                  : volumeState.current
                                          )
                                        : icon(
                                              name === 'play/pause'
                                                  ? video?.paused
                                                  : volumeState.current
                                          )}
                                </IconButton>
                            );
                        }
                    )}
                </div>
                <div className={classes.videoTime}>
                    <div className={classes.soundContainer}>
                        <IconButton
                            id='volume'
                            aria-haspopup='true'
                            onMouseEnter={(e) =>
                                handlePopoverOpen(e, 'Volume (M)')
                            }
                            onMouseLeave={handlePopoverClose}
                            onClick={() => handleToggleVideoMuted()}
                            classes={{ root: classes.iconButton }}
                        >
                            {(popover && popover.hint === 'Volume (M)') ||
                            (endagedElement &&
                                endagedElement.id === 'volume') ? (
                                !volumeState.muted &&
                                volumeState.current !== 0 ? (
                                    volumeState.current < 0.5 ? (
                                        <img src={VolumeLowEngaged} />
                                    ) : (
                                        <img src={VolumeUpEngaged} />
                                    )
                                ) : (
                                    <img src={VolumeOffEngaged} />
                                )
                            ) : !volumeState.muted ? (
                                volumeState.current < 0.5 ? (
                                    <img src={VolumeLow} />
                                ) : (
                                    <img src={VolumeUp} />
                                )
                            ) : (
                                <img src={VolumeOff} />
                            )}
                        </IconButton>
                    </div>
                    <div style={{ display: 'block' }}>
                        {!localStateMgr.state.isTouchDevice && (
                            <VolumeSlider
                                volumeState={volumeState}
                                onVolumeChange={onVolumeChange}
                            />
                        )}
                    </div>

                    <VideoTime videoTime={videoTime} />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%' }}>
                    <ProgressBar
                        videoRef={videoRef}
                        updatePreview={updatePreview}
                        videoTime={videoTime}
                        setVideoTime={setVideoTime}
                    />
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
    withLocalState,
    withTelestrationState,
    withStyles(PlayControlsStyles)
)(playControls);
