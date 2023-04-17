import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    Box,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
} from '@material-ui/core';
import { RouteComponentProps as IRouteComponentProps } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import services from '../Api/services';
import { subscribeGoToStripe, subscribeMounted } from './UserEvents';
import { sendUserEvent } from './UserEvents/UserEventManager';
import { PackagesList } from './Packages/PackagesList';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK as string);

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
    checkoutButton: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        fontSize: theme.spacing(2),
        marginLeft: 'auto',
        borderRadius: theme.spacing(1),
        padding: `0px ${theme.spacing(2.5)}px`,
        minWidth: theme.spacing(25),
        fontWeight: 'bold' as 'bold',
        '&.purchase': {
            fontSize: theme.spacing(3),
        },
    },
    message: {
        height: `calc(100vh - ${theme.spacing(8)}px)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap' as 'wrap',
        overflow: 'auto',
        flexDirection: 'row' as 'row',
    },
});

const payment = ({ classes, location }: IWithStyles & IRouteComponentProps) => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        sendUserEvent(subscribeMounted, window.location.href);
    }, []);

    const handleClick = async () => {
        console.log('clicked');
        sendUserEvent(subscribeGoToStripe, window.location.href);
        try {
            setLoading(true);
            const stripe = await stripePromise;
            const { data } = await services.checkoutSession({
                quantity: 1,
            });

            if (stripe && data) {
                const result = await stripe.redirectToCheckout({
                    sessionId: data['user-management.order/stripe-session-id'],
                });

                if (result.error) {
                    setLoading(false);
                }
            }
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <Box className={classes.container}>
            <Box className={classes.header}>
                <Box className={classes.title}>Buy a licence</Box>
            </Box>
            <Box className={classes.message}>
                <PackagesList loading={loading} handleCheckout={handleClick} />
            </Box>
        </Box>
    );
};
export const Payment = withStyles(styles)(payment);
