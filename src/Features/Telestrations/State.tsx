import * as React from 'react';
import { useState } from 'react';
import { assocPath, lensProp, over, append, path } from 'ramda';
import { Lens } from 'monocle-ts';
import { compose } from 'fp-ts/lib/function';
import { dropEnd } from 'fp-ts/lib/Array';
import {
    EditMode,
    ITelestrationState,
    IAction,
    ICoordinates,
    ISetDragStateAction,
    IAddImageAction,
    IOverlayImg,
} from './Types';
import { startRecorder, stopRecorder } from './Utils/Recording';
import TelestrationManager from './Model/TelestrationManager';
import ArrowImg from './Assets/svg/keyframe_arrows_v2.svg';
import CircleImg from './Assets/svg/keyframe_cursor_v3.svg';
import { IVideoPause } from './Types';
import { getRelativeTime } from './Utils/CalculateTime';
const TelestrationContext = React.createContext({});

const modeToSvg = {
    arrow: {
        src: ArrowImg,
    },
    circle: {
        src: CircleImg,
    },
};

const modeToType = {
    arrow: 'overlay/Arrow',
    circle: 'overlay/Circle',
};

// ACTIONS

const SET_EDIT_MODE = 'telestrations/SET_EDIT_MODE';
const CALL_CHROMAKEY_ACTION = 'telestrations/CALL_CHROMAKEY_ACTION';
const CHANGE_TELESTRATION_COLOR = 'telestrations/CHANGE_TELESTRATION_COLOR';
const ADD_OVERLAY_IMG = 'telestrations/ADD_OVERLAY_IMG';
const SET_DRAG_STATE = 'telestrations/SET_DRAG_STATE';
const SET_VIDEO_LOAD_ERROR = 'telestrations/SET_VIDEO_LOAD_ERROR';
const SET_VIDEO_LOADED = 'telestrations/SET_VIDEO_LOADED';
const CHANGE_TEXT = 'telestrations/CHANGE_TEXT';
const CHANGE_FONT_SIZE = 'telestrations/CHANGE_FONT_SIZE';
const CHANGE_TEXT_COLOR = 'telestrations/CHANGE_TEXT_COLOR';
const CHANGE_TEXT_BACKGROUND_COLOR =
    'telestrations/CHANGE_TEXT_BACKGROUND_COLOR';
const SAVE_TEXT_BOX = 'telestrations/SAVE_TEXT_BOX';
const CLICK_VIDEO_BOX = 'telestrations/CLICK_VIDEO_BOX';
const VIDEO_PLAY = 'telestrations/VIDEO_PLAY';
const VIDEO_STOP = 'telestrations/VIDEO_STOP';
const RELATIVE_CURRENT_TIME_CHANGE =
    'telestrations/RELATIVE_CURRENT_TIME_CHANGE';

const VIDEI_TIME_ACTION = 'telestrations/VIDEI_TIME_ACTION';
// ACTION CREATORS

export const setModeAction = (
    editMode: EditMode,
    setHint?: (hint: string) => void
) => ({
    type: SET_EDIT_MODE as 'telestrations/SET_EDIT_MODE',
    editMode,
    setHint,
});

export const callChromakeyAction = (action: string) => ({
    type: CALL_CHROMAKEY_ACTION as 'telestrations/CALL_CHROMAKEY_ACTION',
    action,
});

export const changeTelestrationColor = (color: string) => ({
    type: CHANGE_TELESTRATION_COLOR as 'telestrations/CHANGE_TELESTRATION_COLOR',
    color,
});

export const changeText = (text: string) => ({
    type: CHANGE_TEXT as 'telestrations/CHANGE_TEXT',
    text,
});

export const changeFontSize = (fontSize: number) => ({
    type: CHANGE_FONT_SIZE as 'telestrations/CHANGE_FONT_SIZE',
    fontSize,
});

