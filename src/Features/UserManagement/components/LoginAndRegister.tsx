import * as React from 'react';
import * as ReactGA from 'react-ga';
import { useState } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Lens } from 'monocle-ts';
import { compose } from 'fp-ts/lib/function';
import { IProps, ILoginForm, IRegisterForm } from './types';
import { withLocalState } from '../../../App/LocalState';
import { LoginBox } from './LoginBox';
import { RegisterBox } from './RegisterBox';
import { validateEmail } from '../../../Utilities/Validations';
import services from '../../../Api/services';
import loginBg from '../../../Assets/loginBG.jpg';
import keyframeLogo from '../../../Assets/Keyframe_Sports_Wordmark_Black.png';
import keyframeK from '../../../Assets/keyframe_logo.png';

const styles = (theme: any) => ({
    loginRoot: {
        height: '100vh',
        width: '100vw',
        position: 'fixed' as 'fixed',
        top: '0px',
        background: `url(${loginBg}) center no-repeat fixed`,
        backgroundSize: 'cover',
    },
    overlay: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column' as 'column',
        overflow: 'auto',
        position: 'fixed' as 'fixed',
        top: '0px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: '100%',
        height: '100%',
    },
    logoWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    formWrapper: {
        marginBottom: '20px',
    },
    footerWrapper: {
        position: 'relative' as 'relative',
        padding: '35px 100px',

        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoK: {
        height: '70px',
    },
    logoKeyframe: {
        height: '70px',
        alignSelf: 'center',
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column' as 'column',
        top: '20vh',
        width: '350px',
        padding: '50px 100px',
    },
});

const defaultLoginState: ILoginForm = {
    username: '',
    password: '',
    errors: {
        state: false,
        serverErrors: '',
    },
};

const defaultRegisterState: IRegisterForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organizationName: '',
    password: '',
    emailOptIn: true,
    errors: {
        state: false,
        serverErrors: '',
    },
    role: {
        select: '',
        other: '',
    },
    purpose: {
        select: '',
        other: '',
    },
    'referral-source': {
        select: '',
        other: '',
    },
};

