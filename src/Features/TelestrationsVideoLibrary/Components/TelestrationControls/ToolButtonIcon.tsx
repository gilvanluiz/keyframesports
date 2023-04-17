import * as React from 'react';
import {
    IconButton,
    withStyles,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
} from '@material-ui/core';
import { flow } from 'fp-ts/lib/function';
import { IIconButton } from './types';
import { styles } from './TelestrationControlsStyles';
import { withTelestrationState } from '../../State';
import { ITelestrationStateMgr } from '../../Types';
import { startRecorder } from '../../Utils/Recording';
import { useState } from 'react';
import CheckMark from '../../Assets/checkMark.png';

interface IProps {
    iconParameters: IIconButton;
    classes: any;
    openUploadModal: () => any;
    changeMode: any;
    telestrationStateMgr: ITelestrationStateMgr;
    setHints: (hint: string) => void;
}

const toolButtonIcon = ({
    classes,
    iconParameters,
    openUploadModal,
    changeMode,
    setHints,
    telestrationStateMgr,
}: IProps) => {
    const [
        isDeviceSupportMediaRecorder,
        setIsDeviceSupportMediaRecorder,
    ] = useState(true);
    const { state } = telestrationStateMgr;

    async function startRecording() {
        state.telestrationManager.setRecordingMode(true);
        const recordingStartResult = await startRecorder(
            state.recording.recordingCanvasRef,
            setHints
        );
        setIsDeviceSupportMediaRecorder(recordingStartResult);
        if (recordingStartResult) {
            changeMode('record', true)();
        }
    }

    const onClick = () => {
        switch (iconParameters.mode) {
            case 'record':
                if (state.recording.recordingActive) {
                    changeMode('stop_recording', true)();
                    openUploadModal();
                } else {
                    startRecording();
                }
                break;
            case state.editMode:
                return changeMode('save_effect', true)();
            default:
                return changeMode(iconParameters.mode, true)();
        }
    };

    const className =
        (iconParameters.mode !== 'default' &&
            iconParameters.mode === state.editMode) ||
        (state.editMode === 'chromakey_first_mount' &&
            iconParameters.mode === 'chromakey')
            ? classes.iconButtonActive
            : classes.iconButton;
    return (
        <>
            <Tooltip
                key={iconParameters.label}
                title={iconParameters.label}
                className={classes.tooltip}
            >
                <IconButton
                    aria-label={iconParameters.label}
                    onClick={onClick}
                    className={className}
                >
                    {iconParameters.mode === 'chromakey' &&
                        state.chromakeyApplied && (
                            <img
                                src={CheckMark}
                                className={classes.toolCheckmark}
                            />
                        )}
                    {iconParameters.icon}
                </IconButton>
            </Tooltip>
            {(iconParameters.mode === 'record' ||
                iconParameters.mode === 'playercutout') && (
                <Box className={classes.divider}></Box>
            )}
            <Dialog open={!isDeviceSupportMediaRecorder} keepMounted>
                <DialogTitle id='alert-dialog-slide-title'>Warning</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-slide-description'>
                        {`Seems that your browser doesn't support MediaRecorder.
                        If you use an IOS device you can use it on Safari. But first, go
                         to device Settings->Safari->Advanced->Experimental Features->MediaRecorder
                          and make sure it's on`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsDeviceSupportMediaRecorder(true)}
                        color='secondary'
                    >
                        Got it
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export const ToolButtonIcon = flow(
    withStyles(styles),
    withTelestrationState
)(toolButtonIcon);
