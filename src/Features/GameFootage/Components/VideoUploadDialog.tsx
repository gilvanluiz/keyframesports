import * as React from 'react';
import * as uuid from 'uuid/v4';
import getBlobDuration from 'get-blob-duration';
import { Button, Dialog, TextField, Box } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import { ILocalStateMgr, withLocalState } from '../../../App/LocalState';
import { IUploadVideo, beamVideo } from '../../../Utilities/Aws';
import { assoc, pipe } from 'ramda';
import { Dropzone } from './DropzoneUpload';
import { compose } from 'fp-ts/lib/function';
import { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../../VideoLibrary/Components/styles/VideoUploadDialogStyles';
import { sendUserEvent } from 'src/App/UserEvents/UserEventManager';
import {
    gameFootageUploadCompleted,
    gameFootageUploadStarted,
} from 'src/App/UserEvents';

interface IProps {
    classes: any;
    open: boolean;
    localStateMgr: ILocalStateMgr;
    closeModal: () => any;
    onUploadStart: (name: string, video: File, id: string) => any;
    onUploadSuccess: (name: string) => any;
    onUploadProgress: (percentage: number, id: string) => any;
}

interface IFormState {
    fileForms: any[];
    videoFiles: File[];
}

const videoUploadDialog = ({
    classes,
    open,
    closeModal,
    onUploadStart,
    onUploadSuccess,
    onUploadProgress,
    localStateMgr,
}: IProps) => {
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

                const _onUploadSuccess = () => onUploadSuccess(id);

                onUploadStart(formState.fileForms[index].title, file, id);

                const videoPayload = pipe(
                    assoc('id', id),
                    assoc('title', formState.fileForms[index].title),
                    assoc('subtitle', formState.fileForms[index].subtitle),
                    assoc('duration', duration),
                    assoc('videoFile', file),
                    assoc('onSuccess', _onUploadSuccess),
                    assoc('onProgress', (percent: number) =>
                        onUploadProgress(percent, id)
                    )
                )({}) as IUploadVideo;

                beamVideo(videoPayload).then(() =>
                    sendUserEvent(
                        gameFootageUploadCompleted,
                        window.location.href,
                        id
                    )
                );
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
        <div className='video-upload-dialog'>
            <Dialog open={open} onClose={closeModal}>
                <div className={classes.dialogBox}>
                    {formState.videoFiles.length ? (
                        <div className={classes.files}>
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
                        </div>
                    ) : null}
                    <Dropzone
                        onFileAttach={onFileAttach}
                        hasFiles={Boolean(formState.videoFiles.length)}
                        text='Drop video files here or click this area'
                    />
                    <div className={classes.buttonsRow}>
                        <Button
                            className={classes.button}
                            onClick={() => {
                                closeModal();
                                clearState();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className={classes.button}
                            disabled={formNotReady}
                            onClick={saveUpload}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export const VideoUploadDialog = compose(
    withLocalState,
    withStyles(styles)
)(videoUploadDialog);
