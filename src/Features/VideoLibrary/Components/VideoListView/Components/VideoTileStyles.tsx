import { Theme as ITheme } from '@material-ui/core';

export const VideoTileStyles = (theme: ITheme) => ({
    container: {
        backgroundColor: theme.palette.primary.dark,
        position: 'relative' as 'relative',
        height: 'fit-content',
        borderRadius: theme.spacing(1),
        width: '31%',
        minWidth: theme.spacing(41),
        margin: '1%',
    },
    tile: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    thumbnail: {
        width: '100%',
        overflow: 'hidden',
        borderTopLeftRadius: theme.spacing(1),
        borderTopRightRadius: theme.spacing(1),
        height: theme.spacing(25.875),
        transition: 'height 0.5s ease-out',
        '&.extended': {
            height: theme.spacing(29.5),
        },
        '& > span': {
            display: 'none',
            '&.loading': {
                height: '-webkit-fill-available',
                display: 'block',
            },
        },
        '& > div': {
            width: '100%',
            height: '100%',
            display: 'block',
            cursor: 'pointer',
            '&.loading': {
                display: 'none',
            },
            '& > video': {
                height: '100%',
                objectFit: 'initial',
            },
        },
    },
    info: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        color: '#b8b8b8',
        margin: theme.spacing(2),
    },
    duration: {
        display: 'flex',
        alignItems: 'center',
        '& > span': {
            marginLeft: theme.spacing(0.5),
        },
    },
    recent: {
        marginLeft: 'auto',
        fontSize: '0.8em',
        fontWeight: 'bold' as 'bold',
        textTransform: 'uppercase' as 'uppercase',
        color: theme.palette.secondary.main,
    },
    title: {
        fontWeight: 400,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as 'nowrap',
        padding: theme.spacing(0.5),
    },
    subtitle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxHeight: theme.spacing(7.5),
        whiteSpace: 'nowrap' as 'nowrap',
    },
    actions: {
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'start',
    },
    action: {
        borderRadius: theme.spacing(1),
        padding: theme.spacing(1),
        margin: theme.spacing(0.5),
    },
    telestrate: {
        padding: theme.spacing(1),
        margin: theme.spacing(0.5),
        color: theme.palette.primary.main,
        marginLeft: 'auto',
        textTransform: 'capitalize' as 'capitalize',
        borderRadius: theme.spacing(1),
    },
});
