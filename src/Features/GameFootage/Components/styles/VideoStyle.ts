import { Theme as ITheme } from '@material-ui/core';

export const styles = (theme: ITheme) => ({
    container: {
        padding: `${theme.spacing(1.5)}px 0px ${theme.spacing(
            1.5
        )}px ${theme.spacing(2.5)}px`,
    },
    video: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    videoInfo: {
        width: '46%',
        maxWidth: theme.spacing(18.5),
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column' as 'column',
    },
    videoActions: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 'auto',
        minHeight: theme.spacing(3),
    },
    videoDeleteDownload: {
        display: 'flex',
        alignItems: 'flex-end',
        width: '50%',
        '& > div:first-child': {
            marginRight: theme.spacing(1.5),
        },
        marginRight: theme.spacing(1),
    },
    videoTitle: {
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal' as 'normal',
        fontSize: theme.spacing(1.1),
    },
    videoThumbnailContainer: {
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, .12)',
    },
    videoThumbnail: {
        width: '100%',
        border: '1px solid rgba(255, 255, 255, .12)',
        objectFit: 'cover' as 'cover',
    },
    videoSelected: {
        background: 'rgba(255, 255, 255, .12)',
    },
    videoIndicators: {
        minWidth: theme.spacing(2.5),
    },
    indicator: {
        marginBottom: theme.spacing(0.5),
        width: theme.spacing(0.75),
        height: theme.spacing(0.75),
        background: theme.palette.primary.main,
        borderRadius: '50%',
        '&:last-child': {
            background: theme.palette.secondary.main,
        },
    },
    videoTools: {
        paddingRight: theme.spacing(2.5),
        marginTop: theme.spacing(2),
    },
    toolAction: {
        marginTop: theme.spacing(1.5),
        marginBottom: theme.spacing(1.5),
    },
    toolActionName: {
        width: theme.spacing(7.5),
    },
    flex: {
        display: 'flex',
    },
    center: {
        alignItems: 'center',
    },
    column: {
        flexDirection: 'column' as 'column',
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
});
