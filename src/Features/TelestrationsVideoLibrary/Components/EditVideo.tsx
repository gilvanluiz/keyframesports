import * as React from 'react';
import clsx from 'clsx';
import {
    Box,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
} from '@material-ui/core';
import { compose } from 'fp-ts/lib/function';
import { useEffect, useState } from 'react';
import {
    canvasClickHandler,
    canvasMouseDownUpHandler,
    clearCanvas,
    drawImgToCanvas,
} from '../Utils/Canvas';
import {
    withTelestrationState,
    setModeAction,
    setVideoLoadError,
    setChromakeyState,
} from '../State';
import { ILocalStateMgr, withLocalState } from '../../../App/LocalState';
import { ITelestrationStateMgr, EditMode } from '../Types';
import { maxRect } from '../Utils/Geometry';
import { RecordingCanvas } from './RecordCanvas';
import { PureVideo } from './PureVideo';
import { PlayControls } from './PlayControls';
import { TelestrationControls } from './TelestrationControls';
import { telestrationMounted } from 'src/App/UserEvents';
import { sendUserEvent } from 'src/App/UserEvents/UserEventManager';
import { DeviceOrientationAlert } from 'src/Features/VideoLibrary/Components/DeviceOrientationAlert';
import { LastTelestratedVideoLinkModal } from './LastTelestratedVideoLinkModal';

const styles = (theme: ITheme) => ({
    container: {
        backgroundColor: theme.palette.common.black,
        display: 'flex',
        flexDirection: 'column' as 'column',
        height: '100%',
        justifyContent: 'flex-start',
    },
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
    canvas: {
        position: 'absolute' as 'absolute',
    },
    canvasPlayMode: {
        zIndex: 0,
    },
    canvasEditMode: {
        zIndex: 1,
    },
    mouseCircle: {
        cursor: 'pointer',
    },
    mouseArrow: {
        cursor: 'crosshair',
    },
    easyChangeSize: {
        transition: 'all 0.5s ease-out',
    },
});

interface IProps extends IWithStyles {
    localStateMgr: ILocalStateMgr;
    videoUrl: string;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    telestrationStateMgr: ITelestrationStateMgr;
    videoTitle: string;
    videoID: string;
}

