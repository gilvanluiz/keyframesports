import * as React from 'react';
import Popover, {
    PopoverProps as IPopoverProps,
} from '@material-ui/core/Popover';
import { SketchPicker } from 'react-color';
import './style.css';

interface IProps extends IPopoverProps {
    open: boolean;
    snackbar?: boolean;
    onPick: (color: any) => void;
    color: string;
    handleChange: ({ rgb }: any) => void;
}

export const colorPicker = ({
    color,
    open,
    snackbar,
    anchorEl,
    onPick,
    onClose,
    handleChange,
}: IProps) => {
    const id = open ? 'simple-popover' : undefined;

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'right',
            }}
        >
            <SketchPicker
                color={color}
                onChange={handleChange}
                onChangeComplete={onPick}
            />
        </Popover>
    );
};

export const ColorPicker = React.memo(colorPicker);
