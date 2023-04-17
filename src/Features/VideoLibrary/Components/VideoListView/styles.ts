import { Theme as ITheme } from '@material-ui/core';

export const styles = (theme: ITheme) => {
    return {
        message: {
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        container: {
            width: '100%',
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
        sort: {
            marginLeft: theme.spacing(4),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            textTransform: 'none' as 'none',
            '& > span': {
                marginRight: theme.spacing(1.5),
            },
        },
        uploadButton: {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.primary.main,
            fontSize: theme.spacing(2),
            marginLeft: 'auto',
            borderRadius: theme.spacing(1),
            padding: `0px ${theme.spacing(2.5)}px`,
            fontWeight: 'bold' as 'bold',
        },
        scrollBar: {
            minHeight: `calc(100vh - ${theme.spacing(8)}px)`,
            height: `calc(100vh - ${theme.spacing(8)}px)`,
            display: 'flex',
            flexWrap: 'wrap' as 'wrap',
            overflowX: 'hidden' as 'hidden',
            overflowY: 'scroll' as 'scroll',
            '&::-webkit-scrollbar': {
                width: '0.8em',
                backgroundColor: 'grey',
                borderRadius: theme.spacing(1.25),
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: '#424242',
                borderRadius: theme.spacing(1.25),
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.common.white,
                borderRadius: theme.spacing(1.25),
            },
            [theme.breakpoints.down('sm')]: {
                justifyContent: 'center',
            },
        },
    };
};
