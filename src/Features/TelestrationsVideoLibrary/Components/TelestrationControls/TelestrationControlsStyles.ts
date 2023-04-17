import { Theme as ITheme } from '@material-ui/core/styles';

const drawerWidth = 240;

export const styles = (theme: ITheme) => ({
    root: {
        zIndex: 1,
        top: 0,
        left: 0,
        borderRadius: '0px',
        width: '100%',

        [theme.breakpoints.down('md')]: {
            overflow: 'auto',
        },
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        '&.closed': {
            width: theme.spacing(9),
        },
    },
    drawerPaper: {
        width: drawerWidth,
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
    hideToolsAdjustmentDrawer: {
        position: 'absolute' as 'absolute',
        bottom: '0px',
        left: '44.7%',
        paddingBottom: '12px',
        cursor: 'pointer' as 'pointer',
        '& > .icon': {
            width: theme.spacing(3),
            height: theme.spacing(3),
            cursor: 'pointer',
        },
    },
    actionButton: {
        cursor: 'pointer' as 'pointer',
        textTransform: 'uppercase' as 'uppercase',
        '&:hover': {
            background: 'rgba(255, 255, 255, .5)',
        },
        marginLeft: 8,
    },
    tooltip: {
        width: '50px',
        height: '50px',
        padding: '2px',
        margin: '10px',
    },
    cardBodyPadding: {
        padding: 0,
    },
    controls: {
        zIndex: 2,
        bottom: '175px',
        display: 'flex',
        position: 'absolute' as 'absolute',
        transition: 'margin .5s',
    },
    buttons: {
        background: 'rgba(255, 255, 255, .5)',
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
    keyframeLogo: {
        maxHeight: theme.spacing(4.5),
        cursor: 'pointer',
    },
    divider: {
        height: '40px',
        marginTop: '15px',
        backgroundColor: 'black',
        border: '0.5px solid white',
    },
    toolCheckmark: {
        position: 'absolute' as 'absolute',
        width: '25px',
        height: '25px',
        bottom: '-8px',
        right: '-5px',
    },
    slider: {
        color: 'white',
    },
    thumb: {
        '&:hover': { boxShadow: '0px 0px 0px 8px rgb(255 255 255 / 16%)' },
        '&:active': { boxShadow: '0px 0px 0px 12px rgb(255 255 255 / 16%)' },
    },
    toolTypeContainer: {
        marginTop: '10px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-around',
    },
    iconButtonDrawer: {
        color: 'white',
        backgroundColor: 'white',
        width: '80px',
        height: '29px',
        border: '2px solid white',
        borderRadius: '10px',
        '&:hover': {
            backgroundColor: 'white',
            border: '2px solid rgba(255, 0, 0, .5)',
        },
    },
    iconButtonDrawerActive: {
        border: '2px solid rgba(255, 0, 0, .5)',
    },
    toolTypeLine: {
        width: '100%',
        height: '100%',
        border: '2px solid black',
        backgroundColor: 'black',
    },
    toolTypeDash: {
        width: '9px',
        height: '4px',
        backgroundColor: 'black',
        marginRight: '2px',
        marginLeft: '2px',
    },
});
