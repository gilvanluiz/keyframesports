import update from 'immutability-helper';
import { compose } from 'fp-ts/lib/function';
import { Lens } from 'monocle-ts';
import { IAction, IState, IVideo } from './types';

export const initialState: IState = {
    selectedVideoID: null,
    videos: [],
    modals: {
        upload: {
            opened: false,
        },
        delete: {
            opened: false,
            text: '',
        },
    },
    deletingVideoID: null,
};

export const reducer = (state: IState, action: IAction) => {
    switch (action.type) {
        case 'SET_VIDEOS': {
            const selectedVideoID = localStorage.getItem('selectedVideoID');
            const videos = [
                ...action.videos.filter((video) =>
                    state.videos.every((v) => v.id !== video.id)
                ),
                ...state.videos,
            ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
            const videoInLibrary = !!videos.find(
                (video) => video.id === selectedVideoID
            );
            return compose(
                Lens.fromProp<IState>()('videos').set(videos),
                Lens.fromProp<IState>()('selectedVideoID').set(
                    videoInLibrary ? selectedVideoID : null
                )
            )(state);
        }
        case 'ON_SELECT_VIDEO': {
            const needDeselect = state.selectedVideoID === action.videoID;
            needDeselect
                ? localStorage.removeItem('selectedVideoID')
                : localStorage.setItem('selectedVideoID', action.videoID);
            return Lens.fromProp<IState>()('selectedVideoID').set(
                needDeselect ? null : action.videoID
            )(state);
        }
        case 'ON_CHECK_VIDEO': {
            return Lens.fromProp<IState>()(
                'videos'
            ).modify((videos: IVideo[]) =>
                videos.map((video: IVideo) =>
                    video.id === action.videoID
                        ? Lens.fromProp<IVideo>()('checked').set(
                              !video.checked
                          )(video)
                        : video
                )
            )(state);
        }
        case 'ON_UNCHECK_VIDEOS': {
            return Lens.fromProp<IState>()(
                'videos'
            ).modify((videos: IVideo[]) =>
                videos.map((video: IVideo) =>
                    video.checked
                        ? Lens.fromProp<IVideo>()('checked').set(
                              !video.checked
                          )(video)
                        : video
                )
            )(state);
        }
        case 'ON_DOWNLOAD_SUCCESS': {
            return Lens.fromProp<IState>()(
                'videos'
            ).modify((videos: IVideo[]) =>
                videos.map((video: IVideo) =>
                    action.videoID === video.id
                        ? Lens.fromProp<IVideo>()('downloaded').set(true)(video)
                        : video
                )
            )(state);
        }
        case 'ON_DELETE_VIDEO': {
            return compose(
                Lens.fromPath<IState>()(['modals', 'delete', 'opened']).set(
                    true
                ),
                Lens.fromPath<IState>()(['modals', 'delete', 'text']).set(
                    action.text
                ),
                Lens.fromProp<IState>()('deletingVideoID').set(action.videoID)
            )(state);
        }
        case 'VIDEO_DELETED': {
            const needDeselect = state.selectedVideoID === action.videoID;
            if (needDeselect) {
                localStorage.removeItem('selectedVideoID');
            }
            return compose(
                Lens.fromPath<IState>()(['modals', 'delete', 'opened']).set(
                    false
                ),
                Lens.fromProp<IState>()('deletingVideoID').set(null),
                Lens.fromProp<IState>()('selectedVideoID').set(
                    needDeselect ? null : state.selectedVideoID
                ),
                Lens.fromProp<IState>()('videos').modify((videos: IVideo[]) =>
                    videos.map((video: IVideo) =>
                        action.videoID === video.id
                            ? compose(
                                  Lens.fromProp<IVideo>()('checked').set(false),
                                  Lens.fromProp<IVideo>()('deleted').set(true)
                              )(video)
                            : video
                    )
                )
            )(state);
        }
        case 'CHANGE_VIDEO_INDEX': {
            const dragVideo = state.videos[action.dragIndex];
            return Lens.fromProp<IState>()('videos').set(
                update(state.videos, {
                    $splice: [
                        [action.dragIndex, 1],
                        [action.hoverIndex, 0, dragVideo],
                    ],
                })
            )(state);
        }
        case 'TOGGLE_MODAL': {
            return Lens.fromPath<IState>()([
                'modals',
                action.modalName,
                'opened',
            ]).set(!state.modals[action.modalName].opened)(state);
        }
        default: {
            return state;
        }
    }
};