export const changeTextColor = (textColor: string) => ({
    type: CHANGE_TEXT_COLOR as 'telestrations/CHANGE_TEXT_COLOR',
    textColor,
});

export const changeTextBackgroundColor = (backgroundColor: string) => ({
    type: CHANGE_TEXT_BACKGROUND_COLOR as 'telestrations/CHANGE_TEXT_BACKGROUND_COLOR',
    backgroundColor,
});

export const saveTextBox = () => ({
    type: SAVE_TEXT_BOX as 'telestrations/SAVE_TEXT_BOX',
});

export const addImageAction = (
    coordinates: { x: number; y: number },
    editMode: EditMode,
    videoTime: number
): IAddImageAction => ({
    type: 'telestrations/ADD_OVERLAY_IMG' as 'telestrations/ADD_OVERLAY_IMG',
    overlayImg: {
        svg: modeToSvg[editMode],
        type: modeToType[editMode],
        coordinates,
        createdAt: new Date(),
        video: {
            createdAt: videoTime,
        },
    },
});

export const setDragStateAction = (
    dragState: 'start' | 'end',
    coordinates: ICoordinates,
    editMode: EditMode,
    videoTime: number
): ISetDragStateAction => {
    if (dragState === 'start') {
        return {
            type: SET_DRAG_STATE as 'telestrations/SET_DRAG_STATE',
            coordinates,
            dragMode: 'start' as 'start',
            editMode,
            videoTime,
        };
    } else {
        return {
            type: SET_DRAG_STATE as 'telestrations/SET_DRAG_STATE',
            coordinates,
            dragMode: 'end' as 'end',
            editMode,
            videoTime,
        };
    }
};

export const setVideoLoadError = (message: string) => ({
    type: SET_VIDEO_LOAD_ERROR as 'telestrations/SET_VIDEO_LOAD_ERROR',
    message,
});

export const setVideoLoaded = () => ({
    type: SET_VIDEO_LOADED as 'telestrations/SET_VIDEO_LOADED',
});

export const clickVideoBox = (e: any) => ({
    type: CLICK_VIDEO_BOX as 'telestrations/CLICK_VIDEO_BOX',
    event: e,
});

export const VideoPlayAction = () => ({
    type: VIDEO_PLAY as 'telestrations/VIDEO_PLAY',
});

export const VideoStopAction = () => ({
    type: VIDEO_STOP as 'telestrations/VIDEO_STOP',
});

export const RelativeCurrentTimeChangeAction = (t: number) => ({
    type: RELATIVE_CURRENT_TIME_CHANGE as 'telestrations/RELATIVE_CURRENT_TIME_CHANGE',
    time: t,
});

export const VideoTickAction = (t: number) => ({
    type: VIDEI_TIME_ACTION as 'telestrations/VIDEI_TIME_ACTION',
    time: t,
});

// REDUCER

type ITelestrationStateFn = (x: any) => ITelestrationState;

type ReducerResult = ITelestrationState | ITelestrationStateFn;

