import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Slide,
} from '@material-ui/core';
import PhoneInput from 'react-phone-input-2';
import { TransitionProps } from '@material-ui/core/transitions';

const statusList = [422, 409, 200, 404, 401]

const Transition = React.forwardRef(
    (
        props: TransitionProps & { children?: React.ReactElement<any, any> },
        ref: React.Ref<unknown>
    ) => <Slide direction='up' ref={ref} {...props} />
);

interface IProps {
    display: boolean;
    phone: string | undefined;
    phoneVerified: boolean;
    setPhoneVerified: (b: boolean) => any;
    setPhone: (s: string) => any;
}

interface IEnterPhoneComponentProps {
    setPhone: any
}

const GetPhoneNumberComponent = (props: IEnterPhoneComponentProps) => {
    const message = `To verify your identity, you need to a phone number associated with your account. Please enter your phone number.`;
    const [phone, setPhone] = React.useState('');
    const [phoneNumberError, setPhoneNumberError]: any = React.useState(undefined);
    const [submitting, setSubmitting] = React.useState(false);
    const onChange = (e: string)=> {
        setPhone(e)
    }
    const onSubmit = async () => {
        const body = {
            username: localStorage.getItem('username'),
            password: localStorage.getItem('password'),
            phone: '+' + phone
        };
        const url = process.env.REACT_APP_ALEPH_URI +
            '/api-v1/authentication/update-phone';
        setSubmitting(true);
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const status = await res.status;
        if (status === statusList[0]) {
            setSubmitting(false);
            setPhoneNumberError('Invalid phone number');
        } else if (status === statusList[1]) {
            setPhone('');
            setPhoneNumberError('That phone number is taken');
            setSubmitting(false);
        } else if (status === statusList[2]) {
            setSubmitting(false);
            setPhone('');
            props.setPhone(phone);
        }
    }
    return (
        <>
            <DialogTitle id='alert-dialog-slide-title'>
                Validate Your Mobile Phone
            </DialogTitle>
            <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
            { phoneNumberError || message }
            </DialogContentText>
            <PhoneInput
                placeholder='Phone number'
                id='phone'
                value={phone}
                onChange={onChange}
                inputStyle={{
                    borderRadius: 0,
                    marginTop: '20px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '350px',
                }}
                buttonStyle={{
                    marginTop: '20px',
                }}
                country={'us'}
                specialLabel=''
                error={phoneNumberError}
                inputProps={{
                    name: 'phone',
                }}
            />
            </DialogContent>
            <DialogActions>
                <Button onClick={onSubmit} color='secondary'
                    disabled={submitting}>
                    Set my phone number
                </Button>
            </DialogActions>
       </>
    );
}

interface IVerifyPhoneComponent {
    setPhoneVerified: (b: boolean) => any;
    phone?: string;
}

const VerifyPhoneComponent = ({
    setPhoneVerified,
    phone
}: IVerifyPhoneComponent) => {
    const beforeSendingMsg = `To verify your phone, we need to send a text message to ${phone}.`;
    const errorSendingMsg = `There was an error validating your phone number. Email info@keyframesports.com for help.`
    const [verificationCode, setVerificationCode]: any= React.useState();
    const [textSent, setTextSent]: any = React.useState(false);
    const [error, setError]: any = React.useState();
    const [submitting, setSubmitting]: any = React.useState(false);
    const onChange = (e: any)=> {
        setVerificationCode(e.target.value)
    }
    const sendCode = async () => {
        const body = {
            username: localStorage.getItem('username'),
            password: localStorage.getItem('password'),
        };
        const url = process.env.REACT_APP_ALEPH_URI +
            '/api-v1/authentication/send-verification-sms';
        setSubmitting(true);
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const status = await res.status;
        if (status === statusList[2]) {
            setSubmitting(false);
            setTextSent(true);
            setVerificationCode('');
        } else {
            setSubmitting(false);
            setError(errorSendingMsg);
        }
    };
    const submitCode = async () => {
        const body = {
            username: localStorage.getItem('username'),
            password: localStorage.getItem('password'),
            verificationCode
        };
        const url = process.env.REACT_APP_ALEPH_URI +
            '/api-v1/authentication/verify-phone';
        setSubmitting(true);
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const status = await res.status;
        const resJson = await res.json();
        if (status === statusList[2]) {
            setSubmitting(false);
            setVerificationCode('');
            setPhoneVerified(true);
        } else if (status === statusList[3]){
            setSubmitting(false);
            setError('Token is incorrect or expired');
        } else if (status === statusList[4] && resJson.type === 'invalid-verification-code') {
            setSubmitting(false);
            setError(errorSendingMsg);
        }
    };

    const msg = () => {
        if (error) { return error; }
        else if (!textSent) { return beforeSendingMsg; }
        else if (textSent) { return 'Enter the number you received in a text.'; }
    }
    const actions =  (
        <DialogActions>
            {!textSent && (
                <Button onClick={sendCode} color='secondary'
                disabled={submitting && !error}>
                    Send Verification Text
                </Button>)}
        {textSent && (
            <Button onClick={submitCode} color='secondary'
                disabled={submitting && !error}>
                    Submit
            </Button>)}
        </DialogActions>
    )
    const verificationField = textSent && (
        <TextField
            required
            variant='outlined'
            id='verification-code'
            onChange={onChange}
            value={verificationCode}
            placeholder='Verification Code'
        />
    )
    return (
        <>
            <DialogTitle id='alert-dialog-slide-title'>
                Validate Your Mobile Phone
            </DialogTitle>
            <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
            { msg() }
            </DialogContentText>
            {verificationField}
            {actions}
            </DialogContent>
       </>
    );
}
export const ValidatePhoneMessage = (props: IProps) => {
    if (!props.display) { return null; }
    return (
        <Dialog
            open={props.display}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby='alert-dialog-slide-title'
            aria-describedby='alert-dialog-slide-description' >
                {!props.phone && (<GetPhoneNumberComponent setPhone={props.setPhone}/>)}
                {props.phone && (
                    <VerifyPhoneComponent
                        setPhoneVerified={props.setPhoneVerified}
                        phone={props.phone} />)}
        </Dialog>
    );
};
