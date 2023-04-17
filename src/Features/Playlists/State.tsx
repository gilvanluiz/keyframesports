import { createContext } from 'react';
import { range } from 'ramda';
import { Lens } from 'monocle-ts';
import { pipe } from 'fp-ts/lib/function';
import { snoc } from 'fp-ts/lib/Array';

export interface IClip {
    id: string;
    s3_key: string;
    title: string;
    duration: number;
    description: string;
    user_creator_email: string;
}

export interface IPlaylist {
    title: string;
    description: string;
    clipCount: number;
    createdAt: Date;
    imageSrc?: string;
}
export interface INewPlaylistModal {
    open: boolean;
    form: {
        title: string;
        description: string;
    };
}
export interface IPlaylistState {
    selectedClip?: IClip;
    playlists: IPlaylist[];
    playlistShareId: string | null;
    search: {
        filter: string;
    };
    newPlaylistModal: INewPlaylistModal;
    mode: 'play' | 'share' | 'browse' | 'action-dialog';
}
export interface INewPlaylistForm {
    title: string;
    description: string;
}
export type UpdatePlaylistState = (s: IPlaylistState) => IPlaylistState;

export interface IPlaylistStateManager {
    playlistState: IPlaylistState;
    updatePlaylistState: any;
}

const testPlaylists = (n: number): IPlaylist => ({
    title: 'Playlist ' + n,
    clipCount: Math.floor(Math.random() * 10) + 1,
    createdAt: new Date(2020, 1, n),
    description: 'I am a description',
});

export const initialPlaylistState: IPlaylistState = {
    mode: 'browse',
    search: { filter: '' },
    playlistShareId: null,
    newPlaylistModal: {
        open: false,
        form: {
            title: '',
            description: '',
        },
    },
    playlists: range(1, 4).map(testPlaylists),
};

export const PlaylistContext = createContext({});

// ACTION NAMES
const SHARE_VIDEO_LINK = 'playlist/SHARE_VIDEO_LINK';
const BROWSE_MODE = 'playlist/BROWSE_MODE';
const OPEN_VIDEO_ACTION_DIALOG = 'playlist/OPEN_VIDEO_ACTION_DIALOG';
const SELECT_CLIP = 'playlist/SELECT_CLIP';
const OPEN_NEW_PLAYLIST_MODAL = 'playlist/OPEN_NEW_PLAYLIST_MODAL';
const CLOSE_NEW_PLAYLIST_MODAL = 'playlist/CLOSE_NEW_PLAYLIST_MODAL';
const UPDATE_NEW_PLAYLIST_MODAL_FORM =
    'playlist/UPDATE_NEW_PLAYLIST_MODAL_FORM';
const ADD_NEW_PLAYLIST = 'playlist/ADD_NEW_PLAYLIST';
const CLEAR_NEW_PLAYLIST_MODAL = 'playlist/CLEAR_NEW_PLAYLIST_MODAL';
const SET_SEARCH_FILTER = 'playlist/SET_SEARCH_FILTER';
const OPEN_PLAYLIST_SHARE_DIALOG = 'playlist/OPEN_PLAYLIST_SHARE_DIALOG';
const CLOSE_PLAYLIST_SHARE_DIALOG = 'playlist/CLOSE_PLAYLIST_SHARE_DIALOG';

// ACTION TYPES
interface IShareVideoLinkAction {
    type: 'playlist/SHARE_VIDEO_LINK';
    clip: IClip;
}
interface IOpenPlaylistShareDialog {
    type: 'playlist/OPEN_PLAYLIST_SHARE_DIALOG';
    playlistId: string;
}
interface IClosePlaylistShareDialog {
    type: 'playlist/CLOSE_PLAYLIST_SHARE_DIALOG';
}
interface IBrowseModeAction {
    type: 'playlist/BROWSE_MODE';
}
interface IOpenVideoActionDialog {
    type: 'playlist/OPEN_VIDEO_ACTION_DIALOG';
    clip: IClip;
}
interface ISelectClipAction {
    type: 'playlist/SELECT_CLIP';
    clip: IClip;
}
interface IOpenNewPlaylistModal {
    type: 'playlist/OPEN_NEW_PLAYLIST_MODAL';
}
interface ICloseNewPlaylistModal {
    type: 'playlist/CLOSE_NEW_PLAYLIST_MODAL';
}
interface IUpdateNewPlaylistModalForm {
    type: 'playlist/UPDATE_NEW_PLAYLIST_MODAL_FORM';
    field: 'title' | 'description';
    value: string;
}
interface IAddNewPlaylist {
    type: 'playlist/ADD_NEW_PLAYLIST';
    playlist: IPlaylist;
}
interface IClearNewPlaylistModal {
    type: 'playlist/CLEAR_NEW_PLAYLIST_MODAL';
}
interface ISetSearchFilter {
    type: 'playlist/SET_SEARCH_FILTER';
    value: string;
}
export type IPlaylistAction =
    | IShareVideoLinkAction
    | ISelectClipAction
    | IBrowseModeAction
    | IOpenNewPlaylistModal
    | IUpdateNewPlaylistModalForm
    | ICloseNewPlaylistModal
    | IAddNewPlaylist
    | IClearNewPlaylistModal
    | ISetSearchFilter
    | IOpenPlaylistShareDialog
    | IClosePlaylistShareDialog
    | IOpenVideoActionDialog;

