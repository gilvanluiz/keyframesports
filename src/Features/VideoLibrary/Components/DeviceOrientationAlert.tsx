import { makeStyles } from '@material-ui/core';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
} from '@material-ui/core';
import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

interface IProps {
    open: boolean;
    onClose: Dispatch<SetStateAction<boolean>>;
    position?: string;
}

const styles = makeStyles({
    position: {
        position: 'absolute',
        top: '10%',
    },
});

export function DeviceOrientationAlert({ open, onClose, position }: IProps) {
    const classes = styles();
    return (
        <Dialog
            open={open}
            keepMounted
            onClose={() => onClose(false)}
            classes={{
                paper: position === 'top' ? classes.position : '',
            }}
        >
            <DialogContent id='alert-dialog-slide-title'>
                Rotate device to landscape orientation to telestrate
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)} color='secondary'>
                    Got it
                </Button>
            </DialogActions>
        </Dialog>
    );
}
