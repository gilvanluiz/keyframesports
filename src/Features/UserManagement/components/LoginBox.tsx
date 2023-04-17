import * as React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import { ILoginForm } from './types';

const styles = (theme: any) => ({
    field: {
        width: '100%',
        marginTop: '20px',
        borderRadius: '0px',
        '& div': {
            borderRadius: '0px',
        },
        '& input': {
            background: '#fff',
            color: '#000',
            borderRadius: '0px',
        },
    },
    submitBtnWrapper: {
        textAlign: 'left' as 'left',
    },
    submitBtn: {
        fontWeight: 'bold' as 'bold',
    },
    errors: {
        border: '3px solid red',
    },
    message: {
        padding: '10px 0px',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
    },
    link: {
        color: '#C3FDFE',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
});

interface IProps {
    classes: any;
    onSubmit: (method: string) => void;
    form: ILoginForm;
    onChange: (
        form: 'login' | 'register',
        field: string
    ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    emailIsInvalid: (form: 'login' | 'register') => boolean;
    formIsDisabled: (form: 'login' | 'register') => boolean;
}

export const loginBox = ({
    classes,
    form,
    onChange,
    onSubmit,
    emailIsInvalid,
    formIsDisabled,
}: IProps) => {
    return (
        <>
            <form>
                <TextField
                    className={classes.field}
                    required
                    variant='outlined'
                    id='username'
                    onChange={onChange('login', 'username')}
                    value={form.username}
                    placeholder='Email *'
                    error={form.errors.state || emailIsInvalid('login')}
                    helperText={
                        emailIsInvalid('login') ? 'Email is not valid' : ''
                    }
                    type='email'
                />
                <TextField
                    className={classes.field}
                    required
                    variant='outlined'
                    type='password'
                    id='password'
                    onChange={onChange('login', 'password')}
                    value={form.password}
                    placeholder='Password *'
                    error={form.errors.state}
                    helperText={form.errors.serverErrors}
                />
                <div className={classes.message}>
                    <span>Don't have an account yet?</span>
                    <Link to='/register' className={classes.link}>
                        Register now
                    </Link>
                </div>
                <div className={classes.submitBtnWrapper}>
                    <Button
                        disabled={formIsDisabled('login')}
                        variant='contained'
                        color='primary'
                        onClick={() => onSubmit('login')}
                        className={classes.submitBtn}
                    >
                        Log In
                    </Button>
                </div>
            </form>
        </>
    );
};

export const LoginBox = withStyles(styles)(loginBox);
