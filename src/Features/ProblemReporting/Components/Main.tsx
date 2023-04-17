import * as React from 'react';
import { useState } from 'react';
import {
    Typography,
    Button,
    Box,
    TextField,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
} from '@material-ui/core';
import { validateEmail } from '../../../Utilities/Validations';
import services from '../../../Api/services';
import CheckIcon from '../../../Assets/check.png';

const styles = (theme: ITheme) => ({
    container: {
        height: '100%',
        width: '100%',
    },
    content: {
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    header: {
        display: 'flex',
        color: theme.palette.common.white,
        background: theme.palette.primary.dark,
        fontWeight: 'normal' as 'normal',
        textTransform: 'uppercase' as 'uppercase',
        padding: `${theme.spacing(1.25)}px ${theme.spacing(2.5)}px`,
    },
    title: {
        fontSize: '2.2em',
        display: 'flex',
        alignItems: 'center',
        minWidth: theme.spacing(30),
    },
    submitButton: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        fontSize: theme.spacing(2),
        marginLeft: 'auto',
        borderRadius: theme.spacing(1),
        padding: `0px ${theme.spacing(2.5)}px`,
        minWidth: theme.spacing(25),
        fontWeight: 'bold' as 'bold',
    },
    form: {
        height: `calc(80vh - ${theme.spacing(8)}px)`,
        maxHeight: `calc(100vh - ${theme.spacing(8)}px)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column' as 'column',
        '& > div': {
            width: '50%',
        },
    },
});

const initialFormState = {
    subject: '',
    message: '',
    email: '',
};

const reportProblem = ({ classes }: IWithStyles) => {
    const [formState, setFormState] = useState(initialFormState);

    const [submissionState, updateSubmissionState] = useState({
        submitted: false,
        inFlight: false,
    });

    const submissionComplete = () => {
        updateSubmissionState({
            ...submissionState,
            submitted: true,
        });
        setFormState(initialFormState);
    };

    const onSubmit = async () => {
        submissionComplete();
        await services.saveFeedback(formState);
    };

    const updateFormState = (fieldName: 'subject' | 'message' | 'email') => (
        event: any
    ) =>
        setFormState({
            ...formState,
            [fieldName]: event.currentTarget.value,
        });

    const isDisabled = () => {
        return (
            formState.subject.length < 1 ||
            formState.email.length < 1 ||
            !validateEmail(formState.email)
        );
    };

    const emailIsInvalid = () => {
        return formState.email.length > 0 && !validateEmail(formState.email);
    };

    return (
        <Box className={classes.container}>
            <Box className={classes.header}>
                <Box className={classes.title}>Contact Us</Box>
                <Button
                    aria-label='Submit'
                    onClick={onSubmit}
                    className={classes.submitButton}
                    disabled={isDisabled()}
                    startIcon={
                        <img
                            src={CheckIcon}
                            style={{ opacity: isDisabled() ? 0.35 : 1 }}
                            alt='got it'
                            width='24'
                            height='24'
                        />
                    }
                >
                    Submit
                </Button>
            </Box>
            <Box className={classes.form}>
                {submissionState.submitted ? (
                    <Box>
                        <Typography variant='h4'>
                            Thank you for your feedback!
                        </Typography>
                    </Box>
                ) : (
                    <Box>
                        <TextField
                            required
                            fullWidth
                            value={formState.subject}
                            onChange={updateFormState('subject')}
                            id='standard-required'
                            label='Subject'
                            margin='normal'
                        />
                        <TextField
                            required
                            fullWidth
                            value={formState.email}
                            onChange={updateFormState('email')}
                            id='standard-required'
                            label='Email'
                            margin='normal'
                            error={emailIsInvalid()}
                            helperText={
                                emailIsInvalid() ? 'Email is not valid' : ''
                            }
                        />
                        <TextField
                            id='outlined-multiline-static'
                            label='Description'
                            onChange={updateFormState('message')}
                            value={formState.message}
                            fullWidth
                            multiline
                            rows='4'
                            margin='normal'
                            variant='outlined'
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export const ReportProblem = withStyles(styles)(reportProblem);
