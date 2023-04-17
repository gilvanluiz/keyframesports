import * as React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

import {
    Button,
    TextField,
    Checkbox,
    Theme as ITheme,
    WithStyles as IWithStyles,
    FormControl,
    Select,
    MenuItem,
    Typography,
    InputLabel,
} from '@material-ui/core';
import { IRegisterForm } from './types';

const styles = (theme: ITheme) => ({
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
    text: {
        marginTop: '20px',
        color: 'white',
    },
    formControl: {
        minWidth: 120,
    },
    greeting: {
        color: '#fff',
        fontSize: '1em',
        width: '120%',
        marginBottom: '10px',
        fontWeight: 100,
    },
    submitBtnWrapper: {
        textAlign: 'left' as 'left',
    },
    errorLabel: {
        marginBottom: '10px',
    },
    submitBtn: {
        fontWeight: 'bold' as 'bold',
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
    emailOptIn: {
        display: 'flex',
        color: '#fff',
        justifyContent: 'start',
        alignItems: 'center',
        marginLeft: '-11px',
    },
});

interface IProps extends IWithStyles {
    onSubmit: (method: string) => void;
    form: IRegisterForm;
    onChange: (
        form: 'login' | 'register',
        field: string
    ) => (e: React.ChangeEvent<HTMLInputElement>) => void;

    emailIsInvalid: (form: 'login' | 'register') => boolean;
    formIsDisabled: (form: 'login' | 'register') => boolean;
}

export const registerBox = ({
    classes,
    form,
    onChange,
    onSubmit,
    emailIsInvalid,
    formIsDisabled,
}: IProps) => {
    const handleChange = (a: any, b: any, e: any, r: any) => {
        console.log('a', a);
        console.log('b', b);
        console.log('e', e);
        console.log('r', r);

        const register = onChange('register', 'phone');
        return register(e);
    };
    // const [phone, setPhone] = React.useState(form.phone);
    return (
        <>
            <form>
                <TextField
                    required
                    className={classes.field}
                    variant='outlined'
                    id='firstName'
                    onChange={onChange('register', 'firstName')}
                    value={form.firstName}
                    placeholder='First name'
                    error={form.errors.state}
                />

                <TextField
                    required
                    className={classes.field}
                    variant='outlined'
                    id='lastName'
                    onChange={onChange('register', 'lastName')}
                    value={form.lastName}
                    placeholder='Last name'
                    error={form.errors.state}
                />
                <TextField
                    required
                    className={classes.field}
                    variant='outlined'
                    id='organizationName'
                    onChange={onChange('register', 'organizationName')}
                    value={form.organizationName}
                    placeholder='Organization name'
                    error={form.errors.state}
                />

                <TextField
                    required
                    className={classes.field}
                    variant='outlined'
                    id='email'
                    onChange={onChange('register', 'email')}
                    value={form.email}
                    placeholder='Email *'
                    error={form.errors.state || emailIsInvalid('register')}
                    helperText={
                        emailIsInvalid('register') ? 'Email is not valid' : ''
                    }
                />
                <TextField
                    className={classes.field}
                    required
                    variant='outlined'
                    type='password'
                    id='password'
                    onChange={onChange('register', 'password')}
                    value={form.password}
                    placeholder='Password *'
                    error={form.errors.state}
                />

            <PhoneInput
                    placeholder='Phone number'
                    id='phone'
                    value={form.phone}
                    onChange={handleChange}
                    inputStyle={{
                        borderRadius: 0,
                        marginTop: '20px',
                        width: '350px',
                    }}
                    buttonStyle={{
                        marginTop: '20px',
                    }}
                    country={'us'}
                    specialLabel=''
                    error={form.errors.state}
                    inputProps={{
                        name: 'phone',
                    }}
                    />

                <Typography className={classes.text}>
                    What role describes you best?
                </Typography>
                <FormControl className={classes.formControl}>
                    <Select
                        id='role'
                        value={form.role.select}
                        onChange={onChange('register', 'role')}
                        name='select'
                    >
                        <MenuItem value='operations-director'>
                            Operations Director
                        </MenuItem>
                        <MenuItem value='analyst'>Analyst</MenuItem>
                        <MenuItem value='coach'>Coach</MenuItem>
                        <MenuItem value='content-producer'>
                            Content Producer
                        </MenuItem>
                        <MenuItem value='other'>
                            Other (Please specify)
                        </MenuItem>
                    </Select>
                </FormControl>
                {form.role.select === 'other' && (
                    <TextField
                        name='other'
                        className={classes.field}
                        variant='outlined'
                        id='role'
                        onChange={onChange('register', 'role')}
                        value={form.role.other}
                        placeholder='Specify your role'
                    />
                )}
                <Typography className={classes.text}>
                    What do you hope to achieve by using Keyframe?
                </Typography>
                <FormControl className={classes.formControl}>
                    <Select
                        id='purpose'
                        value={form.purpose.select}
                        onChange={onChange('register', 'purpose')}
                        name='select'
                    >
                        <MenuItem value='player-development'>
                            Create analysis to help develop my players
                        </MenuItem>
                        <MenuItem value='prepare-for-opposition'>
                            Create analysis to highlight strengths or weaknesses
                            of my opponents
                        </MenuItem>
                        <MenuItem value='content-creation'>
                            Create content to increase followers on social media
                        </MenuItem>
                        <MenuItem value='other'>
                            Other (Please specify)
                        </MenuItem>
                    </Select>
                </FormControl>
                {form.purpose.select === 'other' ? (
                    <TextField
                        name='other'
                        className={classes.field}
                        variant='outlined'
                        id='purpose'
                        onChange={onChange('register', 'purpose')}
                        value={form.purpose.other}
                        placeholder='Specify your purpose'
                    />
                ) : null}
                <Typography className={classes.text}>
                    Where did you hear about Keyframe Sports?
                </Typography>
                <FormControl className={classes.formControl}>
                    <Select
                        id='referral-source'
                        value={form['referral-source'].select}
                        onChange={onChange('register', 'referral-source')}
                        name='select'
                    >
                        <MenuItem value='twitter'>Twitter</MenuItem>
                        <MenuItem value='facebook'>Facebook</MenuItem>
                        <MenuItem value='instagram'>Instagram</MenuItem>
                        <MenuItem value='youtube'>Youtube</MenuItem>
                        <MenuItem value='search-engine'>
                            Search engine (Google etc)
                        </MenuItem>
                        <MenuItem value='word-of-mouth'>Word of mouth</MenuItem>
                        <MenuItem value='other'>
                            Other (Please specify)
                        </MenuItem>
                    </Select>
                </FormControl>
                {form['referral-source'].select === 'other' ? (
                    <TextField
                        name='other'
                        className={classes.field}
                        variant='outlined'
                        id='referral-source'
                        onChange={onChange('register', 'referral-source')}
                        value={form['referral-source'].other}
                    />
                ) : null}
                <span className={classes.emailOptIn}>
                    <Checkbox
                        checked={form.emailOptIn}
                        style={{ color: '#fff' }}
                        onChange={onChange('register', 'emailOptIn')}
                    />
                    Receive emails from Keyframe
                </span>
                <div className={classes.message}>
                    <span>Already have login and password?</span>
                    <Link to='/login' className={classes.link}>
                        Sign in
                    </Link>
                </div>
                <div className={classes.submitBtnWrapper}>
                    <InputLabel
                        error={form.errors.state}
                        className={classes.errorLabel}
                    >
                        {form.errors.serverErrors}
                    </InputLabel>
                    <Button
                        disabled={formIsDisabled('register')}
                        variant='contained'
                        color='primary'
                        onClick={() => onSubmit('register')}
                        className={classes.submitBtn}
                    >
                        Sign Up
                    </Button>
                </div>
            </form>
        </>
    );
};

export const RegisterBox = withStyles(styles)(registerBox);