const calculateTotalTime = (state: ITelestrationState) => {
    // start -> cacullate total video duration and all video paused time

    state.totalVideoDuration = 0;
    if (videoRef.current) {
        state.totalVideoDuration += videoRef.current.duration;
    }

    if (state.telestrationManager.addedShapes.length > 0) {
        let pauseD = 0;
        state.videoPauseArray = [];

        state.telestrationManager.addedShapes.forEach((addedShape: any) => {
            const { videoPauseDuration } = addedShape;

            const overState = {
                startOvered: -1,
                endOvered: -1,
                covered: [] as any,
            };

            state.videoPauseArray.forEach(
                (videoPause: IVideoPause, index: number) => {
                    if (
                        videoPauseDuration.startTime >= videoPause.startTime &&
                        videoPauseDuration.startTime <= videoPause.endTime
                    ) {
                        overState.startOvered = index;
                    }
                    if (
                        videoPauseDuration.endTime >= videoPause.startTime &&
                        videoPauseDuration.endTime <= videoPause.endTime
                    ) {
                        overState.endOvered = index;
                    }

                    if (
                        videoPauseDuration.startTime < videoPause.startTime &&
                        videoPauseDuration.endTime > videoPause.endTime
                    ) {
                        overState.covered.push(index);
                    }
                }
            );

            if (overState.covered.length > 0) {
                console.log('covered object:>>>', overState.covered);
                overState.covered.forEach((c: number, i: number) => {
                    state.videoPauseArray.splice(c - i, 1);
                });
            }

            if (overState.startOvered !== -1 && overState.endOvered !== -1) {
                // full overed
                console.log('full overed');
                if (overState.startOvered !== overState.endOvered) {
                    pauseD +=
                        state.videoPauseArray[overState.endOvered].startTime -
                        state.videoPauseArray[overState.startOvered].endTime;

                    state.videoPauseArray[overState.startOvered].endTime =
                        state.videoPauseArray[overState.endOvered].endTime;

                    state.videoPauseArray.splice(overState.endOvered, 1);
                }
            } else if (
                overState.startOvered !== -1 &&
                overState.endOvered === -1
            ) {
                // only start overed
                console.log('only start overed');
                pauseD +=
                    videoPauseDuration.endTime -
                    state.videoPauseArray[overState.startOvered].endTime;
                state.videoPauseArray[overState.startOvered].endTime =
                    videoPauseDuration.endTime;
            } else if (
                overState.startOvered !== -1 &&
                overState.endOvered === -1
            ) {
                // only end overed
                console.log('only end overed');
                pauseD +=
                    state.videoPauseArray[overState.startOvered].startTime -
                    videoPauseDuration.startTime;

                state.videoPauseArray[overState.startOvered].startTime =
                    videoPauseDuration.startTime;
            } else {
                // no overed
                console.log('no overed');
                pauseD +=
                    videoPauseDuration.endTime - videoPauseDuration.startTime;

                state.videoPauseArray.push({ ...videoPauseDuration });
                state.videoPauseArray.sort((x, y) => {
                    return x.startTime - y.startTime;
                });
            }
        });
        state.totalVideoDuration += pauseD;
    }
    // end -> cacullate total video duration and all video pausedtime
};

