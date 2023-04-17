import { Theme as ITheme } from '@material-ui/core/styles';

const drawerWidth = 240;

export const styles = (theme: ITheme) => ({
    root: {
        zIndex: 1,
        borderRadius: '0px',
        width: '100%',
        [theme.breakpoints.down('md')]: {
            overflow: 'auto',
        },
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    toolbarTitle: {
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
    },
    cardBody: {
        display: 'flex',
        padding: '0 15%',
        justifyContent: 'space-around',
        [theme.breakpoints.down('md')]: {
            justifyContent: 'flex-start',
        },
    },
    iconButton: {
        height: 'fit-content',
        '&:hover': {
            background: 'rgba(255, 0, 0, .5)',
        },
    },
    iconButtonActive: {
        height: 'fit-content',
        color: 'black',
        backgroundColor: 'rgb(255, 0, 0)',
        '&:hover': {
            background: 'rgba(255, 0, 0, .5)',
        },
    },
    iconTool: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as 'cover',
    },
    snackbarMessage: {
        display: 'flex',
        alignItems: 'center',
    },
    actionButton: {
        cursor: 'pointer' as 'pointer',
        textTransform: 'uppercase' as 'uppercase',
        '&:hover': {
            background: 'rgba(255, 255, 255, .5)',
        },
    },
    tooltip: {
        width: '50px',
        height: '50px',
        padding: '2px',
        margin: '10px',
    },
    cardBodyPadding: {
        padding: '0px 5%',
    },
    controls: {
        zIndex: 2,
        display: 'flex',
        position: 'absolute' as 'absolute',
        transition: 'margin .5s',
    },
    buttons: {
        background: 'rgba(255, 255, 255, .5)',
    },
    toggleControls: {
        width: '75px',
        height: '75px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '0 50% 50% 0',
        background: 'rgba(255, 255, 255, .5)',
    },
    toggleControlsIcon: {
        marginLeft: '20%',
        fontSize: '3em',
    },
    snackbarContainer: {
        background: theme.palette.primary.dark,
    },
});
