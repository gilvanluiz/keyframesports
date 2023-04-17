import { makeStyles } from '@material-ui/core';

export const styles = makeStyles((theme) => ({
    package: {
        backgroundColor: 'white',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)',
        borderRadius: '15px',
        margin: 10,
        display: 'flex',
        width: 270,
        flexDirection: 'column',
        overflow: 'hidden',
        height: 500,
    },
    packageHeadWrapper: {
        backgroundColor: theme.palette.primary.main,
        height: 96,
        color: 'white',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    packageAbout: {
        color: 'black',
    },
    packageName: {
        fontWeight: 700,
        display: 'flex',
        flexDirection: 'column',
    },
    packageContainer: {
        margin: '52px auto auto 35px;',
    },
    pricePerUser: {
        position: 'absolute',
        display: 'flex',
        width: '84px',
        height: '20px',
        top: '-30px',
        background: theme.palette.primary.main,
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '10px',
        justifyContent: 'center',
        color: 'white',
        alignItems: 'center',
    },
    perYear: {
        marginLeft: '24px',
    },
    priceContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: '"row"' as 'row',
    },
    dollarSign: {
        alignSelf: 'flex-start',
    },
    price: {
        fontWeight: 700,
    },
    features: {
        height: '147px',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '36px',
        marginBottom: '36px',
    },
    featureContainer: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row' as 'row',
        marginBottom: '17px',
    },
    checkMark: {
        fontWeight: 'bold',
        fontSize: '1rem',
        alignSelf: 'center',
        marginRight: '10.5px',
    },
    chooseButton: {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        width: '84%',
        borderRadius: '8px',
        '&:hover': {
            backgroundColor: '#e8101a',
        },
    },
}));
