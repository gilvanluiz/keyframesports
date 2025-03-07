import TelestrationManager from './Model/TelestrationManager';

export interface ITelestrationMode {
    name: string;
}

export type EditMode =
    | 'circle'
    | 'arrow'
    | 'freearrow'
    | 'chromakey'
    | 'chromakey_first_mount'
    | 'lightshaft'
    | 'playercutout'
    | 'straightarrow'
    | 'linkedcursor'
    | 'polygon_t'
    | 'textbox'
    | 'undo'
    | 'redo'
    | 'record'
    | 'stop_recording'
    | 'default'
    | 'save_effect';

export interface ICoordinates {
    x: number;
    y: number;
}

export interface IFraction {
    numerator: number;
    denominator: number;
}

export interface IOverlayCircle {
    type: 'overlay/Circle';
    coordinates: ICoordinates;
    svg: { src: string };
}

export interface IOverlayArrow {
    type: 'overlay/Arrow';
    coordinates: {
        start: ICoordinates;
        end: ICoordinates;
    };
}

export interface IOverlayImgBase {
    createdAt: Date;
    video: {
        createdAt: number;
    };
    coordinates: ICoordinates;
}

type IOverlayIndividual = IOverlayCircle | IOverlayArrow;

export type IOverlayImg = IOverlayImgBase & IOverlayIndividual;

export interface IKeyFrame {
    coordinates: {
        x: number;
        y: number;
    };
    time: number;
}

export interface IUploadTelestration {
    file?: Blob;
    percentUploaded?: number;
    isConverting?: boolean;
    isDownloading?: boolean;
}

export interface IQueuedUpload {
    file?: Blob;
    title: string;
    percentUploaded?: number;
    isConverting?: boolean;
    isDownloading?: boolean;
}

export interface IQueuedUploadRecord {
    [id: string]: IQueuedUpload;
}

export interface ITelestrationState {
    telestrationMode?: ITelestrationMode;
    editMode: EditMode;
    chromakeyApplied: boolean;
    videoPlaying: boolean;
    videoSize: {
        height: number;
        width: number;
    };
    overlays: IOverlayImg[];
    recording: {
        animationCanvasRef: React.RefObject<HTMLCanvasElement>;
        cursorCanvasRef: React.RefObject<HTMLCanvasElement>;
        recordingCanvasRef: React.RefObject<HTMLCanvasElement>;
        videoRef: React.RefObject<HTMLVideoElement>;
        recordingActive: boolean;
    };
    dragState?: {
        mode: EditMode;
        startCoordinates: ICoordinates;
        endCoordinates: ICoordinates;
    };
    telestrationManager: TelestrationManager;
    videoLoadError: string;
    videoLoading: boolean;
    lastTelestratedVideo: string;
}

// ACTIONS

export interface IEditModeAction {
    type: 'telestrations/SET_EDIT_MODE';
    editMode: EditMode;
    setHint?: (hint: string) => void;
}

export interface IInitializeTM {
    type: 'telestrations/INITIALIZE_TM';
}

export interface ICallChromakeyActionAction {
    type: 'telestrations/CALL_CHROMAKEY_ACTION';
    action: string;
}

export interface ISetChromakeyState {
    type: 'telestrations/SET_CHROMAKEY_STATE';
    payload: boolean;
}

export interface IChangeTelestrationColorAction {
    type: 'telestrations/CHANGE_TELESTRATION_COLOR';
    color: string;
}

export interface IReplaceTelestrationColorsAction {
    type: 'telestrations/REPLACE_TELESTRATION_COLOR';
    payload: IColorPayload;
}

export interface IChangeTextAction {
    type: 'telestrations/CHANGE_TEXT';
    text: string;
}

export interface IChangeFontSizeAction {
    type: 'telestrations/CHANGE_FONT_SIZE';
    fontSize: number;
}

export interface IChangeTextColorAction {
    type: 'telestrations/CHANGE_TEXT_COLOR';
    textColor: string;
}

export interface IChangeTextBackgroundColorAction {
    type: 'telestrations/CHANGE_TEXT_BACKGROUND_COLOR';
    backgroundColor: string;
}

