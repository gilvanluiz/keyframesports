import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    Button,
    TextField,
    Divider,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
    updateNewPlaylistModalFormAction,
    clearNewPlaylistModalAction,
    IPlaylist,
    addNewPlaylistAction,
    closeNewPlaylistModalAction,
    IPlaylistStateManager,
} from '../State';

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
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
    },
    videoTitle: {},
    videoDescription: {
        marginTop: 20,
    },
};

interface IProps {
    stateManager: IPlaylistStateManager;
    classes: any;
}

const newPlaylistDialog = ({
    classes,
    stateManager: { playlistState, updatePlaylistState },
}: IProps) => {
    const plModal = playlistState.newPlaylistModal;
    const formState = playlistState.newPlaylistModal.form;
    const onUpdate = (field: 'title' | 'description') => (
        e: React.ChangeEvent<HTMLInputElement>
    ) =>
        updatePlaylistState(
            updateNewPlaylistModalFormAction(field, e.currentTarget.value)
        );
    const form = (
        <div className={classes.form}>
            <TextField
                className={classes.videoTitle}
                required
                label='Title'
                id='video-title'
                variant='outlined'
                value={formState.title}
                onChange={onUpdate('title')}
            />
            <TextField
                className={classes.videoDescription}
                required
                multiline
                rows={6}
                label='Description'
                id='video-description'
                variant='outlined'
                value={formState.description}
                onChange={onUpdate('description')}
            />
        </div>
    );
    const closeModal = () => updatePlaylistState(closeNewPlaylistModalAction());
    const clearModal = () => updatePlaylistState(clearNewPlaylistModalAction());
    const saveUpload = () => {
        const playlist: IPlaylist = {
            ...formState,
            clipCount: 0,
            createdAt: new Date(),
        };
        updatePlaylistState(addNewPlaylistAction(playlist));
        closeModal();
        clearModal();
    };
    const clearState = () => ({});
    const formNotReady = !formState.title || !formState.description;
    return (
        <div className='new-playlist-dialog'>
            <Dialog open={plModal.open} onClose={closeModal}>
                <div className={classes.dialogBox}>
                    <DialogTitle>Create a Playlist</DialogTitle>
                    <Divider />
                    {form}

                    <div className={classes.buttonRow}>
                        <Button
                            variant='contained'
                            color='secondary'
                            disabled={formNotReady}
                            onClick={saveUpload}
                        >
                            Save
                        </Button>
                        <Button
                            variant='contained'
                            className={classes.button}
                            onClick={() => {
                                closeModal();
                                clearState();
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export const NewPlaylistDialog = withStyles(styles)(newPlaylistDialog);
