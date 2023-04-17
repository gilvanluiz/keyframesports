import { Theme as ITheme } from '@material-ui/core';

const drawerSpacing = 30;
export const styles = (theme: ITheme) => ({
    drawer: {
        width: theme.spacing(drawerSpacing),
        flexShrink: 0,
    },
    drawerPaper: {
        width: theme.spacing(drawerSpacing),
        transition: 'width 0.5s ease-out',
        overflow: 'hidden',
        '&.closed': {
            width: theme.spacing(9),
        },
    },
    toolbar: theme.mixins.toolbar,
    toolbarTitle: {
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
    },
    keyframeLogo: {
        maxHeight: theme.spacing(4.5),
        cursor: 'pointer',
    },
    navLinks: {
        padding: theme.spacing(1),
    },
    licenceButtonContainer: {
        display: 'flex',
        flexGrow: 1,
        alignItems: 'flex-end',
        marginBottom: '21px',
    },
    licenceButton: {
        whiteSpace: 'nowrap' as 'nowrap',
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        textTransform: 'uppercase' as 'uppercase',
        borderRadius: theme.spacing(1),
        margin: 4,
        width: theme.spacing(drawerSpacing),
        height: '35px',
        fontWeight: 'bold' as 'bold',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
        },
    },
    licenceButtonText: {
        overflow: 'hidden',
    },
    hideMenu: {
        marginTop: 'auto',
        textAlign: 'center' as 'center',
        minHeight: theme.spacing(5),
        '& > .icon': {
            width: theme.spacing(3),
            height: theme.spacing(3),
            cursor: 'pointer',
        },
    },
    transitionText: {
        marginLeft: '4px',
        transition: 'display 0.5s ease-out',
    },
});
