import * as React from 'react';
import { useEffect, useState } from 'react';
import { flow } from 'fp-ts/lib/function';
import {
    Box,
    Divider,
    Drawer,
    Slider,
    Typography,
    WithStyles as IWithStyles,
    withStyles,
    IconButton,
} from '@material-ui/core';
import {
    IToolsDrawerState,
    IToolSize,
    IToolPerspective,
} from './toolsSettings';
import KeyframeLogoIcon from '../../../../Assets/keyframe_logo.png';
import { styles } from './TelestrationControlsStyles';
import { EditMode } from './../../Types';
import {
    handleConnectToolPerspectiveToTelestrationManager,
    handleConnectToolSizeToTelestrationManager,
} from './helpers';
import { ITelestrationStateMgr } from 'src/Features/TelestrationsVideoLibrary/Types';
import {
    toggleArrowType,
    withTelestrationState,
} from 'src/Features/TelestrationsVideoLibrary/State';
import { ColorPicker } from '../ColorPicker';
import RewindLeftIcon from '../../../../Assets/rewind_left.png';
interface IProps {
    toolsDrawerState: IToolsDrawerState;
    toolSizes: IToolSize;
    telestrationStateMgr: ITelestrationStateMgr;
    setToolSizes: React.Dispatch<React.SetStateAction<IToolSize>>;
    toolPerspectives: IToolPerspective;
    setToolPerspectives: React.Dispatch<React.SetStateAction<IToolPerspective>>;
    setToolsDrawerState: React.Dispatch<
        React.SetStateAction<IToolsDrawerState>
    >;
    onColorPick: ({ rgb }: any) => void;
}

const toolTypeArray = ['arrow', 'freearrow', 'straightarrow', 'playercutout'];

const initialToolTypeState = {
    straight: false,
    dashed: false,
};

