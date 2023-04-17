import { assocPath } from 'ramda';
import { compose } from 'fp-ts/lib/function';
import { remove } from 'fp-ts/lib/Record';
import { Lens } from 'monocle-ts';
import { IPayload, IQueuedUploadRecord, IUploadState } from './types';

export const initialState: IUploadState = {
    saveTelestrationModal: {
        open: false,
    },
    uploadQueue: {},
};

export const reducer = (state: IUploadState, { type, payload }: IPayload) => {
    switch (type) {
        case 'TOGGLE_SAVE_TELESTRATION_MODAL': {
            if (payload === false) {
                //  tslint:disable-next-line
                window['STOP_KEY_LISTENERS'] = false;
            }
            return assocPath(['saveTelestrationModal', 'open'], payload, state);
        }
        case 'ON_SAVE_TELESTRATION': {
            return compose(
                Lens.fromPath<IUploadState>()(['uploadQueue', payload.id]).set(
                    payload
                ),
                Lens.fromPath<IUploadState>()([
                    'saveTelestrationModal',
                    'open',
                ]).set(false)
            )(state);
        }
        case 'ON_UPLOAD_PROGRESS': {
            return Lens.fromPath<IUploadState>()([
                'uploadQueue',
                payload.id,
                'percentUploaded',
            ]).set(payload.percentage)(state);
        }
        case 'ON_START_CONVERSION': {
            return compose(
                Lens.fromPath<IUploadState>()([
                    'uploadQueue',
                    payload,
                    'isConverting',
                ]).set(true),
                Lens.fromPath<IUploadState>()([
                    'uploadQueue',
                    payload,
                    'percentUploaded',
                ]).set(undefined)
            )(state);
        }
        case 'ON_START_DOWNLOAD': {
            return compose(
                Lens.fromPath<IUploadState>()([
                    'uploadQueue',
                    payload,
                    'isConverting',
                ]).set(false),
                Lens.fromPath<IUploadState>()([
                    'uploadQueue',
                    payload,
                    'isDownloading',
                ]).set(true)
            )(state);
        }
        case 'ON_UPLOAD_SUCCESS': {
            return Lens.fromProp<IUploadState>()(
                'uploadQueue'
            ).modify((uploads: IQueuedUploadRecord) =>
                remove(payload, uploads)
            )(state);
        }
        default: {
            return state;
        }
    }
};
