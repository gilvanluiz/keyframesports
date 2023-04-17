import * as React from 'react';
import { useState } from 'react';
import { flow } from 'fp-ts/lib/function';
import { setLastTelestratedVideo, withTelestrationState } from '../State';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    TextField,
} from '@material-ui/core';
import { ITelestrationStateMgr } from '../Types';
import { TransitionProps } from '@material-ui/core/transitions';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import CheckIcon from '@material-ui/icons/Check';
import { withStyles, WithStyles as IWithStyles } from '@material-ui/core';

interface IProps extends IWithStyles {
    telestrationStateMgr: ITelestrationStateMgr;
}

const Transition = React.forwardRef(
    (
        props: TransitionProps & { children?: React.ReactElement<any, any> },
        ref: React.Ref<unknown>
    ) => <Slide direction='up' ref={ref} {...props} />
);

const styles = () => ({
    container: {
        display: 'flex',
        flexDirection: 'row' as 'row',
    },
    textField: {
        width: '100%',
        marginRight: '15px',
    },
    copiedButton: {
        color: 'green',
        alignItems: 'center',
        width: '105px',
    },
});

const lastTelestratedVideoLinkModal = ({
    telestrationStateMgr,
    classes,
}: IProps) => {
    const [copied, setCopied] = useState(false);
    const {
        state: { lastTelestratedVideo },
        dispatchAction,
    } = telestrationStateMgr;
    return (
        <Dialog
            open={lastTelestratedVideo ? true : false}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => dispatchAction(setLastTelestratedVideo(''))}
            aria-labelledby='alert-dialog-slide-title'
            aria-describedby='alert-dialog-slide-description'
        >
            <DialogTitle id='alert-dialog-slide-title'>
                You can share telestrated video by sending this link
            </DialogTitle>
            <DialogContent className={classes.container}>
                <TextField value={lastTelestratedVideo} fullWidth={true} />
                <Button
                    disabled={copied}
                    onClick={() => {
                        navigator.clipboard
                            .writeText(lastTelestratedVideo)
                            .then(
                                () => {
                                    setCopied(true);
                                    setTimeout(() => {
                                        setCopied(false);
                                    }, 3000);
                                },
                                () => {
                                    console.error('clipboard write failed');
                                }
                            );
                    }}
                >
                    {copied ? (
                        <div className={classes.copiedButton}>
                            <CheckIcon fontSize='small' />
                            Copied
                        </div>
                    ) : (
                        <FileCopyOutlinedIcon />
                    )}
                </Button>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => dispatchAction(setLastTelestratedVideo(''))}
                    color='secondary'
                >
                    Got it
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export const LastTelestratedVideoLinkModal = flow(
    withStyles(styles),
    withTelestrationState
)(lastTelestratedVideoLinkModal);
