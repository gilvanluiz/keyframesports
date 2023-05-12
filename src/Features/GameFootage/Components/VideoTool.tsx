import * as React from 'react';
import { useState } from 'react';
import {
    Divider,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
    Collapse,
    TextField,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';
import {
    Add as AddIcon,
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
    FormatColorText,
    Save,
    Texture,
} from '@material-ui/icons';
import { StyledSlider } from './Slider';
import { ColorPicker } from '../../../Features/Telestrations/Components/ColorPicker';
import {
    ITelestrationSizeChangeAction,
    ITelestrationPerspectiveChangeAction,
    changeFontSize,
    changeTelestrationColor,
    changeText,
    // changeTextBackgroundColor,
    // changeTextColor,
    saveTextBox,
    withTelestrationState,
    shapeRowSelectAction,
} from '../../Telestrations/State';
import { ITelestrationStateMgr } from 'src/Features/Telestrations/Types';
import { compose } from 'fp-ts/lib/function';
import { drawTools } from 'src/Assets/video';
import { CirclePicker } from 'react-color';

const styles = (theme: ITheme) => ({
    toolName: {
        margin: '5px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

interface IProp extends IWithStyles {
    telestrationStateMgr: ITelestrationStateMgr;
}

interface ITool {
    name: string;
    label: string;
    mode: string;
}

const defaulTextBoxState = {
    text: '',
    fontSize: 18,
    textColor: false,
    backgroundColor: false,
};

const initialColors = [
    '#50e3c2',
    '#d0021b',
    '#9013fe',
    '#f8e71c',
    '#7ed321',
    '#4a90e2',
    '#000000',
];

const videoTool = ({ classes, telestrationStateMgr }: IProp) => {
    const [textBoxState, setTextBoxState] = useState(defaulTextBoxState);
    const [opened, setOpened] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [pickerColor, setPickerColor] = useState('#cc0000');
    // const [toolSize, setToolSize] = useState(40);
    // const [toolPerspective, setToolPerspective] = useState(0.36);
    const [colorList, setColorList] = useState(initialColors);

    const { state, dispatchAction } = telestrationStateMgr;

    const { telestrationManager } = state;

    const currentTool = drawTools.find(
        (tool: ITool) => tool.mode === state.editMode
    );
    const colorPickerOpened = Boolean(anchorEl);

    const openColorPicker = (event: React.MouseEvent<HTMLElement>) => {
        console.log(event.currentTarget);
        setAnchorEl(event.currentTarget);
    };

    const closeColorPicker = () => {
        setAnchorEl(null);
    };

    const onColorPick = (color: any, e: any, index: number) => {
        // const { r, g, b, a } = rgb;
        // let action = null;
        // if (state.editMode === 'textbox') {
        //     action = textBoxState.textColor
        //         ? changeTextColor
        //         : changeTextBackgroundColor;
        // } else {
        //     action = changeTelestrationColor;
        // }
        // dispatchAction(action(`rgba(${r}, ${g}, ${b}, ${a})`));

        dispatchAction(changeTelestrationColor(color.hex, index));
    };

    const handleChangePickerList = (pickedColor: any) => {
        const { r, g, b, a } = pickedColor.rgb;
        setPickerColor(`rgba(${r}, ${g}, ${b}, ${a})`);
        const updatedColorList = [...colorList];
        let isRepeatedColor = false;
        updatedColorList.map((color) => {
            if (color === pickedColor.hex) {
                isRepeatedColor = true;
            }
        });
        if (!isRepeatedColor) {
            updatedColorList.pop();
            updatedColorList.unshift(pickedColor.hex);
            setColorList(updatedColorList);
        }
    };

    const handleChangePicker = ({ rgb }: any, e: any) => {
        const { r, g, b, a } = rgb;
        setPickerColor(`rgba(${r}, ${g}, ${b}, ${a})`);
    };
    const onSizeSliderChange = (e: any, newValue: number, index: number) => {
        dispatchAction(ITelestrationSizeChangeAction(newValue, index));
    };
    const onPerspectiveChange = (e: any, newValue: number, index: number) => {
        dispatchAction(ITelestrationPerspectiveChangeAction(newValue, index));
    };

    const selectOpen = (e: any, index: number) => {
        dispatchAction(shapeRowSelectAction(index));
    };
    return (
        <>
            {/* <input type='hidden' id='size-slider-input' value={toolSize} />
            <input
                type='hidden'
                id='perspective-slider-input'
                value={toolPerspective}
            /> */}
            {telestrationManager.addedShapes.length > 0 ? (
                telestrationManager.addedShapes.map(
                    (object: any, index: number) => (
                        <div key={index}>
                            <div
                                className={classes.toolName}
                                onClick={(ev: any) => selectOpen(ev, index)}
                            >
                                {object.type}
                                {opened ? (
                                    <ArrowDropUpIcon />
                                ) : (
                                    <ArrowDropDownIcon />
                                )}
                            </div>
                            <Collapse in={object.isSelected} timeout={300}>
                                <div style={{ margin: '10px 0px' }}>
                                    {object.type !== 'lightshaft' && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                marginBottom: '10px',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <CirclePicker
                                                colors={colorList}
                                                color={object.object.color}
                                                onChange={handleChangePicker}
                                                onChangeComplete={(
                                                    color: any,
                                                    ev: any
                                                ) =>
                                                    onColorPick(
                                                        color,
                                                        ev,
                                                        index
                                                    )
                                                }
                                                circleSize={16.5}
                                                circleSpacing={7}
                                            />
                                            <div
                                                onClick={openColorPicker as any}
                                                style={{
                                                    display: 'flex',
                                                    cursor: 'pointer',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '18px',
                                                    height: '18px',
                                                    borderRadius: '50%',
                                                    background: 'none',
                                                    border: '1px solid #fff',
                                                }}
                                            >
                                                <AddIcon
                                                    style={{
                                                        display: 'block',
                                                        padding: '4px',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {object.type !== 'polygon' && (
                                        <>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                Size
                                                <StyledSlider
                                                    style={{ width: '40%' }}
                                                    value={object.object.getSize()}
                                                    onChange={(
                                                        ev: any,
                                                        value: number
                                                    ) =>
                                                        onSizeSliderChange(
                                                            ev,
                                                            value,
                                                            index
                                                        )
                                                    }
                                                    max={200}
                                                    min={10}
                                                    step={4}
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                {' '}
                                                Perspective
                                                <StyledSlider
                                                    style={{ width: '40%' }}
                                                    max={1}
                                                    min={0.2}
                                                    step={0.0005}
                                                    value={object.object.zAngle}
                                                    aria-labelledby='slider'
                                                    onChange={(
                                                        ev: any,
                                                        value: number
                                                    ) =>
                                                        onPerspectiveChange(
                                                            ev,
                                                            value,
                                                            index
                                                        )
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Collapse>
                            <Divider />
                            {false && (
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
                                            // window['STOP_KEY_LISTENERS'] = true;
                                        }}
                                        onBlur={(e) => {
                                            //  tslint:disable-next-line
                                            // window[
                                            //     'STOP_KEY_LISTENERS'
                                            // ] = false;
                                        }}
                                        onChange={(e) => {
                                            dispatchAction(
                                                changeText(e.target.value)
                                            );
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
                                            dispatchAction(
                                                changeFontSize(+e.target.value)
                                            );
                                            setTextBoxState({
                                                ...textBoxState,
                                                fontSize: +e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                            )}
                            {false && (
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
                                        <ListItemIcon
                                            style={{ minWidth: '40px' }}
                                        >
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
                                        <ListItemIcon
                                            style={{ minWidth: '40px' }}
                                        >
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
                                        <ListItemIcon
                                            style={{ minWidth: '40px' }}
                                        >
                                            <Save />
                                        </ListItemIcon>
                                        <ListItemText disableTypography>
                                            Save
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            )}

                            <ColorPicker
                                handleChange={handleChangePickerList}
                                color={pickerColor}
                                open={colorPickerOpened}
                                onPick={({ color }: any) => {
                                    console.log(color);
                                }}
                                onClose={closeColorPicker}
                                anchorEl={anchorEl}
                            />
                        </div>
                    )
                )
            ) : (
                <></>
            )}
            {currentTool ? (
                <>
                    <div
                        className={classes.toolName}
                        onClick={() => setOpened((prev) => !prev)}
                    >
                        {currentTool.name}
                        {opened ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </div>
                    <Collapse in={opened} timeout={300}>
                        <div style={{ margin: '10px 0px' }}>
                            {currentTool.mode !== 'lightshaft' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        marginBottom: '10px',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <CirclePicker
                                        colors={colorList}
                                        color={pickerColor}
                                        onChange={handleChangePicker}
                                        onChangeComplete={(
                                            color: any,
                                            ev: any
                                        ) => onColorPick(color, ev, -1)}
                                        circleSize={16.5}
                                        circleSpacing={7}
                                    />
                                    <div
                                        onClick={openColorPicker as any}
                                        style={{
                                            display: 'flex',
                                            cursor: 'pointer',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            background: 'none',
                                            border: '1px solid #fff',
                                        }}
                                    >
                                        <AddIcon
                                            style={{
                                                display: 'block',
                                                padding: '4px',
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            {currentTool.mode !== 'polygon_t' && (
                                <>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        Size
                                        <StyledSlider
                                            style={{ width: '40%' }}
                                            value={telestrationManager.getSize()}
                                            onChange={(
                                                ev: any,
                                                value: number
                                            ) =>
                                                onSizeSliderChange(
                                                    ev,
                                                    value,
                                                    -1
                                                )
                                            }
                                            max={200}
                                            min={10}
                                            step={4}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        {' '}
                                        Perspective
                                        <StyledSlider
                                            style={{ width: '40%' }}
                                            max={1}
                                            min={0.2}
                                            step={0.0005}
                                            value={telestrationManager.zAngle}
                                            aria-labelledby='slider'
                                            onChange={(
                                                ev: any,
                                                value: number
                                            ) =>
                                                onPerspectiveChange(
                                                    ev,
                                                    value,
                                                    -1
                                                )
                                            }
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </Collapse>

                    <Divider />
                    {false && (
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
                                    dispatchAction(
                                        changeFontSize(+e.target.value)
                                    );
                                    setTextBoxState({
                                        ...textBoxState,
                                        fontSize: +e.target.value,
                                    });
                                }}
                            />
                        </div>
                    )}
                    {false && (
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
                                <ListItemText disableTypography>
                                    Save
                                </ListItemText>
                            </ListItem>
                        </List>
                    )}
                    <ColorPicker
                        handleChange={handleChangePickerList}
                        color={pickerColor}
                        open={colorPickerOpened}
                        onPick={({ color }: any) => {
                            console.log(color);
                        }}
                        onClose={closeColorPicker}
                        anchorEl={anchorEl}
                    />
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export const VideoTool = compose(
    withStyles(styles),
    withTelestrationState
)(videoTool);
