import { assocPath } from 'ramda';
import { compose } from 'fp-ts/lib/function';
import { Lens } from 'monocle-ts';
import { IVideoListState, IPayload } from './types';

export const initialState: IVideoListState = {
    videos: [],
    uploadModal: {
        open: false,
        videoUploaded: false,
    },
    sort: ['created_at', 'desc'],
    loading: true,
    error: false,
    uploadVideoButtonText: true,
};

export const reducer = (
    state: IVideoListState,
    { type, payload }: IPayload
) => {
    switch (type) {
        case 'ON_LOAD_VIDEOS': {
            return compose(
                Lens.fromProp<IVideoListState>()('videos').set(payload),
                Lens.fromProp<IVideoListState>()('loading').set(false)
            )(state);
        }
        case 'ON_LOAD_MORE_VIDEOS': {
            return Lens.fromProp<IVideoListState>()('videos').set(
                [...state.videos, ...payload].filter(
                    (v, i, a) => a.findIndex((t) => t.id === v.id) === i
                )
            )(state);
        }
        case 'ON_UPLOAD_VIDEO': {
            const [video] = payload;
            return Lens.fromProp<IVideoListState>()('videos').set([
                { ...video, recent: true },
                ...state.videos,
            ])(state);
        }
        case 'ON_DELETE_VIDEO': {
            return Lens.fromProp<IVideoListState>()('videos').set(
                state.videos.filter((v) => v.id !== payload)
            )(state);
        }
        case 'ON_DRAG_VIDEO': {
            return Lens.fromProp<IVideoListState>()('videos').set(payload)(
                state
            );
        }
        case 'TOGGLE_UPLOAD_MODAL': {
            return assocPath(['uploadModal', 'open'], payload, state);
        }
        case 'CHANGE_SORT': {
            return Lens.fromProp<IVideoListState>()('sort').set(payload)(state);
        }
        case 'ON_ERROR': {
            return Lens.fromProp<IVideoListState>()('error').set(true)(state);
        }
        case 'ON_UPLOAD_BUTTON_TEXT_REMOVE': {
            return Lens.fromProp<IVideoListState>()(
                'uploadVideoButtonText'
            ).set(false)(state);
        }
        case 'ON_UPLOAD_BUTTON_TEXT_ADD': {
            return Lens.fromProp<IVideoListState>()(
                'uploadVideoButtonText'
            ).set(true)(state);
        }
        default: {
            return state;
        }
    }
};
