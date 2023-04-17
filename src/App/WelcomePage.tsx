import * as React from 'react';
import {
    Button,
    Box,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
} from '@material-ui/core';
import { RouteComponentProps as IRouteComponentProps } from 'react-router-dom';
import { s3KeyToUrl } from '../Utilities/Aws';
import { tutorial } from '../Assets/video';
import CheckIcon from '../Assets/check.png';

const styles = (theme: ITheme) => ({
    container: {
        height: '100%',
        width: '100%',
    },
    content: {
        display: 'flex',
        flexDirection: 'column' as 'column',
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
    gotItButton: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        fontSize: theme.spacing(2),
        marginLeft: 'auto',
        borderRadius: theme.spacing(1),
        padding: `0px ${theme.spacing(2.5)}px`,
        minWidth: theme.spacing(25),
        fontWeight: 'bold' as 'bold',
    },
    video: {
        background: theme.palette.common.black,
        height: `calc(100vh - ${theme.spacing(8)}px)`,
        maxHeight: `calc(100vh - ${theme.spacing(8)}px)`,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        '& > video': {
            width: '100%',
            height: '100%',
        },
    },
});

const welcomePage = ({
    classes,
    history,
}: IWithStyles & IRouteComponentProps) => {
    const videoRef = React.createRef<HTMLVideoElement>();

    return (
        <Box className={classes.container}>
            <Box className={classes.content}>
                <Box className={classes.header}>
                    <Box className={classes.title}>Keyframe</Box>
                    <Button
                        aria-label='Got It'
                        className={classes.gotItButton}
                        onClick={() => history.push('/video-library')}
                        startIcon={
                            <img
                                src={CheckIcon}
                                alt='got it'
                                width='24'
                                height='24'
                            />
                        }
                    >
                        Got It!
                    </Button>
                </Box>
                <Box className={classes.video}>
                    <video
                        ref={videoRef}
                        src={s3KeyToUrl(tutorial.s3_key).video_url}
                        controls
                    />
                </Box>
            </Box>
        </Box>
    );
};

export const WelcomePage = withStyles(styles)(welcomePage);