const telestrationReducer = (
    state: ITelestrationState,
    action: IAction
): ReducerResult => {
    console.log(action);
    switch (action.type) {
        case SET_VIDEO_LOAD_ERROR: {
            const { message } = action;
            return Lens.fromProp<ITelestrationState>()('videoLoadError').set(
                message
            )(state);
        }
        case SET_EDIT_MODE: {
            const { editMode } = action;
            const newState = {
                ...state,
                editMode,
            };
            switch (editMode) {
                case 'save_effect': {
                    state.telestrationManager.setLiveModeFunction();
                    return newState;
                }
                case 'default': {
                    state.telestrationManager.clearTelestrations();
                    state.telestrationManager.setLiveModeFunction();
                    calculateTotalTime(state);
                    return {
                        ...state,
                        editMode,
                        overlays: [],
                    };
                }
                case 'undo': {
                    state.telestrationManager.triggerUndo();
                    const overlayLens = Lens.fromProp<ITelestrationState>()(
                        'overlays'
                    );
                    calculateTotalTime(state);
                    return overlayLens.modify((a) => dropEnd(1, a))(state);
                }
                case 'record': {
                    if (!state.recording.recordingActive) {
                        state.telestrationManager.setRecordingMode(true);
                        startRecorder(
                            state.recording.recordingCanvasRef,
                            action.setHint
                        );
                        return Lens.fromPath<ITelestrationState>()([
                            'recording',
                            'recordingActive',
                        ]).set(true)(state);
                    }
                }
                case 'stop_recording': {
                    state.telestrationManager.setRecordingMode(false);
                    stopRecorder();
                    /* tslint:disable-next-line */
                    window['STOP_KEY_LISTENERS'] = true;
                    return Lens.fromPath<ITelestrationState>()([
                        'recording',
                        'recordingActive',
                    ]).set(false);
                }
                case 'selectshape': {
                    state.telestrationManager.selectShape();
                    return newState;
                }
                case 'arrow': {
                    state.telestrationManager.setPlaceArrowFunction();
                    return newState;
                }
                case 'circle': {
                    state.telestrationManager.setPlaceCursorFunction();
                    return newState;
                }
                case 'freearrow': {
                    state.telestrationManager.setPlaceFreeArrowFunction();
                    return newState;
                }
                case 'chromakey': {
                    state.telestrationManager.setChromaKeySettingsFunction();
                    return {
                        ...newState,
                        chromakeyApplied: false,
                    };
                }
                case 'lightshaft': {
                    state.telestrationManager.setPlaceLightShaftFunction();
                    return newState;
                }
                case 'polygon_t': {
                    state.telestrationManager.setPlacePolygonFunction();
                    return newState;
                }
                case 'linkedcursor': {
                    state.telestrationManager.setPlaceLinkedCursorFunction();
                    return newState;
                }
                case 'playercutout': {
                    state.telestrationManager.setPlayerCutOutFunction();
                    return newState;
                }
                case 'straightarrow': {
                    state.telestrationManager.setPlaceStraightArrowFunction();
                    return newState;
                }
                case 'textbox': {
                    state.telestrationManager.setPlaceTextBoxFunction();
                    return newState;
                }
                default:
                    return newState;
            }

            throw Error(`Edit mode ${editMode} not handled.`);
        }
        case CALL_CHROMAKEY_ACTION: {
            const { action: act } = action;

            if (act === 'undo') {
                state.telestrationManager.undoChromaKey();
            } else if (act === 'clear') {
                state.telestrationManager.resetChromaKey();
            } else if (act === 'save') {
                // return to regular telestration mode
                state.telestrationManager.setLiveModeFunction();
                return {
                    ...state,
                    chromakeyApplied: true,
                    editMode: 'default' as 'default',
                };
            }
            return state;
        }
        case CHANGE_TELESTRATION_COLOR: {
            const { color } = action;
            state.telestrationManager.setTelestrationColor(color);
            return state;
        }
        case CHANGE_TEXT: {
            const { text } = action;
            state.telestrationManager.setTelestrationText(text);
            return state;
        }
        case CHANGE_FONT_SIZE: {
            const { fontSize } = action;
            state.telestrationManager.setTelestrationFontSize(fontSize);
            return state;
        }
        case CHANGE_TEXT_COLOR: {
            const { textColor } = action;
            state.telestrationManager.setTelestrationTextColor(textColor);
            return state;
        }
        case CHANGE_TEXT_BACKGROUND_COLOR: {
            const { backgroundColor } = action;
            state.telestrationManager.setTelestrationBackgroundColor(
                backgroundColor
            );
            return state;
        }
        case SAVE_TEXT_BOX: {
            state.telestrationManager.saveTextBox();
            return state;
        }
        case ADD_OVERLAY_IMG: {
            const { overlayImg } = action;
            const newState = {
                ...state,
                overlays: [...state.overlays, overlayImg],
            };
            return newState;
        }
        case SET_DRAG_STATE: {
            const { dragMode, editMode, coordinates, videoTime } = action;
            if (dragMode === 'start') {
                const newState = compose(
                    assocPath(['dragState', 'mode'], editMode),
                    assocPath(['dragState', 'startCoordinates'], coordinates)
                )(state);

                return newState as ITelestrationState;
            } else if (dragMode === 'end') {
                const start = path(
                    ['dragState', 'startCoordinates'],
                    state
                ) as ICoordinates;
                const arrowDrawing: IOverlayImg = {
                    type: 'overlay/Arrow',
                    createdAt: new Date(),
                    video: {
                        createdAt: videoTime,
                    },
                    coordinates: {
                        start,
                        end: coordinates,
                    },
                } as IOverlayImg;
                const newState = compose(
                    over(lensProp('overlays'), append(arrowDrawing)),
                    assocPath(['dragState', 'mode'], editMode),
                    assocPath(['dragState', 'endCoordinates'], coordinates)
                )(state);

                return newState as ITelestrationState;
            }
        }
        case SET_VIDEO_LOADED: {
            if (videoRef.current) {
                state.totalVideoDuration = videoRef.current.duration;
            }
            return Lens.fromProp<ITelestrationState>()('videoLoading').set(
                false
            )(state);
        }
        case CLICK_VIDEO_BOX: {
            state.telestrationManager.onclick(
                action.event,
                state.relativeCurrentVideoTime
            );

            calculateTotalTime(state);

            console.log(
                'addedshapesarray>>>>>>>',
                state.telestrationManager.addedShapes
            );
            console.log('pausetimearray>>>>>', state.videoPauseArray);

            const newState = {
                ...state,
            };
            return newState;
        }
        case VIDEO_PLAY: {
            state.telestrationManager.setLiveModeFunction();
            const newState = {
                ...state,
                totalTimeTrackStoped: false,
            };
            return newState;
        }
        case VIDEO_STOP: {
            state.telestrationManager.setLiveModeFunction();
            const newState = {
                ...state,
                totalTimeTrackStoped: true,
            };
            return newState;
        }
        case RELATIVE_CURRENT_TIME_CHANGE: {
            console.log('relative video time changed:>>>', action.time);
            const newState = {
                ...state,
                relativeCurrentVideoTime: action.time,
            };
            return newState;
        }
        case VIDEI_TIME_ACTION: {
            // console.log('absolute vdieotime update>>>>>>>', action.time);
            const { videoPauseArray } = state;

            const relativeCurrentVideoTime = getRelativeTime(
                action.time,
                videoPauseArray
            );
            // console.log(relativeCurrentVideoTime);

            const newState = {
                ...state,
                relativeCurrentVideoTime,
            };

            return newState;
        }
        default: {
            throw Error(`Action not found`);
        }
    }
};

