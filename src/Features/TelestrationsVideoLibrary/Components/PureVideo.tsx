import {
    Box,
    CircularProgress,
    Typography,
    withStyles,
    WithStyles as IWithStyles,
} from '@material-ui/core';
import { flow } from 'fp-ts/lib/function';
import * as React from 'react';
import { useState } from 'react';
import { ILocalStateMgr, withLocalState } from 'src/App/LocalState';

interface IPureVideoProps {
    handleVideoLoad: () => void;
    videoRef: React.RefObject<HTMLVideoElement>;
    src: string;
    onError: (message: string) => void;
    className: string;
    videoLoading: boolean;
    localStateMgr: ILocalStateMgr;
}

const styles = () => ({
    spinnerContainer: {
        visibility: 'visible' as 'visible',
        position: 'absolute' as 'absolute',
        top: '50%',
    },
    spinnerText: {
        textAlign: 'center' as 'center',
        position: 'absolute' as 'absolute',
        top: '15px',
        left: '13px',
    },
});

const pureVideo: React.FC<IPureVideoProps & IWithStyles> = ({
    videoRef,
    src,
    handleVideoLoad,
    onError,
    videoLoading,
    className,
    classes,
    localStateMgr,
}) => {
    const [progress, setProgress] = useState(10);

    if (!videoRef) {
        throw Error('No video reference');
    }

    React.useEffect(() => {
        if (videoRef.current && localStateMgr.state.isTouchDevice) {
            // autoplay necessary for firing onLoadedData on mobile
            videoRef.current.autoplay = true;
        }
    }, []);

    return (
        <>
            {videoLoading && (
                <Box
                    className={classes.spinnerContainer}
                    style={{
                        left: localStateMgr.state.leftSideMenuOpen
                            ? 'calc(105px + 50%)'
                            : 'calc(50%)',
                    }}
                >
                    <Box>
                        <CircularProgress color='primary' size={50} />
                        <Typography
                            className={classes.spinnerText}
                            variant='caption'
                            component='div'
                            color='textSecondary'
                        >
                            {progress + '%'}
                        </Typography>
                    </Box>
                </Box>
            )}
            <video
                muted
                crossOrigin='anonymous'
                ref={videoRef}
                onError={(event: any) => {
                    const { target } = event;
                    const message = (target as HTMLVideoElement).error?.message;
                    const errorCode = (target as HTMLVideoElement).error?.code;
                    if (message) {
                        onError(`${message}. MediaError code ${errorCode}`);
                    } else {
                        onError(`Video error. MediaError code ${errorCode}`);
                    }
                }}
                className={className}
                onLoadedData={async () => {
                    handleVideoLoad();
                }}
                onProgress={() => {
                    if (videoLoading) {
                        if (progress < 85) {
                            setProgress((prev) => prev + 25);
                        }
                        if (progress >= 85 && progress < 90) {
                            setProgress((prev) => prev + 5);
                        }
                        if (progress >= 90 && progress < 100) {
                            setProgress((prev) => prev + 2);
                        }
                    }
                }}
            >
                <source src={src} type='video/mp4' />
            </video>
        </>
    );
};

export const PureVideo = flow(withLocalState, withStyles(styles))(pureVideo);
