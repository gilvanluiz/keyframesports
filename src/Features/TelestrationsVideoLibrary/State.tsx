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
    IColorPayload,
} from './Types';
import { stopRecorder } from './Utils/Recording';
import TelestrationManager from './Model/TelestrationManager';
import ArrowImg from './Assets/svg/keyframe_arrows_v2.svg';
import CircleImg from './Assets/svg/keyframe_cursor_v3.svg';

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
const SET_CHROMAKEY_STATE = 'telestrations/SET_CHROMAKEY_STATE';
const INITIALIZE_TM = 'telestrations/INITIALIZE_TM';
const CHANGE_TELESTRATION_COLOR = 'telestrations/CHANGE_TELESTRATION_COLOR';
const REPLACE_TELESTRATION_COLOR = 'telestrations/REPLACE_TELESTRATION_COLOR';
const ADD_OVERLAY_IMG = 'telestrations/ADD_OVERLAY_IMG';
const SET_DRAG_STATE = 'telestrations/SET_DRAG_STATE';
const SET_VIDEO_LOAD_ERROR = 'telestrations/SET_VIDEO_LOAD_ERROR';
const CHANGE_TEXT = 'telestrations/CHANGE_TEXT';
const CHANGE_FONT_SIZE = 'telestrations/CHANGE_FONT_SIZE';
const CHANGE_TEXT_COLOR = 'telestrations/CHANGE_TEXT_COLOR';
const CHANGE_TEXT_BACKGROUND_COLOR =
    'telestrations/CHANGE_TEXT_BACKGROUND_COLOR';
const SAVE_TEXT_BOX = 'telestrations/SAVE_TEXT_BOX';
const SET_LAST_TELESTRATED_VIDEO = 'telestrations/SET_LAST_TELESTRATED_VIDEO';
const TOGGLE_ARROW_TYPE = 'telestrations/TOGGLE_ARROW_TYPE';
const SET_VIDEO_UNMOUNT = 'telestrations/SET_VIDEO_UNMOUNT';

// ACTION CREATORS

export const setModeAction = (
    editMode: EditMode,
    setHint?: (hint: string) => void
) => ({
    type: SET_EDIT_MODE as 'telestrations/SET_EDIT_MODE',
    editMode,
    setHint,
});

export const initializeTM = () => ({
    type: INITIALIZE_TM as 'telestrations/INITIALIZE_TM',
});

export const callChromakeyAction = (action: string) => ({
    type: CALL_CHROMAKEY_ACTION as 'telestrations/CALL_CHROMAKEY_ACTION',
    action,
});

export const setChromakeyState = (payload: boolean) => ({
    type: SET_CHROMAKEY_STATE as 'telestrations/SET_CHROMAKEY_STATE',
    payload,
});

export const changeTelestrationColor = (color: string) => ({
    type: CHANGE_TELESTRATION_COLOR as 'telestrations/CHANGE_TELESTRATION_COLOR',
    color,
});

export const replaceTelestrationColors = (payload: IColorPayload) => ({
    type: REPLACE_TELESTRATION_COLOR as 'telestrations/REPLACE_TELESTRATION_COLOR',
    payload,
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

export const toggleArrowType = (payload: EditMode) => ({
    type: TOGGLE_ARROW_TYPE as 'telestrations/TOGGLE_ARROW_TYPE',
    payload,
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

export const setLastTelestratedVideo = (payload: string) => ({
    type: SET_LAST_TELESTRATED_VIDEO as 'telestrations/SET_LAST_TELESTRATED_VIDEO',
    payload,
});

export const setVideoUnmount = () => ({
    type: SET_VIDEO_UNMOUNT as 'telestrations/SET_VIDEO_UNMOUNT',
});

// REDUCER

type ITelestrationStateFn = (x: any) => ITelestrationState;

type ReducerResult = ITelestrationState | ITelestrationStateFn;

const telestrationReducer = (
    state: ITelestrationState,
    action: IAction
): ReducerResult => {
    switch (action.type) {
        case SET_VIDEO_LOAD_ERROR: {
            const { message } = action;
            return Lens.fromProp<ITelestrationState>()('videoLoadError').set(
                message
            )(state);
        }
        case SET_VIDEO_UNMOUNT: {
            return Lens.fromProp<ITelestrationState>()('videoLoading').set(
                true
            )(state);
        }
        case SET_CHROMAKEY_STATE: {
            const { payload } = action;
            return Lens.fromProp<ITelestrationState>()('chromakeyApplied').set(
                payload
            )(state);
        }
        case SET_LAST_TELESTRATED_VIDEO: {
            const { payload } = action;
            return Lens.fromProp<ITelestrationState>()(
                'lastTelestratedVideo'
            ).set(payload)(state);
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
                    return {
                        ...newState,
                        overlays: [],
                    };
                }
                case 'undo': {
                    state.telestrationManager.triggerUndo();
                    const overlayLens = Lens.fromProp<ITelestrationState>()(
                        'overlays'
                    );
                    return overlayLens.modify((a) => dropEnd(1, a))(state);
                }
                case 'redo': {
                    state.telestrationManager.triggerRedo();
                    const overlayLens = Lens.fromProp<ITelestrationState>()(
                        'overlays'
                    );
                    return overlayLens.modify((a) => dropEnd(1, a))(state);
                }
                case 'record': {
                    return Lens.fromPath<ITelestrationState>()([
                        'recording',
                        'recordingActive',
                    ]).set(true)(state);
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
                case 'chromakey_first_mount': {
                    state.telestrationManager.setChromaKeySettingsFunction();
                    return {
                        ...newState,
                        videoLoading: false,
                    };
                }
                case 'chromakey': {
                    state.telestrationManager.setChromaKeySettingsFunction();
                    return {
                        ...newState,
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
            let isChromakeyApplied = state.chromakeyApplied;
            if (act === 'undo') {
                state.telestrationManager.undoChromaKey();
                if (state.telestrationManager.chromaKey.hlist.length === 0) {
                    isChromakeyApplied = false;
                }
            } else if (act === 'clear') {
                isChromakeyApplied = false;
                state.telestrationManager.resetChromaKey();
            } else if (act === 'save') {
                // return to regular telestration mode
                state.telestrationManager.setLiveModeFunction();
                return {
                    ...state,
                    editMode: 'default' as 'default',
                };
            }
            return { ...state, chromakeyApplied: isChromakeyApplied };
        }
        case TOGGLE_ARROW_TYPE: {
            if (action.payload === 'playercutout') {
                state.telestrationManager.creationObject.arrow.switchType();
            } else {
                state.telestrationManager.creationObject.switchType();
            }
            return state;
        }
        case INITIALIZE_TM: {
            state.telestrationManager.resetChromaKey();
            state.telestrationManager.clearTelestrations();
            state.telestrationManager.setLiveModeFunction();
            return {
                ...state,
                overlays: [],
            };
        }
        case CHANGE_TELESTRATION_COLOR: {
            const { color } = action;
            state.telestrationManager.setTelestrationColor(color);
            return state;
        }
        case REPLACE_TELESTRATION_COLOR: {
            const { payload } = action;
            state.telestrationManager.config = {
                ...state.telestrationManager.config,
                ...payload,
            };
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
    lastTelestratedVideo: '',
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
