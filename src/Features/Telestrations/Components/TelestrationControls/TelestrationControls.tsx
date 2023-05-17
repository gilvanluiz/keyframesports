import * as React from 'react';
import * as ReactGA from 'react-ga';
import {
    List,
    Divider,
    Drawer,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Tooltip,
    IconButton,
    Snackbar,
    Checkbox,
    // TextField,
} from '@material-ui/core';
import {
    Add,
    Clear,
    Save,
    Undo,
    // FormatColorText,
    // Texture,
} from '@material-ui/icons';
import { useState, useEffect, useReducer, useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { compose } from 'fp-ts/lib/function';
import { IIconButton, IProps, IActionButton } from './types';
import {
    setModeAction,
    // changeText,
    // changeFontSize,
    // saveTextBox,
    callChromakeyAction,
    withTelestrationState,
} from '../../State';
import { IAction, EditMode } from '../../Types';
import { reducer, initialState } from './reducer';
import { drawTools, editTools } from '../../../../Assets/video';
import { withLocalState } from '../../../../App/LocalState';
import { SaveTelestrationModal } from '../SaveTelestrationModal';
import { Prompt } from '../Prompt';
import KeyframeLogo from '../../../../Assets/Keyframe_Logo_White_Transparent.png';
// import keyFrameLogo from '../../../../Assets/Keyframe_Logo_White_Transparent_Cute.png';
import ChromaKeyIcon from '../../Assets/Chromakey.png';
import SelectShapeIcon from '../../Assets/SelectShape.png';
import PlayerCutOutIcon from '../../Assets/PlayerCutOut.png';
import ArrowIcon from '../../Assets/Arrow.png';
import FreehandArrowIcon from '../../Assets/FreehandArrow.png';
import CircleIcon from '../../Assets/Circle.png';
import ClearIcon from '../../Assets/Clear.png';
import UndoIcon from '../../Assets/Undo.png';
import RecordIcon from '../../Assets/Record.png';
import MaskIcon from '../../Assets/Mask.png';
import PolygonIcon from '../../Assets/Polygon.png';
import LightShaftIcon from '../../Assets/LightShaft.png';
import LinkedCursorIcon from '../../Assets/LinkedCursor.png';
import StraightArrowIcon from '../../Assets/StraightArrow.png';
import TextBoxIcon from '../../Assets/TextBox.png';

import {
    telestrationCircleClicked,
    telestrationClickedUndo,
    telestrationHaloClicked,
    telestrationLinkClicked,
    telestrationMaskClicked,
    telestrationPolygonClicked,
    telestrationUndoMask,
    telestrationSaveMask,
    telestrationRecordingStarted,
    telestrationRecordingFinished,
    telestrationStraightArrowClicked,
    telestrationSegmentArrowClicked,
    telestrationClearClicked,
} from 'src/App/UserEvents';
import { sendUserEvent } from 'src/App/UserEvents/UserEventManager';
import { styles } from './TelestrationControlsStyles';
import { StopRecording } from '../StopRecording';
import { DefaultDialog } from '../DefaultDialog';

console.log(SelectShapeIcon);

const iconsByMode = {
    chromakey: MaskIcon,
    selectshape: SelectShapeIcon,
    playercutout: PlayerCutOutIcon,
    lightshaft: LightShaftIcon,
    polygon_t: PolygonIcon,
    textbox: TextBoxIcon,
    arrow: ArrowIcon,
    straightarrow: StraightArrowIcon,
    freearrow: FreehandArrowIcon,
    circle: CircleIcon,
    linkedcursor: LinkedCursorIcon,
    default: ClearIcon,
    undo: UndoIcon,
    record: RecordIcon,
};

const actionButtons = [
    { name: 'undo', icon: <Undo /> },
    { name: 'clear', icon: <Clear /> },
    { name: 'save', icon: <Save /> },
];

const getIcons = (classes: any) => {
    const tools = [...drawTools, ...editTools];
    return tools.map((tool) => ({
        ...tool,
        icon: (
            <img
                className={classes.iconTool}
                src={iconsByMode[tool.mode]}
                alt={tool.mode}
            />
        ),
    }));
};

const hintMessages = {
    micro: 'Need microphone permissions for recording your voice',
};

// const defaulTextBoxState = {
//     text: '',
//     fontSize: 18,
//     textColor: false,
//     backgroundColor: false,
// };

let chromakeyUsed = false;

const telestrationControls = ({
    videoID,
    classes,
    telestrationStateMgr,
    localStateMgr,
}: IProps) => {
    const icons = getIcons(classes);
    const { state, dispatchAction } = telestrationStateMgr;

    const [uploadState, dispatchUploadStateAction] = useReducer(
        reducer,
        initialState
    );

    // const [textBoxState, setTextBoxState] = useState(defaulTextBoxState);
    const [hints, setHints]: any = useState({});
    const [defaultModelOpenState, setDefaultModelOpenState]: any = useState(
        false
    );

    const toActionButton = (action: IActionButton, index: number) => {
        const onClick = () => {
            if (action.name === 'undo') {
                sendUserEvent(
                    telestrationUndoMask,
                    window.location.href,
                    videoID
                );
            }
            if (action.name === 'save') {
                sendUserEvent(
                    telestrationSaveMask,
                    window.location.href,
                    videoID
                );
            }

            const actionToDispatch = callChromakeyAction(action.name);
            dispatchAction(actionToDispatch);
        };

        const textEl = <Typography>{action.name}</Typography>;

        return (
            <ListItem
                key={index}
                onClick={onClick}
                className={classes.actionButton}
            >
                <ListItemIcon>{action.icon}</ListItemIcon>
                <ListItemText disableTypography primary={textEl} />
            </ListItem>
        );
    };

    const openUploadModal = () =>
        dispatchUploadStateAction({
            type: 'TOGGLE_SAVE_TELESTRATION_MODAL',
            payload: true,
        });

    const closeUploadModal = () =>
        dispatchUploadStateAction({
            type: 'TOGGLE_SAVE_TELESTRATION_MODAL',
            payload: false,
        });

    const onSaveTelestration = (id: string, title: string) =>
        localStateMgr.dispatch({
            type: 'ON_UPLOAD_START',
            video: {
                id,
                title,
                progress: 0,
            },
        });

    const onUploadProgress = (id: string, percentage: number) =>
        localStateMgr.dispatch({
            type: 'ON_UPLOAD_PROGRESS',
            videoID: id,
            percentage,
        });

    const onStartConversion = (id: string) =>
        localStateMgr.dispatch({
            type: 'ON_START_CONVERSION',
            videoID: id,
        });

    const onStartDownload = (id: string) =>
        localStateMgr.dispatch({
            type: 'ON_START_DOWNLOADING',
            videoID: id,
        });

    const onUploadSuccess = (id: string) =>
        localStateMgr.dispatch({
            type: 'ON_UPLOAD_SUCCESS',
            videoID: id,
        });

    const onStopRecording = useCallback(() => {
        changeMode('stop_recording', false)();
        openUploadModal();
    }, []);

    const toIconButton = (x: IIconButton) => {
        const onClick = () => {
            if (x.mode) {
                if (
                    x.mode === state.editMode &&
                    x.mode !== 'default' &&
                    x.mode !== 'record'
                ) {
                    changeMode('save_effect', true)();
                } else {
                    if (
                        x.mode === 'record' &&
                        state.recording.recordingActive
                    ) {
                        openUploadModal();
                    } else if (x.mode === 'default') {
                        setDefaultModelOpenState(true);
                    } else {
                        changeMode(x.mode, true)();
                    }
                }
            }
        };

        const className =
            x.mode !== 'default' && x.mode === state.editMode
                ? classes.iconButtonActive
                : classes.iconButton;
        return (
            <Tooltip key={x.label} title={x.label} className={classes.tooltip}>
                <IconButton
                    aria-label={x.label}
                    onClick={onClick}
                    className={className}
                >
                    {x.icon}
                </IconButton>
            </Tooltip>
        );
    };

    const doNotShowHint = (flag: boolean, h: string) => {
        flag
            ? localStorage.setItem(`doNotShow_${h}`, `${flag}`)
            : localStorage.removeItem(`doNotShow_${h}`);
    };

    const hintSnackbars = Object.keys(hints)
        .filter((h) => hints[h])
        .map((h, i) => {
            return hints[h] &&
                !localStorage.getItem(`doNotShow_${h}`) &&
                hintMessages[h] ? (
                <Snackbar
                    key={i}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    autoHideDuration={2000}
                    open={true}
                    style={{ top: 80 * i + 10 || 10 }}
                >
                    <Alert
                        variant='filled'
                        severity='info'
                        style={{ background: 'rgb(236, 77, 69)' }}
                        onClose={() =>
                            setHints((prev: any) => ({
                                ...prev,
                                [h]: false,
                            }))
                        }
                        icon={
                            h === 'record' ? (
                                <img
                                    src={ChromaKeyIcon}
                                    onClick={() =>
                                        changeMode('chromakey', false)()
                                    }
                                    style={{
                                        width: '22px',
                                        height: '22px',
                                        cursor: 'pointer',
                                    }}
                                    alt='chromakey'
                                />
                            ) : undefined
                        }
                    >
                        <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            {hintMessages[h]}
                            <div
                                style={{
                                    margin: '0px 0px -9px -42px',
                                    fontSize: '13px',
                                }}
                            >
                                <Checkbox
                                    size='small'
                                    onChange={(e) =>
                                        doNotShowHint(e.target.checked, h)
                                    }
                                    style={{ color: '#fff' }}
                                />
                                Do not show me this message again
                            </div>
                        </div>
                    </Alert>
                </Snackbar>
            ) : null;
        });

    const changeMode = (editMode: EditMode, needHint?: boolean) => () => {
        ReactGA.event({ category: 'Telestration Mode', action: editMode });
        const action = setModeAction(
            editMode,
            needHint ? setHints : null
        ) as IAction;
        handleSendUserClickEvents(editMode);
        return dispatchAction(action);
    };

    function handleSendUserClickEvents(editMode: EditMode): void {
        const url = window.location.href;

        switch (editMode) {
            case 'chromakey': {
                return sendUserEvent(telestrationMaskClicked, url, videoID);
            }
            case 'polygon_t': {
                return sendUserEvent(telestrationPolygonClicked, url, videoID);
            }
            case 'lightshaft': {
                return sendUserEvent(telestrationHaloClicked, url, videoID);
            }
            case 'straightarrow': {
                return sendUserEvent(
                    telestrationStraightArrowClicked,
                    url,
                    videoID
                );
            }
            case 'arrow': {
                return sendUserEvent(
                    telestrationSegmentArrowClicked,
                    url,
                    videoID
                );
            }
            case 'circle': {
                return sendUserEvent(telestrationCircleClicked, url, videoID);
            }
            case 'linkedcursor': {
                return sendUserEvent(telestrationLinkClicked, url, videoID);
            }
            case 'default': {
                return sendUserEvent(telestrationClearClicked, url, videoID);
            }
            case 'undo': {
                return sendUserEvent(telestrationClickedUndo, url, videoID);
            }
            case 'record': {
                if (state.recording.recordingActive) {
                    return sendUserEvent(
                        telestrationRecordingFinished,
                        url,
                        videoID
                    );
                } else {
                    return sendUserEvent(
                        telestrationRecordingStarted,
                        url,
                        videoID
                    );
                }
            }
            default: {
                return;
            }
        }
    }

    useEffect(() => {
        if (!chromakeyUsed && state.recording.recordingActive) {
            setHints((prev: any) => ({
                ...prev,
                record: true,
            }));
        }
    }, [state.recording.recordingActive]);

    useEffect(() => {
        chromakeyUsed = false;
    }, []);

    const keepOnPage = (event: any) => {
        const message = 'Warning! Video in progress. Leave anyway?';
        if (Object.keys(uploadState.uploadQueue).length) {
            event.returnValue = message;
            return message;
        }
        return true;
    };

    useEffect(() => {
        window.addEventListener('beforeunload', keepOnPage);

        return () => window.removeEventListener('beforeunload', keepOnPage);
    }, [uploadState.uploadQueue]);

    const [controlsOpened, setControlsOpened] = useState(false);
    const buttonsWidth = icons.length * 70;
    const top =
        state.recording.videoRef.current &&
        state.recording.videoRef.current.clientHeight - 90;

    return (
        <>
            <div
                className={classes.controls}
                style={{
                    marginLeft: controlsOpened ? 0 : -buttonsWidth,
                    top: `${top}px`,
                }}
            >
                <div
                    className={classes.buttons}
                    style={{ width: buttonsWidth }}
                >
                    {icons.map(toIconButton)}
                </div>
                <div
                    className={classes.toggleControls}
                    onClick={(e) => setControlsOpened((prev) => !prev)}
                >
                    {controlsOpened ? (
                        <Clear className={classes.toggleControlsIcon} />
                    ) : (
                        <Add className={classes.toggleControlsIcon} />
                    )}
                </div>
            </div>
            <DefaultDialog
                openState={defaultModelOpenState}
                confirm={() => {
                    changeMode('default', true)();
                    setDefaultModelOpenState(false);
                }}
                closeModal={() => setDefaultModelOpenState(false)}
            />

            <div>
                <StopRecording
                    open={state.recording.recordingActive}
                    onStopRecording={onStopRecording}
                />
                {hintSnackbars}
                <SaveTelestrationModal
                    telestratedvideoID={videoID}
                    open={uploadState.saveTelestrationModal.open}
                    closeModal={closeUploadModal}
                    onSaveTelestration={onSaveTelestration}
                    onProgress={onUploadProgress}
                    onStartConversion={onStartConversion}
                    onStartDownload={onStartDownload}
                    onSuccess={onUploadSuccess}
                />
                <Drawer
                    className={classes.drawer}
                    variant='persistent'
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    style={{
                        userSelect: 'none',
                    }}
                >
                    <div className={classes.toolbar}>
                        <div className={classes.toolbarTitle}>
                            <img
                                src={KeyframeLogo}
                                style={{ maxHeight: '35px' }}
                            />
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <List>
                            {actionButtons.map((button, index) =>
                                toActionButton(button, index)
                            )}
                        </List>
                    </div>
                </Drawer>
                {/* <Drawer
                    className={classes.drawer}
                    variant='persistent'
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.toolbar}>
                        <div className={classes.toolbarTitle}>
                            <img
                                src={keyFrameLogo}
                                style={{ maxHeight: '35px' }}
                            />
                        </div>
                    </div>
                    <Divider />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            padding: '0px 15px',
                        }}
                    >
                        <TextField
                            label='Text'
                            onFocus={(e) => {
                                //  tslint:disable-next-line
                                window['STOP_KEY_LISTENERS'] = true;
                            }}
                            onBlur={(e) => {
                                //  tslint:disable-next-line
                                window['STOP_KEY_LISTENERS'] = false;
                            }}
                            onChange={(e) => {
                                dispatchAction(changeText(e.target.value));
                                setTextBoxState({
                                    ...textBoxState,
                                    text: e.target.value,
                                });
                            }}
                            value={textBoxState.text}
                        />
                        <TextField
                            label='Font Size'
                            type='number'
                            style={{ margin: '5px 0px' }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={textBoxState.fontSize}
                            onChange={(e) => {
                                dispatchAction(changeFontSize(+e.target.value));
                                setTextBoxState({
                                    ...textBoxState,
                                    fontSize: +e.target.value,
                                });
                            }}
                        />
                    </div>
                    <List>
                        <ListItem
                            onClick={() =>
                                setTextBoxState({
                                    ...textBoxState,
                                    backgroundColor: false,
                                    textColor: true,
                                })
                            }
                            className={classes.actionButton}
                        >
                            <ListItemIcon style={{ minWidth: '40px' }}>
                                <FormatColorText />
                            </ListItemIcon>
                            <ListItemText disableTypography>
                                Change Text Color
                            </ListItemText>
                        </ListItem>
                        <ListItem
                            onClick={() =>
                                setTextBoxState({
                                    ...textBoxState,
                                    textColor: false,
                                    backgroundColor: true,
                                })
                            }
                            className={classes.actionButton}
                        >
                            <ListItemIcon style={{ minWidth: '40px' }}>
                                <Texture />
                            </ListItemIcon>
                            <ListItemText disableTypography>
                                Change Background Color
                            </ListItemText>
                        </ListItem>
                        <ListItem
                            onClick={() => {
                                dispatchAction(saveTextBox());
                                setTextBoxState(defaulTextBoxState);
                            }}
                            className={classes.actionButton}
                        >
                            <ListItemIcon style={{ minWidth: '40px' }}>
                                <Save />
                            </ListItemIcon>
                            <ListItemText disableTypography>Save</ListItemText>
                        </ListItem>
                    </List>
                </Drawer> */}
                <Prompt editMode={state.editMode} />
            </div>
        </>
    );
};

export const TelestrationControls = compose(
    withTelestrationState,
    withLocalState,
    withStyles(styles)
)(telestrationControls);
