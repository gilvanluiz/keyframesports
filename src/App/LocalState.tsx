import * as React from 'react';
import { compose } from 'fp-ts/lib/function';
import { Lens } from 'monocle-ts';
import axios, { CancelTokenSource } from 'axios';
import { IClip } from '../Assets/videoVideoLibrary';

export interface IQueuedUpload {
    id: string;
    title: string;
    file?: File;
    progress?: number | undefined;
    converting?: boolean;
    downloading?: boolean;
    success?: boolean;
}

export interface IUploadsQueue {
    [id: string]: IQueuedUpload;
}

interface IOnUploadStartAction {
    type: 'ON_UPLOAD_START';
    video: IQueuedUpload;
}

interface IOnUploadProgressAction {
    type: 'ON_UPLOAD_PROGRESS';
    videoID: string;
    percentage: number;
}

interface IOnStartConversionAction {
    type: 'ON_START_CONVERSION';
    videoID: string;
}

interface IOnStartDownloadingAction {
    type: 'ON_START_DOWNLOADING';
    videoID?: string;
    video?: IQueuedUpload;
}

interface IOnUploadSuccessAction {
    type: 'ON_UPLOAD_SUCCESS';
    videoID: string;
}

interface IOnUploadCancelAction {
    type: 'ON_CREATE_NEW_CANCEL_TOKEN';
}
interface IOnToggleLeftSideMenuAction {
    type: 'ON_TOGGLE_LEFT_SIDE_MENU';
}

interface IOnToggleTelestration {
    type: 'ON_TOGGLE_TELESTRATION';
}

interface IOnTouchDeviceDetected {
    type: 'ON_TOUCH_DEVICE_DETECTED';
}

interface IOnUserVideosLoaded {
    type: 'ON_VIDEOS_LOADED';
    payload: string[];
}

interface IOnChangeSort {
    type: 'CHANGE_SORT';
    payload: IClip[];
}
type IAction =
    | IOnUploadStartAction
    | IOnUploadProgressAction
    | IOnStartConversionAction
    | IOnStartDownloadingAction
    | IOnUploadSuccessAction
    | IOnUploadCancelAction
    | IOnToggleLeftSideMenuAction
    | IOnToggleTelestration
    | IOnTouchDeviceDetected
    | IOnUserVideosLoaded
    | IOnChangeSort;

export interface ILocalState {
    uploadsQueue: IUploadsQueue;
    notifications: any[];
    leftSideMenuOpen: boolean;
    isTelestrating: boolean;
    isTouchDevice: boolean;
    VideoUploadingCancelToken: CancelTokenSource;
    userVideos: string[];
}

export interface ILocalStateMgr {
    state: ILocalState;
    dispatch: (action: IAction) => any;
}

interface IProviderProps {
    children: any;
}

const initialLocalState = {
    uploadsQueue: {},
    notifications: [],
    leftSideMenuOpen: true,
    isTelestrating: false,
    isTouchDevice: false,
    VideoUploadingCancelToken: axios.CancelToken.source(),
    userVideos: [],
};

const LocalContext = React.createContext({});

const localReducer = (state: ILocalState, action: IAction) => {
    switch (action.type) {
        case 'ON_UPLOAD_START': {
            return Lens.fromPath<ILocalState>()([
                'uploadsQueue',
                action.video.id,
            ]).set(action.video)(state);
        }
        case 'ON_UPLOAD_PROGRESS': {
            return Lens.fromPath<ILocalState>()([
                'uploadsQueue',
                action.videoID,
                'progress',
            ]).set(action.percentage)(state);
        }
        case 'ON_START_CONVERSION': {
            return compose(
                Lens.fromPath<ILocalState>()([
                    'uploadsQueue',
                    action.videoID,
                    'progress',
                ]).set(undefined),
                Lens.fromPath<ILocalState>()([
                    'uploadsQueue',
                    action.videoID,
                    'converting',
                ]).set(true)
            )(state);
        }
        case 'ON_START_DOWNLOADING': {
            if (action.videoID) {
                return compose(
                    Lens.fromPath<ILocalState>()([
                        'uploadsQueue',
                        action.videoID,
                        'converting',
                    ]).set(false),
                    Lens.fromPath<ILocalState>()([
                        'uploadsQueue',
                        action.videoID,
                        'downloading',
                    ]).set(true)
                )(state);
            } else if (action.video) {
                return Lens.fromPath<ILocalState>()([
                    'uploadsQueue',
                    action.video.id,
                ]).set(action.video)(state);
            }

            return state;
        }
        case 'ON_UPLOAD_SUCCESS': {
            return compose(
                Lens.fromPath<ILocalState>()([
                    'uploadsQueue',
                    action.videoID,
                    'downloading',
                ]).set(false),
                Lens.fromPath<ILocalState>()([
                    'uploadsQueue',
                    action.videoID,
                    'success',
                ]).set(true)
            )(state);
        }
        case 'ON_CREATE_NEW_CANCEL_TOKEN': {
            return Lens.fromProp<ILocalState>()(
                'VideoUploadingCancelToken'
            ).set(axios.CancelToken.source())(state);
        }
        case 'ON_TOGGLE_TELESTRATION': {
            return Lens.fromProp<ILocalState>()('isTelestrating').set(
                !state.isTelestrating
            )(state);
        }
        case 'ON_TOGGLE_LEFT_SIDE_MENU': {
            return Lens.fromProp<ILocalState>()('leftSideMenuOpen').set(
                !state.leftSideMenuOpen
            )(state);
        }
        case 'ON_TOUCH_DEVICE_DETECTED': {
            return Lens.fromProp<ILocalState>()('isTouchDevice').set(true)(
                state
            );
        }
        case 'ON_VIDEOS_LOADED': {
            return Lens.fromProp<ILocalState>()('userVideos').set(
                action.payload
            )(state);
        }
        default: {
            return state;
        }
    }
};

export const LocalContextProvider = ({ children }: IProviderProps) => {
    const [state, dispatch]: [ILocalState, any] = React.useReducer(
        localReducer,
        initialLocalState
    );
    const localStateMgr: ILocalStateMgr = { state, dispatch };
    return (
        <LocalContext.Provider value={localStateMgr}>
            {...children}
        </LocalContext.Provider>
    );
};

export const withLocalState = (Child: React.ComponentType<any>) => (
    props: any
) => {
    return (
        <LocalContext.Consumer>
            {(value: ILocalState) => <Child localStateMgr={value} {...props} />}
        </LocalContext.Consumer>
    );
};
