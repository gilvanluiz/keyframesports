import { ITelestrationStateMgr, EditMode } from '../../Types';
import { ILocalStateMgr } from '../../../../App/LocalState';

export interface IPayload {
    type: string;
    payload: any;
}

export interface IQueuedUpload {
    title: string;
    id: string;
    percentUploaded: number | undefined;
    isConverting?: boolean;
    isDownloading?: boolean;
}

export interface IQueuedUploadRecord {
    [id: string]: IQueuedUpload;
}

export interface IUploadState {
    saveTelestrationModal: {
        open: boolean;
    };
    uploadQueue: IQueuedUploadRecord;
}

export interface IActionButton {
    name: string;
    icon: any;
}

export interface IIconButton {
    label: string;
    icon: any;
    mode: EditMode;
}

export interface IProps {
    classes: any;
    telestrationStateMgr: ITelestrationStateMgr;
    localStateMgr: ILocalStateMgr;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    videoID: string;
}
