import { IVideoLibraryStateMgr } from '../../State';
import { ILocalStateMgr } from '../../../../App/LocalState';
import { IClip } from '../../../../Assets/videoVideoLibrary';

export interface IQueuedUpload {
    title: string;
    id: string;
    progress: number;
    video: any;
}

export interface IQueuedUploadRecord {
    [id: string]: IQueuedUpload;
}

export type SortField =
    | 'updated_at'
    | 'created_at'
    | 'title'
    | 'size'
    | 'duration';
export type SortDirection = 'desc' | 'asc';
export type Sort = [SortField, SortDirection];

export interface IVideoListState {
    videos: any[];
    uploadModal: {
        open: boolean;
        videoUploaded: boolean;
        video?: any;
    };
    sort: Sort;
    loading: boolean;
    error: boolean;
    uploadVideoButtonText: boolean;
}

export interface IVideoListView {
    history: any;
    client: any;
    videoLibraryStateMgr: IVideoLibraryStateMgr;
    localStateMgr: ILocalStateMgr;
}

export interface IQueryResponse {
    data: {
        video: IClip[];
    };
    error: boolean;
    loading: boolean;
}

export interface IPayload {
    type: string;
    payload: any;
}

export const ItemTypes = {
    CARD: 'card',
};