const animationCanvasRef = React.createRef<HTMLCanvasElement>();
const cursorCanvasRef = React.createRef<HTMLCanvasElement>();
const recordingCanvasRef = React.createRef<HTMLCanvasElement>();
const videoRef = React.createRef<HTMLVideoElement>();

const initialTelestrationForm = {
    title: '',
    description: '',
};

const initialTelestrationState = {
    videoPlaying: false,
    videoSize: {
        height: 432,
        width: 728,
    },
    editMode: 'default' as 'default',
    chromakeyApplied: false,
    overlays: [],
    telestrationModal: {
        fileId: '',
        form: initialTelestrationForm,
    },
    uploadQueue: {},
    recording: {
        animationCanvasRef,
        recordingCanvasRef,
        cursorCanvasRef,
        videoRef,
        recordingActive: false,
    },
    telestrationManager: new TelestrationManager(),
    videoLoadError: 'no-errors',
    videoLoading: true,
    videoPauseArray: [],
    totalVideoDuration: 0,
    relativeCurrentVideoTime: 0,
    totalTimeTrackStoped: true,
};

export const TelestrationStateProvider = ({ children }: any) => {
    const [state, _updateState]: [ITelestrationState, any] = useState(
        initialTelestrationState
    );
    const dispatchAction = (action: IAction) => {
        const newState = telestrationReducer(state, action);
        _updateState(newState);
    };
    const telestrationStateMgr = { state, dispatchAction };
    return (
        <TelestrationContext.Provider value={telestrationStateMgr}>
            {...children}
        </TelestrationContext.Provider>
    );
};

export const withTelestrationState = (Child: React.ComponentType<any>) => (
    props: any
) => (
    <TelestrationContext.Consumer>
        {(value) => <Child telestrationStateMgr={value} {...props} />}
    </TelestrationContext.Consumer>
);
