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

import { Logout } from './Logout';
import { TransitionProps } from '@material-ui/core/transitions';

const Transition = React.forwardRef(
    (
        props: TransitionProps & { children?: React.ReactElement<any, any> },
        ref: React.Ref<unknown>
    ) => <Slide direction='up' ref={ref} {...props} />
);

interface IProps {
    emailUnverified: boolean;
}

const unsentVerificationMsg = `
  You need to verify your email.
`;
const sentVerificationMsg = `
  We have sent you an email with a verification link. Click the link in the email to verify your account. If you have difficulty, email info@keyframesports.com
`;
const errorSendingEmailMsg = `
  There was an error sending your verification email. Please email info@keyframesports.com for help.
`;

export const ValidateEmailMessage = (props: IProps) => {
    const [emailSent, setEmailSent] = React.useState(false);
    const [errorSendingEmail, setErrorSendingEmail] = React.useState(false);

    const msg = () => {
        if (errorSendingEmail) {
            return errorSendingEmailMsg;
        } else if (emailSent) {
            return sentVerificationMsg;
        } else {
            return unsentVerificationMsg;
        }
    };

    const sendEmailVerification = () => {
        const body = {
            username: localStorage.getItem('username'),
            password: localStorage.getItem('password'),
        };
        const url =
            process.env.REACT_APP_ALEPH_URI +
            '/api-v1/authentication/send-verification-email';
        const res = fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        console.log(res);
        setEmailSent(true);
    };
    console.log(setErrorSendingEmail);
    const actions = (
        <DialogActions>
            {!emailSent && (
                <>
                    <Button onClick={sendEmailVerification} color='secondary'>
                        Send my verification email
                    </Button>

                    <Button onClick={Logout} color='secondary'>
                        Logout
                    </Button>
                </>
            )}
        </DialogActions>
    );

    return (
        <Dialog
            open={props.emailUnverified}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby='alert-dialog-slide-title'
            aria-describedby='alert-dialog-slide-description'
        >
            <DialogTitle id='alert-dialog-slide-title'>
                Validate Your Email Address
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-slide-description'>
                    {msg()}
                </DialogContentText>
            </DialogContent>
            {actions}
        </Dialog>
    );
};