const loginAndRegister = (props: IProps) => {
    const { classes, history } = props;
    const [loginState, updateLoginState]: [
        ILoginForm,
        (state: ILoginForm) => any
    ] = useState(defaultLoginState);
    const [registerState, updateRegisterState]: [
        IRegisterForm,
        (state: IRegisterForm) => any
    ] = useState(defaultRegisterState);

    const { pathname } = useLocation();

    const updateLoginForm = (name: 'username' | 'password', value: string) => {
        const newState = Lens.fromProp<ILoginForm>()(name).set(value)(
            loginState
        );
        updateLoginState(newState);
    };

    const updateRegisterForm = (
        name:
            | 'firstName'
            | 'lastName'
            | 'email'
            | 'phone'
            | 'organizationName'
            | 'password'
            | 'emailOptIn',
        value: string | boolean
    ) => {
        const newState = Lens.fromProp<IRegisterForm>()(name).set(value)(
            registerState
        );
        updateRegisterState(newState);
    };

    const updateSelectField = (
        name: 'referral-source' | 'purpose' | 'role',
        value: string
    ) => {
        const newState = Lens.fromProp<IRegisterForm>()(name).set({
            ...registerState[name],
            select: value,
        })(registerState);
        updateRegisterState(newState);
    };

    const updateComentField = (
        name: 'referral-source' | 'purpose' | 'role',
        value: string
    ) => {
        const newState = Lens.fromProp<IRegisterForm>()(name).set({
            ...registerState[name],
            other: value,
        })(registerState);
        updateRegisterState(newState);
    };

    const setLoginFormError = (message?: string) => {
        if (message) {
            const newState = Lens.fromProp<ILoginForm>()('errors').set({
                serverErrors: message,
                state: true,
            })(loginState);
            updateLoginState(newState);
        } else {
            const newState = Lens.fromProp<ILoginForm>()('errors').set({
                ...loginState.errors,
                state: true,
            })(loginState);
            updateLoginState(newState);
        }
    };

    const setRegisterFormError = (message?: string) => {
        if (message) {
            const newState = Lens.fromProp<IRegisterForm>()('errors').set({
                serverErrors: message,
                state: true,
            })(registerState);
            updateRegisterState(newState);
        } else {
            const newState = Lens.fromProp<IRegisterForm>()('errors').set({
                ...registerState.errors,
                state: true,
            })(registerState);
            updateRegisterState(newState);
        }
    };

    const clearLoginFormError = () => {
        const newState = Lens.fromProp<ILoginForm>()('errors').set({
            serverErrors: '',
            state: false,
        })(loginState);
        updateLoginState(newState);
    };

    const clearRegisterFormError = () => {
        const newState = Lens.fromProp<IRegisterForm>()('errors').set({
            serverErrors: '',
            state: false,
        })(registerState);
        updateRegisterState(newState);
    };

    const submitLoginOrRegister = async ({
        payload,
        method,
        clearFormError,
        setFormError,
        userEvent,
    }: any) => {
        const username = (payload.username || payload.email) as string;
        const phone = payload.phone && payload.phone.replace(/[ ()-]/g, '');
        const password = payload.password;
        const cleanPayload = phone ? { ...payload, phone } : payload;
        try {
            const response = await services[method](cleanPayload);

            if (response.status !== 200) {
                throw Error('Not a 200 response!');
            }
            ReactGA.event(userEvent);
            clearFormError();
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            history.push('/');
        } catch (err) {
            const errStatus = err.response.status;
            const errType = err.response.data.type;
            const message =
                errStatus === 409 && errType === 'email-already-registered'
                    ? 'That email address has already been registered'
                    : errStatus === 409 &&
                      errType === 'phone-already-registered'
                    ? 'That phone number has already been registered'
                    : errStatus === 403
                    ? 'Incorrect email or password'
                    : 'Internal server error';

            setFormError(message);
        }
    };

    const handleSubmit = (method: 'login' | 'register') => {
        const affiliateID = localStorage.getItem('affiliateId');
        const referralTimestamp = localStorage.getItem('referralTimestamp');
        const referralId = localStorage.getItem('referralId');

        let payload: any;
        let clearFormError: () => void;
        let setFormError: () => void;
        const userEvent: any = {
            category: 'User',
        };

        switch (method) {
            case 'login': {
                clearFormError = clearLoginFormError;
                setFormError = setLoginFormError;
                payload = { ...loginState };
                userEvent.action = 'Logged to account';
                break;
            }
            case 'register': {
                clearFormError = clearRegisterFormError;
                setFormError = setRegisterFormError;
                payload = { ...registerState };
                ['role', 'purpose', 'referral-source'].map((item) => {
                    if (payload[item].select === 'other') {
                        payload[item] = { other: payload[item].other };
                    } else {
                        if (payload[item].select !== '') {
                            payload[item] = payload[item].select;
                        } else {
                            delete payload[item];
                        }
                    }
                });
                userEvent.action = 'Created an account';
                break;
            }
            default: {
                return;
            }
        }

        if (affiliateID && referralTimestamp && referralId) {
            payload.affiliateId = affiliateID;
            payload.referralTimestamp = +referralTimestamp;
            payload.referralId = referralId;
        }

        submitLoginOrRegister({
            payload,
            method,
            clearFormError,
            setFormError,
            userEvent,
        });
    };

    const changeHandler = (form: 'login' | 'register', field: any) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (form === 'login') {
            updateLoginForm(field, event.target.value);
        } else if (form === 'register') {
            console.log(event);
            if (event.target.name === 'select') {
                return updateSelectField(field, event.target.value);
            }
            if (event.target.name === 'other') {
                return updateComentField(field, event.target.value);
            }
            const value =
                field === 'emailOptIn'
                    ? event.target.checked
                    : event.target.value;
            updateRegisterForm(field, value);
        }
    };

    const formIsDisabled = (form: 'login' | 'register') => {
        let isDisabled = false;
        if (form === 'login') {
            isDisabled =
                loginState.username.length < 1 ||
                loginState.password.length < 1 ||
                !validateEmail(loginState.username);
        } else if (form === 'register') {
            isDisabled =
                registerState.email.length < 1 ||
                registerState.password.length < 1 ||
                !validateEmail(registerState.email) ||
                registerState.firstName.length < 1 ||
                registerState.lastName.length < 1 ||
                registerState.organizationName.length < 1;
        }

        return isDisabled;
    };

    const emailIsInvalid = (form: 'login' | 'register') => {
        let isInvalid = false;
        if (form === 'login') {
            isInvalid =
                loginState.username.length > 0 &&
                !validateEmail(loginState.username);
        } else if (form === 'register') {
            isInvalid =
                registerState.email.length > 0 &&
                !validateEmail(registerState.email);
        }

        return isInvalid;
    };

    return (
        <div className={classes.loginRoot}>
            <div className={classes.overlay}>
                <div className={classes.content}>
                    <div>
                        <div className={classes.logoWrapper}>
                            <img className={classes.logoK} src={keyframeK} />
                        </div>
                        <div className={classes.formWrapper}>
                            {pathname === '/login' ? (
                                <LoginBox
                                    emailIsInvalid={emailIsInvalid}
                                    formIsDisabled={formIsDisabled}
                                    form={loginState}
                                    onChange={changeHandler}
                                    onSubmit={handleSubmit}
                                />
                            ) : pathname === '/register' ? (
                                <RegisterBox
                                    emailIsInvalid={emailIsInvalid}
                                    formIsDisabled={formIsDisabled}
                                    form={registerState}
                                    onChange={changeHandler}
                                    onSubmit={handleSubmit}
                                />
                            ) : (
                                <Redirect to='/login' />
                            )}
                        </div>
                    </div>
                </div>
                <div className={classes.footerWrapper}>
                    <img className={classes.logoKeyframe} src={keyframeLogo} />
                    <div>&copy; Keyframe Sports {new Date().getFullYear()}</div>
                </div>
            </div>
        </div>
    );
};

export const LoginAndRegister = compose(
    withStyles(styles),
    withLocalState
)(loginAndRegister);
