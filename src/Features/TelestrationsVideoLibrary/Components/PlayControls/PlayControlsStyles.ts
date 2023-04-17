import { Theme } from '@material-ui/core/styles';

export const PlayControlsStyles = (theme: Theme) => ({
    container: {
        background: theme.palette.primary.dark,
    },
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as 'column',
        background: theme.palette.primary.dark,
    },
    buttonRow: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlMainContainer: {
        display: 'grid',
        gridTemplateColumns: '200px auto 300px',
        height: 50,
    },
    volumeSlider: {
        padding: 0,
    },
    videoTitle: {
        margin: 'auto auto auto 8px',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        maxWidth: '240px',
        whiteSpace: 'nowrap' as 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontWeight: 'bold' as 'bold',
        fontSize: '1rem',
    },
    videoTime: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#ffffff',
        fontSize: '1rem',
        marginRight: '35%',
    },
    soundContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    popover: {
        pointerEvents: 'none' as 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
    iconButton: {
        padding: '9px',
    },
});
export const sliderStyles = () => ({
    root: {
        marginRight: 70,
        marginTop: 10,
        height: 4,
        width: '50px',
    },
    thumb: {
        height: 13,
        width: 13,
        backgroundColor: '#ec4e45',
        border: '3px solid #ec4e45',
        marginTop: -6,
        marginLeft: 0,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    track: {
        backgroundColor: '#fff',
        marginTop: -2,
        height: 4,
    },
    rail: {
        backgroundColor: 'grey',
        width: 'calc(100% + 8px)',
        marginTop: -2,
        height: 4,
    },
});
