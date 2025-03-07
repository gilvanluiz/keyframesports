import * as React from 'react';
import { useState } from 'react';
import {
    Divider,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
    Collapse,
    TextField,
    Typography,
    Box,
} from '@material-ui/core';
import {
    Add as AddIcon,
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
} from '@material-ui/icons';
import { StyledSlider } from './Slider';
import { StyledSwitch } from './Switch';
import { ColorPicker } from '../../../Features/Telestrations/Components/ColorPicker';
import {
    ITelestrationSizeChangeAction,
    ITelestrationPerspectiveChangeAction,
    // changeFontSize,
    changeTelestrationColor,
    changeText,
    // changeTextBackgroundColor,
    // changeTextColor,
    // saveTextBox,
    withTelestrationState,
    shapeRowSelectAction,
    switchTextBackgroundEnable,
    switchTextBoxMask,
    // changeTextColor,
} from '../../Telestrations/State';
import { ITelestrationStateMgr } from 'src/Features/Telestrations/Types';
import { compose } from 'fp-ts/lib/function';
import { drawTools } from 'src/Assets/video';
import { CirclePicker } from 'react-color';

const CustomTextField = withStyles({
    root: {
        '& .MuiOutlinedInput-multiline': {
            color: 'black',
            backgroundColor: '#bbbbbb',
            fontSize: '14px',
        },
    },
})(TextField);

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
    const [opened, setOpened] = useState(true);
    const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
    const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);

    const [colorList1, setColorList1] = useState(initialColors);
    const [colorList2, setColorList2] = useState(initialColors);

    const [pickerColor, setPickerColor] = useState('#cc0000');

    const { state, dispatchAction } = telestrationStateMgr;

    const { telestrationManager } = state;

    const currentTool = drawTools.find(
        (tool: ITool) => tool.mode === state.editMode
    );

    const colorPickerOpened1 = Boolean(anchorEl1);
    const colorPickerOpened2 = Boolean(anchorEl2);

    const openColorPicker1 = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl1(event.currentTarget);
    };
    const openColorPicker2 = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl2(event.currentTarget);
    };

    const closeColorPicker1 = () => {
        setAnchorEl1(null);
    };

    const closeColorPicker2 = () => {
        setAnchorEl2(null);
    };
    const onColorPick = (color: any, index: number) => {
        dispatchAction(changeTelestrationColor(color.hex, index));
    };

    const handleChangePickerList1 = (pickedColor: any) => {
        // const { r, g, b, a } = pickedColor.rgb;
        // setPickerColor(`rgba(${r}, ${g}, ${b}, ${a})`);
        const updatedColorList = [...colorList1];
        let isRepeatedColor = false;
        updatedColorList.map((color) => {
            if (color === pickedColor.hex) {
                isRepeatedColor = true;
            }
        });
        if (!isRepeatedColor) {
            updatedColorList.pop();
            updatedColorList.unshift(pickedColor.hex);
            setColorList1(updatedColorList);
        }
    };

    const handleChangePickerList2 = (pickedColor: any) => {
        // const { r, g, b, a } = pickedColor.rgb;
        // setPickerColor(`rgba(${r}, ${g}, ${b}, ${a})`);
        const updatedColorList = [...colorList2];
        let isRepeatedColor = false;
        updatedColorList.map((color) => {
            if (color === pickedColor.hex) {
                isRepeatedColor = true;
            }
        });
        if (!isRepeatedColor) {
            updatedColorList.pop();
            updatedColorList.unshift(pickedColor.hex);
            setColorList2(updatedColorList);
        }
    };
    const handleChangePicker = ({ rgb }: any, e: any) => {
        // const { r, g, b, a } = rgb;
        // setPickerColor(`rgba(${r}, ${g}, ${b}, ${a})`);
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
            {telestrationManager.addedShapes.length > 0 &&
                telestrationManager.addedShapes.map(
                    (object: any, index: number) => (
                        <div key={index}>
                            <div
                                className={classes.toolName}
                                onClick={(ev: any) => selectOpen(ev, index)}
                            >
                                {object.type}
                                {object.isSelected ? (
                                    <ArrowDropUpIcon />
                                ) : (
                                    <ArrowDropDownIcon />
                                )}
                            </div>

                            <Collapse in={object.isSelected} timeout={300}>
                                {object.type !== 'Text Box' && (
                                    <div style={{ margin: '10px 0px' }}>
                                        {object.type !== 'Light Shaft' && (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    marginBottom: '10px',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                <CirclePicker
                                                    colors={colorList1}
                                                    color={object.object.color}
                                                    onChange={
                                                        handleChangePicker
                                                    }
                                                    onChangeComplete={(
                                                        color: any,
                                                        ev: any
                                                    ) =>
                                                        onColorPick(
                                                            color,
                                                            index
                                                        )
                                                    }
                                                    circleSize={16.5}
                                                    circleSpacing={7}
                                                />
                                                <div
                                                    onClick={
                                                        openColorPicker1 as any
                                                    }
                                                    style={{
                                                        display: 'flex',
                                                        cursor: 'pointer',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        width: '18px',
                                                        height: '18px',
                                                        borderRadius: '50%',
                                                        background: 'none',
                                                        border:
                                                            '1px solid #fff',
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
                                        {object.type !== 'Polygon' && (
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
                                                        value={
                                                            object.object.zAngle
                                                        }
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
                                )}
                                {object.type === 'Text Box' && (
                                    <>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <CustomTextField
                                                id='outlined-multiline-static'
                                                multiline
                                                rows={4}
                                                variant='outlined'
                                                value={object.object.getText()}
                                                onFocus={(e) => {
                                                    //  tslint:disable-next-line
                                                    window['STOP_KEY_LISTENERS'] = true;
                                                }}
                                                onBlur={(e) => {
                                                    //  tslint:disable-next-line
                                                    window['STOP_KEY_LISTENERS'] = false;
                                                }}
                                                onChange={(e) => {
                                                    dispatchAction(
                                                        changeText(
                                                            e.target.value,
                                                            index
                                                        )
                                                    );
                                                }}
                                            />
                                            <br />
                                            <Box
                                                display='flex'
                                                flexDirection='horizontal'
                                                alignItems='center'
                                                justifyContent='space-between'
                                            >
                                                <Typography>
                                                    Background
                                                </Typography>

                                                <StyledSwitch
                                                    style={{ left: '0px' }}
                                                    checked={
                                                        object.object
                                                            .backgroundEnable
                                                    }
                                                    onChange={(e) => {
                                                        dispatchAction(
                                                            switchTextBackgroundEnable(
                                                                index
                                                            )
                                                        );
                                                    }}
                                                />
                                            </Box>
                                            <br />
                                            <Box
                                                display='flex'
                                                flexDirection='horizontal'
                                                alignItems='center'
                                                justifyContent='space-between'
                                            >
                                                <Typography>
                                                    MaskEnable
                                                </Typography>

                                                <StyledSwitch
                                                    style={{ left: '0px' }}
                                                    checked={
                                                        object.object.maskEnable
                                                    }
                                                    onChange={(e) => {
                                                        dispatchAction(
                                                            switchTextBoxMask(
                                                                index
                                                            )
                                                        );
                                                    }}
                                                />
                                            </Box>
                                            <br />
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                marginBottom: '10px',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <CirclePicker
                                                colors={colorList1}
                                                color={object.object.color}
                                                onChange={handleChangePicker}
                                                onChangeComplete={(
                                                    color: any,
                                                    ev: any
                                                ) => onColorPick(color, index)}
                                                circleSize={16.5}
                                                circleSpacing={7}
                                            />
                                            <div
                                                onClick={
                                                    openColorPicker1 as any
                                                }
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
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            Size
                                            <StyledSlider
                                                style={{ width: '40%' }}
                                                value={object.object.getFontSize()}
                                                onChange={(
                                                    ev: any,
                                                    value: number
                                                ) => {
                                                    dispatchAction(
                                                        ITelestrationSizeChangeAction(
                                                            value,
                                                            index
                                                        )
                                                    );
                                                }}
                                                max={30}
                                                min={10}
                                                step={4}
                                            />
                                        </div>
                                    </>
                                )}
                            </Collapse>

                            <Divider />

                            <ColorPicker
                                handleChange={handleChangePickerList1}
                                color={object.object.color}
                                open={colorPickerOpened1}
                                onPick={(color: any) => {
                                    onColorPick(color, index);
                                    closeColorPicker1();
                                }}
                                onClose={closeColorPicker1}
                                anchorEl={anchorEl1}
                            />
                        </div>
                    )
                )}
            {currentTool && currentTool.mode !== 'selectshape' && (
                <>
                    <div
                        className={classes.toolName}
                        onClick={() => setOpened((prev) => !prev)}
                    >
                        {currentTool.name}
                        {opened ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </div>

                    <Collapse in={opened} timeout={300}>
                        {currentTool.mode !== 'textbox' && (
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
                                            colors={colorList2}
                                            color={pickerColor}
                                            onChange={handleChangePicker}
                                            onChangeComplete={(
                                                color: any,
                                                ev: any
                                            ) => onColorPick(color, -1)}
                                            circleSize={16.5}
                                            circleSpacing={7}
                                        />
                                        <div
                                            onClick={openColorPicker2 as any}
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
                                                value={
                                                    telestrationManager.zAngle
                                                }
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
                        )}

                        {currentTool.mode === 'textbox' && (
                            <>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <CustomTextField
                                        id='outlined-multiline-static'
                                        multiline
                                        rows={4}
                                        variant='outlined'
                                        value={telestrationManager.getText()}
                                        onFocus={(e) => {
                                            //  tslint:disable-next-line
                                            window['STOP_KEY_LISTENERS'] = true;
                                        }}
                                        onBlur={(e) => {
                                            //  tslint:disable-next-line
                                            window['STOP_KEY_LISTENERS'] = false;
                                        }}
                                        onChange={(e) => {
                                            dispatchAction(
                                                changeText(e.target.value, -1)
                                            );
                                        }}
                                    />
                                    <br />
                                    <Box
                                        display='flex'
                                        flexDirection='horizontal'
                                        alignItems='center'
                                        justifyContent='space-between'
                                    >
                                        <Typography>Background</Typography>

                                        <StyledSwitch
                                            style={{ left: '0px' }}
                                            checked={telestrationManager.getTextBackgroundEnable()}
                                            onChange={(e) => {
                                                dispatchAction(
                                                    switchTextBackgroundEnable(
                                                        -1
                                                    )
                                                );
                                            }}
                                        />
                                    </Box>
                                    <br />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        marginBottom: '10px',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <CirclePicker
                                        colors={colorList2}
                                        color={telestrationManager.getTextColor()}
                                        onChange={handleChangePicker}
                                        onChangeComplete={(
                                            color: any,
                                            ev: any
                                        ) => onColorPick(color, -1)}
                                        circleSize={16.5}
                                        circleSpacing={7}
                                    />
                                    <div
                                        onClick={openColorPicker2 as any}
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
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    Size
                                    <StyledSlider
                                        style={{ width: '40%' }}
                                        value={telestrationManager.getTextFontSize()}
                                        onChange={(ev: any, value: number) => {
                                            dispatchAction(
                                                ITelestrationSizeChangeAction(
                                                    value,
                                                    -1
                                                )
                                            );
                                        }}
                                        max={30}
                                        min={10}
                                        step={1}
                                    />
                                </div>
                            </>
                        )}
                    </Collapse>

                    <Divider />

                    <ColorPicker
                        handleChange={handleChangePickerList2}
                        color={pickerColor}
                        open={colorPickerOpened2}
                        onPick={(color: any) => {
                            onColorPick(color, -1);
                            closeColorPicker2();
                            setPickerColor(color);
                        }}
                        onClose={closeColorPicker2}
                        anchorEl={anchorEl2}
                    />
                </>
            )}
        </>
    );
};

export const VideoTool = compose(
    withStyles(styles),
    withTelestrationState
)(videoTool);
