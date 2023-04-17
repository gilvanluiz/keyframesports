import * as React from 'react';
import * as uuid from 'uuid/v4';
import {
    Dialog,
    DialogTitle,
    Divider,
    TextField,
    Button,
} from '@material-ui/core';
import { assoc, pipe } from 'ramda';
import { useState } from 'react';
import { flow } from 'fp-ts/lib/function';
import { withStyles } from '@material-ui/core/styles';
import { telestrationBlob } from '../Utils/Recording';
import { beamVideo, IUploadVideo } from '../../../Utilities/Aws';
import { withTelestrationState } from '../State';
import { ITelestrationStateMgr } from '../Types';
import {
    telestrationSavingStarted,
    telestrationRecordingSavingCanceled,
    telestrationRecordingSavingFinished,
} from 'src/App/UserEvents';
import { sendUserEvent } from 'src/App/UserEvents/UserEventManager';

const styles = () => ({
    modalWrapper: {
        minWidth: '310px',
        minHeight: '400px',
        backgroundPosition: 'center',
        justifyContent: 'center',
    },
    overlay: {
        backgroundColor: '#12121238',
        position: 'absolute' as 'absolute',
        height: '100%',
        width: '100%',
    },
    telestrationTitle: {
        marginTop: '20px',
    },
    '@keyframes shadow-pulse': {
        '0%': { boxShadow: '0 0 0 0px rgba(0, 0, 0, 0.2)' },
        '100%': { boxShadow: '0 0 0 35px rgba(0, 0, 0, 0)' },
    },
    btnsContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column' as 'column',
    },
    btn: {
        width: '97%',
        marginTop: '15px',
        animation: 'shadow-pulse 1s infinite',
        borderRadius: '8px',
    },
    fields: {
        margin: '0 5px',
    },
    selectField: {
        marginTop: '15px',
    },
    progressDiv: {
        margin: '110px 30px 0',
        textAlign: 'center' as 'center',
    },
});

interface ISaveTelestrationModalProps {
    telestratedvideoID: string;
    telestrationStateMgr: ITelestrationStateMgr;
    classes: any;
    open: boolean;
    closeModal: any;
    onSaveTelestration: any;
    onProgress: any;
    onSuccess: any;
    onStartConversion: any;
    onStartDownload: any;
}

const saveTelestrationModal = ({
    telestratedvideoID,
    telestrationStateMgr,
    classes,
    open,
    closeModal,
    onSaveTelestration,
    onProgress,
    onSuccess,
    onStartConversion,
    onStartDownload,
}: ISaveTelestrationModalProps) => {
    const initFormState = {
        title: '',
        description: '',
    };
    const [formState, updateFormState] = useState(initFormState);

    const onFieldChange = (fieldName: string) => ({
        currentTarget: { value },
    }: React.ChangeEvent<HTMLInputElement>) => {
        updateFormState({
            ...formState,
            [fieldName]: value,
        });
    };

    const clearState = () => updateFormState(initFormState);

    const onSaveClick = () => {
        const id = uuid();
        sendUserEvent(telestrationSavingStarted, window.location.href, id);
        const { blob }: { blob: Blob } = telestrationBlob();
        const file = new File([blob], formState.title);

        const _onUploadSuccess = () => onSuccess(id);
        const _onUploadProgress = (percent: number) => onProgress(id, percent);
        const _onUploadStartConversation = () => onStartConversion(id);
        const _onUploadStartDownload = () => onStartDownload(id);

        onSaveTelestration(id, formState.title);

        const videoPayload = pipe(
            assoc('type', 'telestration'),
            assoc('id', id),
            assoc('title', formState.title),
            assoc('subtitle', formState.description),
            assoc('videoFile', file),
            assoc('videoType', 'telestration'),
            assoc('onSuccess', _onUploadSuccess),
            assoc('onProgress', _onUploadProgress),
            assoc('onStartConversion', _onUploadStartConversation),
            assoc('onStartDownload', _onUploadStartDownload)
        )({}) as IUploadVideo;

        beamVideo(videoPayload).then(() =>
            sendUserEvent(
                telestrationRecordingSavingFinished,
                window.location.href,
                id
            )
        );
        closeModal();
        clearState();
    };

    return (
        <Dialog open={open}>
            <div className={classes.modalWrapper}>
                <div className={classes.overlay}>
                    <DialogTitle style={{ textAlign: 'center' as 'center' }}>
                        {'Save Your Telestration'}
                    </DialogTitle>
                    <Divider />
                    <div>
                        <div className={classes.fields}>
                            <TextField
                                className={classes.telestrationTitle}
                                autoComplete='off'
                                required
                                fullWidth
                                label='Title'
                                id='video-title'
                                variant='outlined'
                                value={formState.title}
                                onChange={onFieldChange('title' as 'title')}
                            />
                            <TextField
                                className={classes.telestrationTitle}
                                autoComplete='off'
                                multiline
                                rows='4'
                                fullWidth
                                label='Notes'
                                value={formState.description}
                                onChange={onFieldChange(
                                    'description' as 'description'
                                )}
                                id='video-notes'
                                variant='outlined'
                            />
                        </div>
                        <div className={classes.btnsContainer}>
                            <Button
                                disabled={formState.title.length < 2}
                                variant='contained'
                                color='primary'
                                className={classes.btn}
                                onClick={onSaveClick}
                            >
                                Save
                            </Button>
                            <Button
                                variant='contained'
                                className={classes.btn}
                                onClick={() => {
                                    closeModal();
                                    clearState();
                                    sendUserEvent(
                                        telestrationRecordingSavingCanceled,
                                        window.location.href,
                                        telestratedvideoID
                                    );
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export const SaveTelestrationModal = flow(
    withTelestrationState,
    withStyles(styles)
)(saveTelestrationModal);
