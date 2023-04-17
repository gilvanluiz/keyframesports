import * as React from 'react';
import * as uuid from 'uuid/v4';
import getBlobDuration from 'get-blob-duration';
import {
    Button,
    Dialog,
    DialogTitle,
    Divider,
    TextField,
    Box,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
} from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import { ILocalStateMgr, withLocalState } from '../../../App/LocalState';
import { IUploadVideo, beamVideo } from '../../../Utilities/AwsVideoLibrary';
import { assoc, pipe } from 'ramda';
import { Dropzone } from './DropzoneUpload';
import { compose } from 'fp-ts/lib/function';
import { useState } from 'react';
import {
    gameFootageUploadCompleted,
    gameFootageUploadStarted,
} from 'src/App/UserEvents';
import { sendUserEvent } from 'src/App/UserEvents/UserEventManager';

const styles = (theme: ITheme) => ({
    dialogBox: {
        padding: theme.spacing(1.25),
        paddingTop: '0px',
    },
    buttonRow: {
        paddingTop: theme.spacing(1.25),
        textAlign: 'right' as 'right',
        '& button': {
            borderRadius: theme.spacing(1),
        },
    },
    button: {
        marginLeft: theme.spacing(1),
    },
    form: {
        margin: `${theme.spacing(2)} 0px`,
    },
    videoTitle: {
        marginRight: theme.spacing(1.5),
        width: '30%',
    },
    videoDescription: {
        width: `calc(70% - ${theme.spacing(3)}px)`,
        marginRight: theme.spacing(1.5),
    },
    attachedFile: {
        display: 'flex',
        justifyContent: 'space-between',
        border: '1px solid rgba(255, 255, 255, 0.23)',
    },
    clearIcon: {
        cursor: 'pointer',
        alignSelf: 'center',
        '&:hover': {
            color: '#3f7fb5ab',
        },
    },
});

interface IProps {
    open: boolean;
    closeModal: () => void;
    localStateMgr: ILocalStateMgr;
    onVideoUpload: (id: string, name: string) => void;
    onVideoUploadComplete: (id: string) => void;
    onUploadProgress: (id: string, percentage: number) => void;
    onStartConversion: any;
}

interface IFileForm {
    title: string;
    subtitle: string;
}

interface IFormState {
    fileForms: IFileForm[];
    videoFiles: File[];
}

const videoUploadDialog = ({
    classes,
    open,
    closeModal,
    onVideoUpload,
    onStartConversion,
    onVideoUploadComplete,
    onUploadProgress,
    localStateMgr,
}: IProps & IWithStyles) => {
    const initFormState: IFormState = {
        fileForms: [],
        videoFiles: [],
    };
    const [formState, updateFormState] = useState(initFormState);
    const onUpdate = (field: string, index: number) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        formState.fileForms[index][field] = e.currentTarget.value;

        return updateFormState({
            ...formState,
            fileForms: [...formState.fileForms],
        });
    };

    const onFileAttach = (files: File[]) => {
        const forms = files.map((file) => ({
            title: file.name,
            subtitle: '',
        }));

        updateFormState({
            ...formState,
            fileForms: formState.fileForms.concat(forms),
            videoFiles: formState.videoFiles.concat(files),
        });
    };

    const clearState = () => updateFormState(initFormState);

    const isReady = () =>
        formState.videoFiles.length &&
        formState.fileForms.every((form) => form.title.length > 1);

    const formNotReady = !isReady();

    const saveUpload = () => {
        if (formState.videoFiles.length) {
            closeModal();
            formState.videoFiles.forEach(async (file, index) => {
                const id = uuid();
                sendUserEvent(
                    gameFootageUploadStarted,
                    window.location.href,
                    id
                );
                const duration = await getBlobDuration(file);

                const _onUploadProgress = (percent: number) =>
                    onUploadProgress(id, percent);
                const _onUploadStartConversation = () => onStartConversion(id);
                const _onVideoUploadComplete = () => onVideoUploadComplete(id);
                onVideoUpload(id, formState.fileForms[index].title);

                const videoPayload = pipe(
                    assoc('type', 'footage'),
                    assoc('id', id),
                    assoc('title', formState.fileForms[index].title),
                    assoc('subtitle', formState.fileForms[index].subtitle),
                    assoc('duration', duration),
                    assoc(
                        'cancelTokenSource',
                        localStateMgr.state.VideoUploadingCancelToken
                    ),
                    assoc('videoFile', file),
                    assoc('onSuccess', _onVideoUploadComplete),
                    assoc('onProgress', _onUploadProgress),
                    assoc('onStartConversion', _onUploadStartConversation)
                )({}) as IUploadVideo;

                beamVideo(videoPayload).then((res: any) => {
                    if (res) {
                        sendUserEvent(
                            gameFootageUploadCompleted,
                            window.location.href,
                            id
                        );
                    }
                    console.log(res);
                });
            });
            clearState();
        } else {
            throw Error('formState does not have video file!');
        }
    };

    const removeVideo = (index: number) => {
        formState.videoFiles.splice(index, 1);
        formState.fileForms.splice(index, 1);

        updateFormState({
            ...formState,
            fileForms: [...formState.fileForms],
            videoFiles: [...formState.videoFiles],
        });
    };

    return (
        <Box>
            <Dialog open={open} onClose={closeModal}>
                <Box className={classes.dialogBox}>
                    <DialogTitle>Upload a Video</DialogTitle>
                    <Divider />
                    {formState.videoFiles.length ? (
                        <Box>
                            {formState.videoFiles.map((video, index) => {
                                return (
                                    <Box
                                        key={index}
                                        className={classes.attachedFile}
                                        border={1}
                                        borderRadius={4}
                                        padding={2}
                                        marginBottom={2}
                                    >
                                        <TextField
                                            className={classes.videoTitle}
                                            required
                                            label='Title'
                                            id='title'
                                            variant='standard'
                                            value={
                                                formState.fileForms[index].title
                                            }
                                            onChange={onUpdate('title', index)}
                                        />
                                        <TextField
                                            className={classes.videoDescription}
                                            label='Description'
                                            id='description'
                                            variant='standard'
                                            value={
                                                formState.fileForms[index]
                                                    .subtitle
                                            }
                                            onChange={onUpdate(
                                                'subtitle',
                                                index
                                            )}
                                        />
                                        <ClearIcon
                                            className={classes.clearIcon}
                                            onClick={() => removeVideo(index)}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>
                    ) : null}
                    <Dropzone
                        onFileAttach={onFileAttach}
                        showScreenshot={Boolean(formState.videoFiles.length)}
                    />
                    <Box className={classes.buttonRow}>
                        <Button
                            variant='contained'
                            color='primary'
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
                    </Box>
                </Box>
            </Dialog>
        </Box>
    );
};

export const VideoUploadDialog = compose(
    withLocalState,
    withStyles(styles)
)(videoUploadDialog);
