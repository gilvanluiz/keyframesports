export interface IVideo {
    id: string;
    title: string;
    subtitle: string;
    thumbnailURL?: string;
    duration?: number;
    created_at: string;
    s3_key: string;
    checked?: boolean;
    deleted?: boolean;
    downloaded?: boolean;
}

export interface IState {
    selectedVideoID: string | null;
    videos: IVideo[];
    modals: {
        upload: {
            opened: boolean;
        };
        delete: {
            opened: boolean;
            text: string;
        };
    };
    deletingVideoID: string | null;
}

export interface ISetVideosAction {
    type: 'SET_VIDEOS';
    videos: IVideo[];
}

export interface IOnSelectVideoAction {
    type: 'ON_SELECT_VIDEO';
    videoID: string;
}

export interface IOnCheckVideoAction {
    type: 'ON_CHECK_VIDEO';
    videoID: string;
}

export interface IOnUncheckVideos {
    type: 'ON_UNCHECK_VIDEOS';
}

export interface IOnDeleteVideoAction {
    type: 'ON_DELETE_VIDEO';
    text: string;
    videoID: string;
}

export interface IOnDownloadSuccess {
    type: 'ON_DOWNLOAD_SUCCESS';
    videoID: string;
}

export interface IVideoDeletedAction {
    type: 'VIDEO_DELETED';
    videoID: string;
}

export interface IChangeVideIndexAction {
    type: 'CHANGE_VIDEO_INDEX';
    dragIndex: number;
    hoverIndex: number;
}

export interface IToggleModalAction {
    type: 'TOGGLE_MODAL';
    modalName: 'upload' | 'delete';
}

export type IAction =
    | ISetVideosAction
    | IOnSelectVideoAction
    | IOnCheckVideoAction
    | IOnUncheckVideos
    | IOnDeleteVideoAction
    | IOnDownloadSuccess
    | IVideoDeletedAction
    | IChangeVideIndexAction
    | IToggleModalAction;
