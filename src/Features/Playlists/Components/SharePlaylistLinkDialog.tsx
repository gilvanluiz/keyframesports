import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    TextField,
} from '@material-ui/core';
import {
    IPlaylistStateManager,
    closePlaylistShareDialogAction,
} from '../State';
import { withStyles } from '@material-ui/core/styles';

interface IProps {
    playlistStateMgr: IPlaylistStateManager;
    classes: any;
}

const styles = {
    dialogBox: {
        padding: '0 10px 10px 10px',
    },
    buttonRow: {
        paddingTop: '10px',
        textAlign: 'right' as 'right',
    },
    button: {
        marginLeft: '8px',
    },
    form: {
        margin: '15px 0',
    },
    videoTitle: {
        marginRight: '12px',
    },
    videoDescription: {
        width: '338px',
    },
};

const shareDialog = ({
    playlistStateMgr: { playlistState, updatePlaylistState },
    classes,
}: IProps) => {
    const url =
        'https://app.keyframesports.com/share/playlist/' +
        playlistState.playlistShareId;
    const handleClose = () =>
        updatePlaylistState(closePlaylistShareDialogAction());
    const handleFocus = (event: any) => event.target.select();
    return (
        <div className='share-dialog-wrapper'>
            <Dialog
                onClose={handleClose}
                open={Boolean(playlistState.playlistShareId)}
            >
                <DialogTitle>Share Video Link</DialogTitle>
                <TextField
                    onClick={handleFocus}
                    variant='outlined'
                    value={url}
                />
            </Dialog>
        </div>
    );
};
export const ShareDialog = withStyles(styles)(shareDialog);
