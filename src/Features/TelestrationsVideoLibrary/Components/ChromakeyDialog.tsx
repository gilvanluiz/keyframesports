import * as React from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    FormControlLabel,
    Slide,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { EditMode } from '../Types';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';

const styles = makeStyles((theme) => ({
    paper: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '20px',
        maxWidth: '570px',
    },
    contentText: {
        color: theme.palette.common.white,
        textTransform: 'uppercase',
        fontSize: '24px',
        margin: '10px 30px',
        textAlign: 'center',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    button: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        textTransform: 'uppercase' as 'uppercase',
        borderRadius: theme.spacing(1),
        width: '28%',
        height: '40px',
        fontSize: '20px',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
        },
    },
    checkboxContaner: {
        alignSelf: 'flex-end',
        marginTop: '25px',
    },
}));

interface IProps {
    editMode: EditMode;
}

const Transition = React.forwardRef(
    (
        props: TransitionProps & { children?: React.ReactElement<any, any> },
        ref: React.Ref<unknown>
    ) => <Slide direction='up' ref={ref} {...props} timeout={800} />
);

export function ChromakeyDialog({ editMode }: IProps) {
    const [open, setOpen] = useState(true);
    const classes = styles();
    const doNotShowPrompt = localStorage.getItem('doNotShow_chromakey');

    useEffect(() => {
        if (!open && editMode !== 'chromakey_first_mount') {
            setOpen(true);
        }
    }, [editMode]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            localStorage.setItem('doNotShow_chromakey', 'true');
        } else {
            localStorage.removeItem('doNotShow_chromakey');
        }
    }

    return !doNotShowPrompt ? (
        <Dialog
            open={editMode === 'chromakey_first_mount' && open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setOpen((prev: boolean) => !prev)}
            aria-labelledby='alert-dialog-slide-title'
            aria-describedby='alert-dialog-slide-description'
            classes={{ paper: classes.paper }}
        >
            <DialogContent>
                <DialogContentText
                    id='alert-dialog-slide-description'
                    className={classes.contentText}
                >
                    Click on the green parts of the field so that the tools work
                </DialogContentText>
            </DialogContent>
            <DialogActions className={classes.buttonContainer}>
                <Button
                    onClick={() => setOpen((prev: boolean) => !prev)}
                    className={classes.button}
                >
                    Ok
                </Button>
                <FormControlLabel
                    className={classes.checkboxContaner}
                    control={
                        <Checkbox onChange={handleChange} color='primary' />
                    }
                    label='DO NOT SHOW THIS MESSAGE AGAIN'
                />
            </DialogActions>
        </Dialog>
    ) : (
        <></>
    );
}
