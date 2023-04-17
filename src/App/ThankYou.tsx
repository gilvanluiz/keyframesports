import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Box,
    withStyles,
    Theme as ITheme,
} from '@material-ui/core';
import services from '../Api/services';
import CheckIcon from '../Assets/check.png';
import LogoutIcon from '../Assets/logout.png';

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
    actionButton: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        fontSize: theme.spacing(2),
        marginLeft: 'auto',
        borderRadius: theme.spacing(1),
        padding: `0px ${theme.spacing(2.5)}px`,
        minWidth: theme.spacing(25),
        fontWeight: 'bold' as 'bold',
    },
    message: {
        height: `calc(85vh - ${theme.spacing(8)}px)`,
        maxHeight: `calc(100vh - ${theme.spacing(8)}px)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column' as 'column',
    },
});

const thankYou = ({ classes, location, match, history }: any) => {
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const success = location.pathname.toLowerCase().indexOf('success') !== -1;

    useEffect(() => {
        const orderId = new URLSearchParams(location.search).get('order-id');

        if (success && orderId) {
            services
                .confirmCheckoutSession({
                    'order-id': orderId,
                })
                .then(() => setOrderConfirmed(true));
        }
    }, []);

    return (
        <Box className={classes.container}>
            <Box className={classes.header}>
                <Box className={classes.title}>
                    {success
                        ? 'Thank you for purchasing'
                        : 'Order has been canceled'}
                </Box>
                <Button
                    aria-label={success ? 'Get Started' : 'Go Back'}
                    className={classes.actionButton}
                    disabled={success && !orderConfirmed}
                    onClick={(e) =>
                        history.push(success ? '/' : '/payments/make-payment')
                    }
                    startIcon={
                        <img
                            src={success ? CheckIcon : LogoutIcon}
                            alt='got it'
                            width='24'
                            height='24'
                        />
                    }
                >
                    {success ? 'Get Started' : 'Go Back'}
                </Button>
            </Box>
            <Box className={classes.message}>
                <Typography variant='h4'>
                    {success
                        ? 'Your order was completed successfully'
                        : 'An error occurred while processing your order'}
                </Typography>
            </Box>
        </Box>
    );
};

export const ThankYou = withStyles(styles)(thankYou);
