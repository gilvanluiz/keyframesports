import { Theme as ITheme } from '@material-ui/core/styles';
export const TelestratedVideosStyles = (theme: ITheme) => ({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as 'column',
        textAlign: 'center' as 'center',
        overflow: 'auto',
    },
    header: {
        marginTop: '25px',
        width: '100%',
        textAlign: 'center' as 'center',
    },
    content: {
        marginTop: '25px',
    },
    userCard: {
        margin: '10px 20px',
    },
    collapse: {
        paddingBottom: '20px',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'row' as 'row',
        flexWrap: 'wrap' as 'wrap',
        justifyContent: 'space-around',
    },
    videoContainer: {
        width: '40%',
        marginTop: '15px',
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: 1,
        }),
    },
});
