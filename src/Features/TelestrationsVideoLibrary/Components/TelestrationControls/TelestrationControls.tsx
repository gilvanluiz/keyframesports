import * as React from 'react';
import * as ReactGA from 'react-ga';
import {
    Paper,
    List,
    Divider,
    Drawer,
    ListItem,
    ListItemIcon,
    ListItemText,
    Snackbar,
    Checkbox,
    TextField,
    Box,
} from '@material-ui/core';
import RewindLeftIcon from '../../../../Assets/rewind_left.png';
import RewindRightIcon from '../../../../Assets/rewind_right.png';
import {
    Clear,
    Save,
    Undo,
    FormatColorText,
    Texture,
} from '@material-ui/icons';
import { useState, useEffect, useReducer, useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { flow } from 'fp-ts/lib/function';
import { IProps } from './types';
import {
    setModeAction,
    changeText,
    changeFontSize,
    changeTextColor,
    changeTextBackgroundColor,
    saveTextBox,
    withTelestrationState,
    changeTelestrationColor,
} from '../../State';
import { IAction, EditMode } from '../../Types';
import { reducer, initialState } from './reducer';
import {
    chromakeyTools,
    drawTools,
    editTools,
    recordTools,
} from '../../../../Assets/videoVideoLibrary';
import { withLocalState } from '../../../../App/LocalState';
import { SaveTelestrationModal } from '../SaveTelestrationModal';
import { ColorPicker } from '../ColorPicker';
import { StopRecording } from '../StopRecording';
import KeyframeLogoIcon from '../../../../Assets/keyframe_logo.png';
import ChromaKeyIcon from '../../Assets/Chromakey.png';
import PlayerCutOutIcon from '../../Assets/PlayerCutOut.png';
import ArrowIcon from '../../Assets/Arrow.png';
import FreehandArrowIcon from '../../Assets/FreehandArrow.png';
import CircleIcon from '../../Assets/Circle.png';
import ClearIcon from '../../Assets/Clear.png';
import UndoIcon from '../../Assets/Undo.png';
import RedoIcon from '../../Assets/Redo.png';
import RecordIcon from '../../Assets/Record.png';
import MaskIcon from '../../Assets/Mask.png';
import PolygonIcon from '../../Assets/Polygon.png';
import LightShaftIcon from '../../Assets/LightShaft.png';
import LinkedCursorIcon from '../../Assets/LinkedCursor.png';
import StraightArrowIcon from '../../Assets/StraightArrow.png';
import {
    telestrationCircleClicked,
    telestrationClickedUndo,
    telestrationHaloClicked,
    telestrationLinkClicked,
    telestrationMaskClicked,
    telestrationPolygonClicked,
    telestrationRecordingStarted,
    telestrationRecordingFinished,
    telestrationStraightArrowClicked,
    telestrationSegmentArrowClicked,
    telestrationClearClicked,
} from 'src/App/UserEvents';
import { sendUserEvent } from 'src/App/UserEvents/UserEventManager';
import { styles } from './TelestrationControlsStyles';
import { ChromakeyActionButton } from './ChromakeyActionButton';
import { ToolButtonIcon } from './ToolButtonIcon';
import { ChromakeyDialog } from '../ChromakeyDialog';
import {
    initialToolSizes,
    initialToolPerspectives,
    toolsDrawerInitialState,
} from './toolsSettings';
import { ToolAdjustmentDrawer } from './ToolAdjustmentDrawer';

const iconsByMode = {
    chromakey: MaskIcon,
    record: RecordIcon,
    lightshaft: LightShaftIcon,
    polygon_t: PolygonIcon,
    arrow: ArrowIcon,
    straightarrow: StraightArrowIcon,
    freearrow: FreehandArrowIcon,
    circle: CircleIcon,
    linkedcursor: LinkedCursorIcon,
    playercutout: PlayerCutOutIcon,
    default: ClearIcon,
    undo: UndoIcon,
    redo: RedoIcon,
};
const toolTypeArray = ['arrow', 'freearrow', 'playercutout', 'straightarrow'];
const chromakeyActionButtons = [
    { name: 'undo', icon: <Undo /> },
    { name: 'clear', icon: <Clear /> },
    { name: 'save', icon: <Save /> },
];

const getIcons = (classes: any) => {
    const tools = [
        ...chromakeyTools,
        ...recordTools,
        ...drawTools,
        ...editTools,
    ];
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

const defaulTextBoxState = {
    text: '',
    fontSize: 18,
    textColor: false,
    backgroundColor: false,
};

let chromakeyUsed = false;

const telestrationControls = ({
    videoID,
    classes,
    telestrationStateMgr,
    localStateMgr,
}: IProps) => {
    const [textBoxState, setTextBoxState] = useState(defaulTextBoxState);
    const [toolPerspectives, setToolPerspectives] = useState(
        initialToolPerspectives
    );
    const [toolSizes, setToolSizes] = useState(initialToolSizes);
    const [toolsDrawerState, setToolsDrawerState] = useState(
        toolsDrawerInitialState
    );
    const [hints, setHints]: any = useState({});

    const [uploadState, dispatchUploadStateAction] = useReducer(
        reducer,
        initialState
    );

    const icons = getIcons(classes);
    const { state, dispatchAction } = telestrationStateMgr;
    const { editMode } = state;
    const LOCAL_STORAGE_TOOLS_PERSPECTIVES_KEY = 'TOOLS_PERSPECTIVES_KEY';
    const LOCAL_STORAGE_TOOLS_SIZES_KEY = 'TOOLS_SIZES_KEY';

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
        const savedToolsPerspectives = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_TOOLS_PERSPECTIVES_KEY) ||
                '{"empty":true}'
        );
        const savedToolsSizes = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_TOOLS_SIZES_KEY) ||
                '{"empty":true}'
        );

        if (!savedToolsPerspectives.empty) {
            setToolPerspectives(savedToolsPerspectives);
        }
        if (!savedToolsSizes.empty) {
            setToolSizes(savedToolsSizes);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('beforeunload', keepOnPage);
        return () => window.removeEventListener('beforeunload', keepOnPage);
    }, [uploadState.uploadQueue]);

    useEffect(() => {
        if (
            toolsDrawerState[editMode] &&
            !toolsDrawerState[editMode].wasClosed &&
            !toolsDrawerState[editMode].currentlyOpen
        ) {
            setToolsDrawerState((prev: any) => ({
                ...prev,
                [editMode]: {
                    wasClosed: false,
                    currentlyOpen: true,
                },
            }));
        }
    }, [editMode]);

    const onColorPick = ({ rgb }: any) => {
        const { r, g, b, a } = rgb;
        let action = null;
        if (editMode === 'textbox') {
            action = textBoxState.textColor
                ? changeTextColor
                : changeTextBackgroundColor;
        } else {
            action = changeTelestrationColor;
        }

        dispatchAction(action(`rgba(${r}, ${g}, ${b}, ${a})`));
    };

    const needColorPicker = () => {
        switch (editMode) {
            case 'polygon_t':
            case 'arrow':
            case 'straightarrow':
            case 'freearrow':
            case 'circle':
            case 'linkedcursor':
            case 'playercutout':
                return true;
            case 'textbox':
                return textBoxState.textColor || textBoxState.backgroundColor;
            default:
                return false;
        }
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
                                        changeMode('chromakey', true)()
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

    const changeMode = (newEditMode: EditMode, needHint?: boolean) => () => {
        ReactGA.event({ category: 'Telestration Mode', action: newEditMode });
        const action = setModeAction(
            newEditMode,
            needHint ? setHints : null
        ) as IAction;
        handleSendUserClickEvents(newEditMode);
        return dispatchAction(action);
    };

    function handleSendUserClickEvents(newEditMode: EditMode): void {
        const url = window.location.href;

        switch (newEditMode) {
            case 'chromakey': {
                // mask tool clicked
                return sendUserEvent(telestrationMaskClicked, url, videoID);
            }
            case 'polygon_t': {
                return sendUserEvent(telestrationPolygonClicked, url, videoID);
            }
            case 'lightshaft': {
                // halo tool
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

    const keepOnPage = (event: any) => {
        const message = 'Warning! Video in progress. Leave anyway?';
        if (Object.keys(uploadState.uploadQueue).length) {
            event.returnValue = message;
            return message;
        }
        return true;
    };

    return (
        <>
            <Paper className={classes.root}>
                <div
                    className={`${classes.cardBody} ${classes.cardBodyPadding}`}
                >
                    {icons.map((icon, index) => (
                        <ToolButtonIcon
                            key={index}
                            iconParameters={icon}
                            openUploadModal={openUploadModal}
                            changeMode={changeMode}
                            setHints={setHints}
                        />
                    ))}
                </div>
            </Paper>
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
                    open={
                        editMode === 'chromakey' ||
                        editMode === 'chromakey_first_mount'
                    }
                    variant='persistent'
                    classes={{
                        paper: `${classes.drawerPaper} ${
                            localStateMgr.state.leftSideMenuOpen || 'closed'
                        }`,
                    }}
                    style={{
                        userSelect: 'none',
                    }}
                >
                    <div className={classes.toolbar}>
                        <div className={classes.toolbarTitle}>
                            <img
                                src={KeyframeLogoIcon}
                                className={classes.keyframeLogo}
                            />
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <List>
                            {chromakeyActionButtons.map((button, index) => (
                                <ChromakeyActionButton
                                    key={index}
                                    action={button}
                                    index={index}
                                    videoID={videoID}
                                />
                            ))}
                        </List>
                    </div>
                    <Box className={classes.hideMenu}>
                        <img
                            className='icon'
                            onClick={() =>
                                localStateMgr.dispatch({
                                    type: 'ON_TOGGLE_LEFT_SIDE_MENU',
                                })
                            }
                            src={
                                localStateMgr.state.leftSideMenuOpen
                                    ? RewindLeftIcon
                                    : RewindRightIcon
                            }
                            alt='hide menu'
                        />
                    </Box>
                </Drawer>
                <Drawer
                    className={classes.drawer}
                    open={editMode === 'textbox'}
                    variant='persistent'
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.toolbar}>
                        <div className={classes.toolbarTitle}>
                            <img
                                src={KeyframeLogoIcon}
                                className={classes.keyframeLogo}
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
                                /* tslint:disable-next-line */
                                window['STOP_KEY_LISTENERS'] = true;
                            }}
                            onBlur={(e) => {
                                /* tslint:disable-next-line */
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
                </Drawer>
                <ToolAdjustmentDrawer
                    toolsDrawerState={toolsDrawerState}
                    toolSizes={toolSizes}
                    setToolSizes={setToolSizes}
                    toolPerspectives={toolPerspectives}
                    setToolPerspectives={setToolPerspectives}
                    setToolsDrawerState={setToolsDrawerState}
                    onColorPick={onColorPick}
                />
                {!toolTypeArray.includes(editMode) && (
                    <ColorPicker
                        open={needColorPicker()}
                        onPick={onColorPick}
                    />
                )}
                {!localStateMgr.state.isTouchDevice && (
                    <ChromakeyDialog editMode={editMode} />
                )}
            </div>
        </>
    );
};

export const TelestrationControls = flow(
    withTelestrationState,
    withLocalState,
    withStyles(styles)
)(telestrationControls);
