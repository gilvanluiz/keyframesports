import * as React from 'react';
import { Dialog } from '@material-ui/core';
import {
    IPlaylistStateManager,
} from '../State';

interface IProps {
    stateManager: IPlaylistStateManager;
}
export const VideoDialog = ({
    stateManager: { playlistState, updatePlaylistState },
}: IProps) => {
    if (playlistState.mode === 'play' || playlistState.mode === 'browse') {
        return null;
    }
    return (
        <Dialog open>
            <h1>Hi</h1>
        </Dialog>
    );
};
