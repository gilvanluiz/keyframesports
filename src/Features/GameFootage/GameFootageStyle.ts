import { Theme as ITheme } from '@material-ui/core';

export const styles = (theme: ITheme) => ({
    drawer: {
        width: theme.leftSideWidth,
        position: 'relative' as 'relative',
    },
    drawerPaper: {
        width: theme.leftSideWidth,
    },
    toolbar: {
        maxHeight: '60px',
    },
    toolbarTitle: {
        padding: theme.spacing(1),
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    keyframeLogo: {
        maxHeight: '20px',
        margin: '10px',
        cursor: 'pointer',
    },
    user: {
        width: '65%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    userInfo: {
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        minHeight: 'calc(100% - 0px)',
    },
    userAvatar: {
        height: theme.spacing(3),
        width: theme.spacing(3),
    },
    logout: {
        width: '145px',
        top: '47px',
        position: 'absolute' as 'absolute',
        background: '#303030',
        display: 'flex',
        flexDirection: 'column' as 'column',
        transition: 'height .2s linear',
        zIndex: 1,
        '& > div': {
            boxShadow: `0px 0px 2px 1px inset ${theme.palette.primary.dark}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '30px',
            '&:hover': {
                background: '#353535',
                cursor: 'pointer',
            },
        },
    },
});