const editVideo = ({
    videoID,
    classes,
    videoUrl,
    telestrationStateMgr,
    videoTitle,
    localStateMgr,
}: IProps) => {
    const [previousMode, setPreviousMode] = useState<EditMode>('default');
    const { state, dispatchAction } = telestrationStateMgr;
    const [orientationAlert, setOrientationAlert] = useState(false);

    const { state: localState } = localStateMgr;

    const {
        recording: {
            animationCanvasRef,
            cursorCanvasRef,
            recordingCanvasRef,
            videoRef,
        },
    } = state;

    const sizeCanvases = () => {
        if (
            videoRef.current &&
            animationCanvasRef.current &&
            cursorCanvasRef.current &&
            recordingCanvasRef.current &&
            videoRef.current.videoHeight > 0 &&
            videoRef.current.videoWidth > 0
        ) {
            const outerRect = {
                height: window.innerHeight - (70 + 68), // height of controls (telestration + play)
                width:
                    window.innerWidth -
                    (localState.leftSideMenuOpen ? 240 : 72), // width of left side menu
            };

            const innerRect = {
                height: videoRef.current.videoHeight,
                width: videoRef.current.videoWidth,
            };

            const dimensions = maxRect({ outerRect, innerRect });

            animationCanvasRef.current.height = dimensions.height;
            animationCanvasRef.current.width = dimensions.width;
            cursorCanvasRef.current.height = dimensions.height;
            cursorCanvasRef.current.width = dimensions.width;
            recordingCanvasRef.current.height = dimensions.height;
            recordingCanvasRef.current.width = dimensions.width;
            videoRef.current.height = dimensions.height;
            videoRef.current.width = dimensions.width;
            state.overlays.map((overlay) =>
                drawImgToCanvas(animationCanvasRef, overlay)
            );
        } else {
            console.error('Canvas sizing error');
        }
    };

    const draw = () => {
        clearCanvas(animationCanvasRef);
        state.overlays.map((overlay) =>
            drawImgToCanvas(animationCanvasRef, overlay)
        );
    };

    const keyDownHandler = (event: any) => {
        event.persist();
        if (event.key === 'Escape') {
            dispatchAction(setModeAction('save_effect'));
        }
    };

    const handleVideoLoad = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.muted = false;
            dispatchAction(setModeAction('chromakey_first_mount'));
            sizeCanvases();
        }
    };

    const setVideoPlayListener = () => {
        const { current } = videoRef;

        if (current) {
            const setDefaultMode = () => {
                setPreviousMode(state.editMode);
                dispatchAction(setModeAction('default'));
            };
            current.addEventListener('play', setDefaultMode);
            return () => current.removeEventListener('play', setDefaultMode);
        }

        return undefined;
    };

    const setVideoPauseListener = () => {
        const { current } = videoRef;

        if (current) {
            const previousModeListener = () =>
                dispatchAction(setModeAction(previousMode));
            current.addEventListener('pause', previousModeListener);
            return () =>
                current.removeEventListener('pause', previousModeListener);
        }

        return undefined;
    };

    // Set canvas size
    useEffect(draw);
    useEffect(setVideoPlayListener);
    useEffect(setVideoPauseListener);

    useEffect(() => {
        sendUserEvent(telestrationMounted, window.location.href, videoID);
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function handleResize() {
        if (
            localState.isTouchDevice &&
            window.innerHeight > window.innerWidth
        ) {
            setOrientationAlert(true);
        }
    }

    const modeToClasses = {
        circle: classes.mouseCircle,
        arrow: classes.mouseArrow,
    };

    const extraRootClasses =
        (state.editMode && modeToClasses[state.editMode]) || '';

    const canvasClasses = `${classes.canvas} ${
        state.editMode === 'default'
            ? classes.canvasPlayMode
            : classes.canvasEditMode
    }`;

    const handleCanvasClick = canvasClickHandler({
        telestrationStateMgr,
        canvasRef: animationCanvasRef,
        videoRef,
    });

    const onCanvasMouseDrag = (mouseMode: 'down' | 'up') => (
        e: React.MouseEvent<HTMLElement>
    ) => {
        canvasMouseDownUpHandler({
            mouseMode,
            e,
            canvasRef: animationCanvasRef,
            videoRef,
            telestrationStateMgr,
        });
    };

    const { videoSize } = state;

    return (
        <Box
            className={classes.container}
            tabIndex={0}
            onKeyDown={keyDownHandler}
        >
            <TelestrationControls videoID={videoID} />
            <Box className={clsx(classes.root, extraRootClasses)}>
                <canvas
                    className={clsx(classes.easyChangeSize, canvasClasses)}
                    onMouseDown={onCanvasMouseDrag('down')}
                    onMouseUp={onCanvasMouseDrag('up')}
                    onClick={handleCanvasClick}
                    ref={animationCanvasRef}
                />
                <canvas
                    className={clsx(classes.easyChangeSize, canvasClasses)}
                    ref={cursorCanvasRef}
                    onClick={() => {
                        if (
                            (state.editMode === 'chromakey' ||
                                state.editMode === 'chromakey_first_mount') &&
                            !state.chromakeyApplied
                        ) {
                            dispatchAction(setChromakeyState(true));
                        }
                    }}
                />
                <PureVideo
                    className={classes.easyChangeSize}
                    src={videoUrl}
                    videoRef={videoRef}
                    onError={(message: string) =>
                        dispatchAction(setVideoLoadError(message))
                    }
                    handleVideoLoad={handleVideoLoad}
                    videoLoading={state.videoLoading}
                />
                <RecordingCanvas
                    videoLoaded={state.videoLoading}
                    animationCanvasRef={animationCanvasRef}
                    cursorCanvasRef={cursorCanvasRef}
                    recordingCanvasRef={recordingCanvasRef}
                    videoRef={videoRef}
                    height={videoSize.height}
                    width={videoSize.width}
                    telestrationStateMgr={telestrationStateMgr}
                />
            </Box>
            <PlayControls
                videoRef={videoRef}
                videoTitle={videoTitle}
                state={state}
                videoID={videoID}
            />
            <DeviceOrientationAlert
                open={orientationAlert}
                onClose={setOrientationAlert}
                position='top'
            />
            <LastTelestratedVideoLinkModal />
        </Box>
    );
};

export const EditVideo = compose(
    withLocalState,
    withTelestrationState,
    withStyles(styles)
)(editVideo);
