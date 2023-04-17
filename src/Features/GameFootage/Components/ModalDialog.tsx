import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    Button,
    TextField,
    Divider,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    dialogBox: {
        borderRadius: '10px',
    },
    dialogTitle: {
        padding: '10px 5px 10px 5px',
    },
    dialogMessage: {
        padding: '30px',
        whiteSpace: 'pre-wrap' as 'pre-wrap',
        textAlign: 'center' as 'center',
    },
    buttonsRow: {
        display: 'flex',
    },
    button: {
        width: '50%',
        padding: '10px',
        borderRadius: '0px',
        borderTop: '1px solid #fff',
        '&:last-child': {
            borderLeft: '1px solid #fff',
        },
    },
    form: {
        margin: '15px 0',
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    videoTitle: {
        width: '100%',
        marginTop: '5px',
        marginBottom: '10px',
    },
    videoDescription: {
        width: '100%',
        marginBottom: '10px',
    },
};

interface IProps {
    classes: any;
    open: boolean;
    title?: string;
    message?: string;
    confirmButtonText?: string;
    width?: string;
    fields?: any;
    onClose: any;
    onConfirm: any;
}

const modalDialog = ({
    classes,
    open,
    title,
    message,
    confirmButtonText,
    width,
    fields,
    onClose,
    onConfirm,
}: IProps) => {
    const [formState, updateFormState] = useState({});

    const onUpdate = (field: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) =>
        updateFormState({
            ...formState,
            [field]: event.currentTarget.value,
        });

    const isReady = () => {
        return fields
            ? Object.entries(formState).every(([key, value]: any) => {
                  return fields.find((field: any) => field.name === key)
                      .required
                      ? value.length > 1
                      : true;
              })
            : true;
    };

    const form = fields ? (
        <div className={classes.form}>
            {fields.map(
                (
                    { label, name, required, defaultValue }: any,
                    index: number
                ) => {
                    return (
                        <TextField
                            key={index}
                            className={classes.videoTitle}
                            required={required}
                            label={label}
                            id={name}
                            variant='outlined'
                            value={formState[name]}
                            onChange={onUpdate(name)}
                        />
                    );
                }
            )}
        </div>
    ) : null;

    useEffect(() => {
        if (fields) {
            const newFormState = {};
            fields.forEach(
                ({ name, defaultValue }: any) =>
                    (newFormState[name] = defaultValue)
            );
            updateFormState(newFormState);
        }
    }, [fields]);

    return (
        <Dialog open={open} onClose={onClose}>
            <div
                className={classes.dialogBox}
                style={{ width: width || '400px' }}
            >
                {title ? (
                    <div>
                        <DialogTitle className={classes.dialogTitle}>
                            {title}
                        </DialogTitle>
                        <Divider />
                    </div>
                ) : null}
                {message ? (
                    <div className={classes.dialogMessage}>{message}</div>
                ) : null}
                {form}
                <div className={classes.buttonsRow}>
                    <Button className={classes.button} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!isReady()}
                        onClick={onConfirm}
                        className={classes.button}
                    >
                        {confirmButtonText || 'Save'}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export const ModalDialog = withStyles(styles)(modalDialog);
