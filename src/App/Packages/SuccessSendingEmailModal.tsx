import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
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

export const SuccessSendingEmailModal = (props: IProps) => {
    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.onClose}
            aria-labelledby='alert-dialog-slide-title'
            aria-describedby='alert-dialog-slide-description'
        >
            <DialogContent>
                <DialogContentText id='alert-dialog-slide-description'>
                    A Keyframe Staff member has received a notification to reach
                    out to you regarding a license. If you are in a hurry, feel
                    free to email james@keyframesports.com
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
