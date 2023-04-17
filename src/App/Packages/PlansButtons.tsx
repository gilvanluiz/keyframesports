import { Box, Button, Typography } from '@material-ui/core';
import * as React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { styles } from './PlansButtonsStyles';
import { useHistory } from 'react-router';
import services from 'src/Api/services';

interface IProps {
    loading: boolean;
    packageData: any;
    handleCheckout: () => void;
    openSuccessModal: () => void;
}

interface IData {
    packageTitle: string;
    packageSubtitle: string;
    pricePerUser: number;
    checkoutPrice: number;
    features: [];
    usersQuantity: number;
}

const userName = localStorage.getItem('username');

export const PlansButtons = ({
    loading,
    packageData,
    handleCheckout,
    openSuccessModal,
}: IProps) => {
    const {
        packageTitle,
        packageSubtitle,
        pricePerUser,
        checkoutPrice,
        features,
        usersQuantity,
    }: IData = packageData;

    const classes = styles();
    const history = useHistory();

    function handleClick() {
        if (checkoutPrice === 149.99) {
            handleCheckout();
        }
        const data = { email: userName, users: usersQuantity };
        services
            .sendCallBackRequest(data)
            .then(() => {
                openSuccessModal();
            })
            .catch((error: any) => {
                console.error(error);
                history.push('/report-problem');
            });
    }

    return (
        <Box className={classes.package}>
            <Box className={classes.packageHeadWrapper}>
                <Typography variant='h5' className={classes.packageName}>
                    {packageTitle}
                </Typography>
                <Typography variant='subtitle2'>{packageSubtitle}</Typography>
            </Box>
            <Box className={classes.packageAbout}>
                <Box className={classes.packageContainer}>
                    <Box>
                        <Box
                            component='span'
                            className={classes.priceContainer}
                        >
                            {pricePerUser !== 0 && (
                                <Box className={classes.pricePerUser}>
                                    ${pricePerUser} per user
                                </Box>
                            )}
                            <AttachMoneyIcon className={classes.dollarSign} />
                            <Typography variant='h4' className={classes.price}>
                                {checkoutPrice.toFixed(2)}
                            </Typography>
                        </Box>
                        <Box component='span' className={classes.perYear}>
                            per year
                        </Box>
                    </Box>
                    <Box className={classes.features}>
                        {features.map((feature, index) => (
                            <Box
                                key={index}
                                className={classes.featureContainer}
                            >
                                <CheckIcon
                                    color='error'
                                    className={classes.checkMark}
                                />
                                <Box component='span'>{feature}</Box>
                            </Box>
                        ))}
                    </Box>
                    <Button
                        className={classes.chooseButton}
                        disabled={loading}
                        onClick={handleClick}
                    >
                        {checkoutPrice === 149.99
                            ? 'Buy a licence'
                            : 'Contact us'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
