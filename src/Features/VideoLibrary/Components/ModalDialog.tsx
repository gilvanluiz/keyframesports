import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    Button,
    TextField,
    Divider,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
} from '@material-ui/core';

const styles = (theme: ITheme) => ({
    dialogBox: {
        padding: theme.spacing(1.25),
        paddingTop: '0px',
    },
    dialogTitle: {
        padding: `${theme.spacing(1.25)}px ${theme.spacing(0.5)}px`,
    },
    buttonRow: {
        paddingTop: theme.spacing(1.25),
        textAlign: 'right' as 'right',
        '& button': {
            borderRadius: theme.spacing(1),
        },
    },
    button: {
        marginLeft: theme.spacing(1),
    },
    form: {
        margin: `${theme.spacing(2)} 0px`,
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    videoTitle: {
        width: '100%',
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(1.25),
    },
    videoDescription: {
        width: '100%',
        marginBottom: theme.spacing(1.25),
    },
});

interface IField {
    label: string;
    name: string;
    required: boolean;
    defaultValue: string;
}

interface IProps {
    open: boolean;
    title: string;
    confirmButtonText?: string;
    width?: string;
    fields?: IField[];
    onClose: () => void;
    onConfirm: (form?: object) => void;
}

const modalDialog = ({
    classes,
    open,
    title,
    confirmButtonText,
    width,
    fields,
    onClose,
    onConfirm,
}: IProps & IWithStyles) => {
    const [formState, setFormState] = useState({});

    const onUpdate = (field: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) =>
        setFormState({
            ...formState,
            [field]: event.currentTarget.value,
        });

    const isReady = () =>
        fields
            ? Object.entries(
                  formState
              ).every(([key, value]: [string, string]) =>
                  fields.find((field: IField) => field.name === key)?.required
                      ? value.length > 1
                      : true
              )
            : true;

    const form = fields ? (
        <Box className={classes.form}>
            {fields.map(
                (
                    { label, name, required, defaultValue }: IField,
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
        </Box>
    ) : null;

    useEffect(() => {
        if (fields) {
            const newFormState = {};
            fields.forEach(
                ({ name, defaultValue }: IField) =>
                    (newFormState[name] = defaultValue)
            );
            setFormState(newFormState);
        }
    }, [fields]);

    return (
        <Dialog open={open} onClose={onClose}>
            <Box
                className={classes.dialogBox}
                style={{ width: width || '400px' }}
            >
                <DialogTitle className={classes.dialogTitle}>
                    {title}
                </DialogTitle>
                <Divider />
                {form}
                <Box className={classes.buttonRow}>
                    <Button
                        variant='contained'
                        color='primary'
                        disabled={!isReady()}
                        onClick={() => onConfirm(formState)}
                    >
                        {confirmButtonText || 'Save'}
                    </Button>
                    <Button
                        variant='contained'
                        className={classes.button}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export const ModalDialog = withStyles(styles)(modalDialog);
