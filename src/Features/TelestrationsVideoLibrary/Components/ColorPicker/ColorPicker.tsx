import * as React from 'react';
import { useEffect, useState } from 'react';
import { Grow, Snackbar } from '@material-ui/core';
import { ColorResult, SketchPicker } from 'react-color';
import './style.css';
import { IColorPayload, ITelestrationStateMgr } from '../../Types';
import { replaceTelestrationColors, withTelestrationState } from '../../State';
import { flow } from 'fp-ts/lib/function';
import { TransitionProps } from '@material-ui/core/transitions';

interface IProps {
    open: boolean;
    onPick: (color: any) => void;
    telestrationStateMgr: ITelestrationStateMgr;
}

const colorsArray = [
    'POLYGON_COLOR',
    'ARROW_COLOR',
    'CURSOR_COLOR',
    'PLAYER_CUT_OUT_ARROW_COLOR',
];
const GrowTransition = (props: TransitionProps) => {
    return <Grow {...props} />;
};
const toolTypeArray = ['arrow', 'freearrow', 'playercutout', 'straightarrow'];
export const colorPicker = ({ open, onPick, telestrationStateMgr }: IProps) => {
    const [isVertical, setIsVertical] = useState(true);
    const {
        dispatchAction,
        state: { telestrationManager },
        state: { editMode },
    } = telestrationStateMgr;
    const LOCAL_STORAGE_COLOR_PICKER_KEY = 'COLOR_PICKER_KEY';

    useEffect(() => {
        const storageData = localStorage.getItem(
            LOCAL_STORAGE_COLOR_PICKER_KEY
        );
        if (storageData) {
            const savedColors: IColorPayload = JSON.parse(storageData);
            dispatchAction(replaceTelestrationColors(savedColors));
        }
    }, [telestrationManager]);

    useEffect(() => {
        if (toolTypeArray.includes(editMode)) {
            setIsVertical(true);
        } else {
            setIsVertical(false);
        }
    }, [editMode]);

    function handleSaveColors() {
        const newColors = colorsArray.reduce((newArray, color) => {
            return { ...newArray, [color]: telestrationManager.config[color] };
        }, {});
        localStorage.setItem(
            LOCAL_STORAGE_COLOR_PICKER_KEY,
            JSON.stringify(newColors)
        );
    }

    return (
        <Snackbar
            style={
                isVertical
                    ? {
                          top: '-70px',
                          width: '73px',
                          left: '68px',
                          transform: 'rotate(90deg)',
                          height: '218px',
                          position: 'relative',
                      }
                    : {
                          left: '4px',
                          bottom: '115px',
                      }
            }
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={open}
            TransitionComponent={GrowTransition}
        >
            <SketchPicker
                onChangeComplete={(e: ColorResult) => {
                    onPick(e);
                    handleSaveColors();
                }}
            />
        </Snackbar>
    );
};

export const ColorPicker = flow(withTelestrationState)(colorPicker);
