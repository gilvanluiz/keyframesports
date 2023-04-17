import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';

const Transition = React.forwardRef(
    (
        props: TransitionProps & { children?: React.ReactElement<any, any> },
        ref: React.Ref<unknown>
    ) => <Slide direction='up' ref={ref} {...props} />
);

interface IProps {
    open: boolean;
    onClose: () => void;
}

export const SwitchBrowserMessage = (props: IProps) => {
    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.onClose}
            aria-labelledby='alert-dialog-slide-title'
            aria-describedby='alert-dialog-slide-description'
        >
            <DialogTitle id='alert-dialog-slide-title'>
                You seem to be using an unsupported browser
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-slide-description'>
                    For a better experience, please use the Google Chrome
                    browser
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color='secondary'>
                    Got it
                </Button>
            </DialogActions>
        </Dialog>
    );
};