const toolAdjustmentDrawer = ({
    classes,
    telestrationStateMgr,
    toolsDrawerState,
    toolSizes,
    setToolSizes,
    toolPerspectives,
    setToolPerspectives,
    setToolsDrawerState,
    onColorPick,
}: IProps & IWithStyles) => {
    const [isToolTypeShow, setIsToolTypeShow] = useState(false);
    const [toolTypeActive, setToolTypeActive] = useState(initialToolTypeState);
    const {
        state: { editMode, telestrationManager },
        dispatchAction,
    } = telestrationStateMgr;
    const LOCAL_STORAGE_TOOLS_PERSPECTIVES_KEY = 'TOOLS_PERSPECTIVES_KEY';
    const LOCAL_STORAGE_TOOLS_SIZES_KEY = 'TOOLS_SIZES_KEY';

    useEffect(() => {
        document.addEventListener(
            'mousewheel',
            handleAddToolsAdjustmentListeners,
            {
                passive: false,
            }
        );

        return () =>
            document.removeEventListener(
                'mousewheel',
                handleAddToolsAdjustmentListeners
            );
    }, []);

    useEffect(() => {
        if (toolTypeArray.includes(editMode)) {
            const previousTMToolType: number = telestrationManager.creationObject
                ? editMode === 'playercutout'
                    ? telestrationManager.creationObject.arrow.type
                    : telestrationManager.creationObject.type
                : 0;
            const previousToolType: 'straight' | 'dashed' = previousTMToolType
                ? 'dashed'
                : 'straight';
            setToolTypeActive({
                ...initialToolTypeState,
                [previousToolType]: true,
            });
            setIsToolTypeShow(true);
        } else {
            setIsToolTypeShow(false);
        }
    }, [editMode]);

    useEffect(() => {
        document.addEventListener('contextmenu', handleCatchContextMenu);
        return () =>
            document.removeEventListener('contextmenu', handleCatchContextMenu);
    }, []);

    function handleCatchContextMenu() {
        if (telestrationManager.creationObject) {
            if (telestrationManager.creationObject.hasOwnProperty('type')) {
                if (telestrationManager.creationObject.type === 0) {
                    setToolTypeActive({
                        ...initialToolTypeState,
                        straight: true,
                    });
                } else {
                    setToolTypeActive({
                        ...initialToolTypeState,
                        dashed: true,
                    });
                }
            }
            if (telestrationManager.creationObject.hasOwnProperty('arrow')) {
                if (telestrationManager.creationObject.arrow.type === 0) {
                    setToolTypeActive({
                        ...initialToolTypeState,
                        straight: true,
                    });
                } else {
                    setToolTypeActive({
                        ...initialToolTypeState,
                        dashed: true,
                    });
                }
            }
        }
    }

    function handleAddToolsAdjustmentListeners(event: WheelEvent) {
        event.preventDefault();
        handleConnectToolSizeToTelestrationManager(
            telestrationManager,
            handleChangeToolSize
        );
        handleConnectToolPerspectiveToTelestrationManager(
            telestrationManager,
            handleChangeToolPerspective
        );
    }

    function handleChangeToolSize(newValue: number, currentEditMode: EditMode) {
        const prevValue = toolSizes[currentEditMode].currentValue;
        // for debounce effect
        if (Math.abs(prevValue - newValue) >= 2) {
            const currentToolSetting = {
                ...toolSizes[currentEditMode],
                currentValue: newValue,
            };
            setToolSizes((prev) => {
                const newState = {
                    ...prev,
                    [currentEditMode]: currentToolSetting,
                };
                localStorage.setItem(
                    LOCAL_STORAGE_TOOLS_SIZES_KEY,
                    JSON.stringify(newState)
                );
                return newState;
            });
        }
    }

    function handleChangeToolPerspective(
        newValue: number,
        currentEditMode: string
    ) {
        const prevValue = toolPerspectives[currentEditMode].currentValue;
        // for debounce effect
        if (Math.abs(prevValue - newValue) > 0.01) {
            const currentToolSetting = {
                ...toolPerspectives[currentEditMode],
                currentValue: newValue,
            };
            setToolPerspectives((prev) => {
                const newState = {
                    ...prev,
                    [currentEditMode]: currentToolSetting,
                };
                localStorage.setItem(
                    LOCAL_STORAGE_TOOLS_PERSPECTIVES_KEY,
                    JSON.stringify(newState)
                );
                return newState;
            });
        }
    }

    function handleSwitchArrow(action: 'straight' | 'dashed') {
        const actionTM = action === 'straight' ? 0 : 1;
        if (actionTM !== telestrationManager.creationObject.type) {
            dispatchAction(toggleArrowType(editMode));
        }
        setToolTypeActive({ ...initialToolTypeState, [action]: true });
    }

    return (
        <Drawer
            className={classes.drawer}
            open={
                toolsDrawerState[editMode] &&
                toolsDrawerState[editMode].currentlyOpen
            }
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
                        src={KeyframeLogoIcon}
                        className={classes.keyframeLogo}
                    />
                </div>
            </div>
            <Divider />
            <div style={{ margin: '19px' }}>
                <Typography id='continuous-slider'>Tool Size</Typography>
                <Slider
                    max={toolSizes[editMode].maxValue || 0}
                    min={toolSizes[editMode].minValue || 0}
                    step={2}
                    value={toolSizes[editMode].currentValue || 0}
                    aria-labelledby='continuous-slider'
                    onChange={(e: React.ChangeEvent<{}>, newValue: number) =>
                        handleChangeToolSize(newValue, editMode)
                    }
                    classes={{
                        root: classes.slider,
                        thumb: classes.thumb,
                    }}
                />
                {/* input for access current tool size from TelestrationManager AccessSliderInput function */}
                <input
                    value={toolSizes[editMode].currentValue || 0}
                    type='hidden'
                    id='size-slider'
                />

                <Typography id='slider'>Tool Perspective</Typography>
                <Slider
                    max={toolPerspectives[editMode].maxValue || 0}
                    min={toolPerspectives[editMode].minValue || 0}
                    step={0.009}
                    value={toolPerspectives[editMode].currentValue || 0}
                    aria-labelledby='slider'
                    onChange={(e: React.ChangeEvent<{}>, newValue: number) =>
                        handleChangeToolPerspective(newValue, editMode)
                    }
                    classes={{
                        root: classes.slider,
                        thumb: classes.thumb,
                    }}
                />
                {/* input for access current tool size from TelestrationManager AccessSliderInput function */}
                <input
                    value={toolPerspectives[editMode].currentValue || 0}
                    type='hidden'
                    id='perspective-slider'
                />
                {isToolTypeShow && (
                    <>
                        <Typography>Tool Type</Typography>
                        <Box className={classes.toolTypeContainer}>
                            <IconButton
                                aria-label={'straight'}
                                className={`${classes.iconButtonDrawer}
                                    ${
                                        toolTypeActive.straight &&
                                        classes.iconButtonDrawerActive
                                    }`}
                                onClick={() => handleSwitchArrow('straight')}
                            >
                                <Box className={classes.toolTypeLine} />
                            </IconButton>
                            <IconButton
                                aria-label={'dashed'}
                                className={`${classes.iconButtonDrawer}
                                ${
                                    toolTypeActive.dashed &&
                                    classes.iconButtonDrawerActive
                                }`}
                                onClick={() => handleSwitchArrow('dashed')}
                            >
                                <Box className={classes.toolTypeDash} />
                                <Box className={classes.toolTypeDash} />
                                <Box className={classes.toolTypeDash} />
                                <Box className={classes.toolTypeDash} />
                            </IconButton>
                        </Box>
                    </>
                )}
                <ColorPicker onPick={onColorPick} open={isToolTypeShow} />
                <Box className={classes.hideToolsAdjustmentDrawer}>
                    <img
                        className='icon'
                        onClick={() => {
                            setToolsDrawerState((prev: any) => ({
                                ...prev,
                                [editMode]: {
                                    wasClosed: true,
                                    currentlyOpen: false,
                                },
                            }));
                        }}
                        src={RewindLeftIcon}
                        alt='hide tool adjustment drawer'
                    />
                </Box>
            </div>
        </Drawer>
    );
};

export const ToolAdjustmentDrawer = flow(
    withTelestrationState,
    withStyles(styles)
)(toolAdjustmentDrawer);