// ACTION CREATORS
export const shareVideoLinkAction = (clip: IClip) => ({
    type: SHARE_VIDEO_LINK as 'playlist/SHARE_VIDEO_LINK',
    clip,
});
export const openPlaylistShareDialogAction = (playlistId: string) => ({
    playlistId,
    type: OPEN_PLAYLIST_SHARE_DIALOG as 'playlist/OPEN_PLAYLIST_SHARE_DIALOG',
});
export const closePlaylistShareDialogAction = () => ({
    type: OPEN_PLAYLIST_SHARE_DIALOG as 'playlist/OPEN_PLAYLIST_SHARE_DIALOG',
});
export const browseModeAction = () => ({
    type: BROWSE_MODE as 'playlist/BROWSE_MODE',
});
export const openVideoDialogAction = (clip: IClip) => ({
    type: OPEN_VIDEO_ACTION_DIALOG as 'playlist/OPEN_VIDEO_ACTION_DIALOG',
    clip,
});
export const updateNewPlaylistModalFormAction = (
    field: 'title' | 'description',
    value: string
) => ({
    type: UPDATE_NEW_PLAYLIST_MODAL_FORM,
    field,
    value,
});
export const selectClipAction = (clip: IClip) => ({
    type: SELECT_CLIP as 'playlist/SELECT_CLIP',
    clip,
});
export const openNewPlaylistModalAction = () => ({
    type: OPEN_NEW_PLAYLIST_MODAL as 'playlist/OPEN_NEW_PLAYLIST_MODAL',
});
export const closeNewPlaylistModalAction = () => ({
    type: CLOSE_NEW_PLAYLIST_MODAL as 'playlist/CLOSE_NEW_PLAYLIST_MODAL',
});
export const addNewPlaylistAction = (playlist: IPlaylist) => ({
    type: ADD_NEW_PLAYLIST as 'playlist/ADD_NEW_PLAYLIST',
    playlist,
});
export const clearNewPlaylistModalAction = () => ({
    type: CLEAR_NEW_PLAYLIST_MODAL as 'playlist/CLEAR_NEW_PLAYLIST_MODAL',
});
export const setSearchFilterAction = (searchString: string) => ({
    type: SET_SEARCH_FILTER as 'playlist/SET_SEARCH_FILTER',
    value: searchString,
});

export type PlaylistActionHandler = (a: IPlaylistAction) => any;
export const reducer = (action: IPlaylistAction): UpdatePlaylistState => {
    switch (action.type) {
        case SELECT_CLIP: {
            return Lens.fromProp<IPlaylistState>()('selectedClip').set(
                action.clip
            );
        }
        case CLOSE_PLAYLIST_SHARE_DIALOG: {
            return Lens.fromProp<IPlaylistState>()('playlistShareId').set(null);
        }
        case OPEN_PLAYLIST_SHARE_DIALOG: {
            return Lens.fromProp<IPlaylistState>()('playlistShareId').set(
                action.playlistId
            );
        }
        case SET_SEARCH_FILTER: {
            return Lens.fromPath<IPlaylistState>()(['search', 'filter']).set(
                action.value
            );
        }
        case OPEN_NEW_PLAYLIST_MODAL: {
            return Lens.fromPath<IPlaylistState>()([
                'newPlaylistModal',
                'open',
            ]).set(true);
        }
        case ADD_NEW_PLAYLIST: {
            const addPlaylist = (ps: IPlaylist[]) => snoc(ps, action.playlist);

            return Lens.fromProp<IPlaylistState>()('playlists').modify(
                addPlaylist
            );
        }
        case CLEAR_NEW_PLAYLIST_MODAL: {
            return Lens.fromPath<IPlaylistState>()([
                'newPlaylistModal',
                'form',
            ]).set({ title: '', description: '' });
        }
        case CLOSE_NEW_PLAYLIST_MODAL: {
            return Lens.fromPath<IPlaylistState>()([
                'newPlaylistModal',
                'open',
            ]).set(false);
        }
        case UPDATE_NEW_PLAYLIST_MODAL_FORM: {
            return Lens.fromPath<IPlaylistState>()([
                'newPlaylistModal',
                'form',
                action.field,
            ]).set(action.value);
        }
        case OPEN_VIDEO_ACTION_DIALOG: {
            return pipe(
                Lens.fromProp<IPlaylistState>()('selectedClip').set(
                    action.clip
                ),
                Lens.fromProp<IPlaylistState>()('mode').set('action-dialog')
            );
        }
        case BROWSE_MODE: {
            return Lens.fromProp<IPlaylistState>()('mode').set('browse');
        }
        case SHARE_VIDEO_LINK: {
            return pipe(
                Lens.fromProp<IPlaylistState>()('selectedClip').set(
                    action.clip
                ),
                Lens.fromProp<IPlaylistState>()('mode').set('share')
            );
        }
    }
};