export interface ISaveTextBox {
    type: 'telestrations/SAVE_TEXT_BOX';
}

export interface IRewindVideoAction {
    type: 'telestrations/REWIND_VIDEO';
    rewindTime: number;
}

export interface IAddImageAction {
    type: 'telestrations/ADD_OVERLAY_IMG';
    overlayImg: IOverlayImg;
}

export interface IAddKeyFrameAction {
    type: 'telestrations/ADD_KEYFRAME';
    keyFrameObj: IKeyFrame;
}

export interface ISetDragStateStartAction {
    type: 'telestrations/SET_DRAG_STATE';
    dragMode: 'start';
    editMode: EditMode;
    coordinates: ICoordinates;
    videoTime: number;
}

export interface ISetDragStateEndAction {
    type: 'telestrations/SET_DRAG_STATE';
    dragMode: 'end';
    editMode: EditMode;
    coordinates: ICoordinates;
    videoTime: number;
}

export interface IUpdateDLProgressAction {
    type: 'telestrations/UPDATE_DL_PROGRESS';
    id: string;
    progress: number;
}

export interface ICompleteDLProcessAction {
    type: 'telestrations/COMPLETE_DL_PROCESS';
    id: string;
}

export interface IStartConversionAction {
    type: 'telestrations/START_CONVERSION';
    id: string;
}

export interface IStartDownloadAction {
    type: 'telestrations/START_DOWNLOAD';
    id: string;
}

export interface ISetTelesetrationFormAction {
    type: 'telestrations/SET_TELESTRATION_FORM';
    value: string;
    fieldName: string;
}

export interface ISaveTelestrationAction {
    type: 'telestrations/SAVE_TELESTRATION';
    fileId: string;
    title: string;
    percentUploaded: number;
}

export interface ICloseSaveTelestrationAction {
    type: 'telestrations/CLOSE_SAVE_TELESTRATION';
    fileId: string;
}

export interface ISetVideoLoadErrorAction {
    type: 'telestrations/SET_VIDEO_LOAD_ERROR';
    message: string;
}

export interface ISetLastTelestratedVideoAction {
    type: 'telestrations/SET_LAST_TELESTRATED_VIDEO';
    payload: string;
}

export interface ISetVideoLoadedAction {
    type: 'telestrations/SET_VIDEO_LOADED';
}

export interface ISetVideoUnmountedAction {
    type: 'telestrations/SET_VIDEO_UNMOUNT';
}
export interface IToggleArrowType {
    type: 'telestrations/TOGGLE_ARROW_TYPE';
    payload: EditMode;
}

export type ISetDragStateAction =
    | ISetDragStateStartAction
    | ISetDragStateEndAction;

export type IAction =
    | ISetLastTelestratedVideoAction
    | ISetDragStateAction
    | IAddImageAction
    | IAddKeyFrameAction
    | IRewindVideoAction
    | ISetTelesetrationFormAction
    | IUpdateDLProgressAction
    | ICompleteDLProcessAction
    | IStartConversionAction
    | IStartDownloadAction
    | ISaveTelestrationAction
    | ICloseSaveTelestrationAction
    | IEditModeAction
    | ICallChromakeyActionAction
    | IChangeTelestrationColorAction
    | IChangeTextAction
    | IChangeFontSizeAction
    | IChangeTextColorAction
    | IChangeTextBackgroundColorAction
    | ISaveTextBox
    | ISetVideoLoadErrorAction
    | ISetVideoLoadedAction
    | IReplaceTelestrationColorsAction
    | IInitializeTM
    | IToggleArrowType
    | ISetChromakeyState
    | ISetVideoUnmountedAction;

export interface ITelestrationStateMgr {
    state: ITelestrationState;
    dispatchAction: (action: IAction) => any;
}

export interface IColorPayload {
    POLYGON_COLOR: string;
    ARROW_COLOR: string;
    CURSOR_COLOR: string;
    PLAYER_CUT_OUT_ARROW_COLOR: string;
}
