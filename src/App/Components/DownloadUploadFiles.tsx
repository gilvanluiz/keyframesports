import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Box,
    Collapse,
    Slide,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
} from '@material-ui/core';
import {
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
} from '@material-ui/icons';
import { compose } from 'fp-ts/lib/function';
import { withLocalState, ILocalStateMgr } from '../../App/LocalState';
import { StyledCircularProgress } from './StyledCircularProgress';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

const styles = (theme: ITheme) => ({
    container: {
        overflow: 'hidden',
        paddingTop: theme.spacing(1.25),
        left: '0px',
        bottom: '0px',
        width: theme.leftSideWidth - 1,
        position: 'absolute' as 'absolute',
        zIndex: 1300,
    },
    shadowContainer: {
        background: theme.palette.primary.dark,
        boxShadow: `0px ${theme.spacing(0.25)}px ${theme.spacing(
            1
        )}px ${theme.spacing(0.5)}px ${theme.palette.common.black}`,
    },
    wrapper: {
        display: 'flex' as 'flex',
        // flexDirection: 'row' as 'row',
        minHeight: theme.spacing(8),
        alignItems: 'center' as 'center',
    },
    cancelContainer: {
        minHeight: theme.spacing(8),
        width: '42px',
        textAlign: 'center' as 'center',
        paddingTop: '8%',
    },
    progress: {
        padding: `0px ${theme.spacing(0.25)}px`,
        minHeight: theme.spacing(8),
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        '& > div:first-child': {
            margin: `0px ${theme.spacing(1.25)}px`,
        },
    },
    arrow: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginLeft: 'auto',
    },
    files: {
        width: theme.leftSideWidth,
    },
    uploadTitle: {
        maxWidth: theme.spacing(7),
        display: 'inline-block',
        whiteSpace: 'nowrap' as 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    uploadStage: {
        marginLeft: theme.spacing(0.5),
    },
});

interface IProps extends IWithStyles {
    localStateMgr: ILocalStateMgr;
}

const downloadUploadFiles = ({ localStateMgr, classes }: IProps) => {
    const { state } = localStateMgr;
    const { uploadsQueue } = state;
    const [opened, setOpened] = useState(false);
    const uploadsKeys = Object.keys(uploadsQueue);
    const unfinishedUploadsKeys = Object.keys(uploadsQueue).filter(
        (uploadKey) => !uploadsQueue[uploadKey].success
    );

    useEffect(() => {
        if (!unfinishedUploadsKeys.length) {
            setOpened(false);
        }
    }, [unfinishedUploadsKeys]);

    const toUploadInfo = (uploadKey: string, index: number) => {
        const {
            title,
            success,
            progress,
            converting,
            downloading,
        } = uploadsQueue[uploadKey];

        return (
            <Slide
                key={index}
                direction='right'
                in={!success}
                mountOnEnter
                unmountOnExit
            >
                <Box className={classes.progress}>
                    <StyledCircularProgress
                        value={progress}
                        variant={
                            converting || downloading
                                ? 'indeterminate'
                                : 'determinate'
                        }
                    />
                    "<Box className={classes.uploadTitle}>{title}</Box>"
                    <Box className={classes.uploadStage}>
                        {` is ${
                            converting
                                ? 'converting'
                                : downloading
                                ? 'downloading'
                                : 'uploading'
                        }...`}
                    </Box>
                </Box>
            </Slide>
        );
    };

    function cancelUploading() {
        state.VideoUploadingCancelToken.cancel();
        Object.keys(localStateMgr.state.uploadsQueue).forEach((key) => {
            localStateMgr.dispatch({
                type: 'ON_UPLOAD_SUCCESS',
                videoID: key,
            });
            localStateMgr.dispatch({
                type: 'ON_CREATE_NEW_CANCEL_TOKEN',
            });
        });
    }

    return (
        <Slide
            direction='up'
            in={!!unfinishedUploadsKeys.length}
            mountOnEnter
            unmountOnExit
        >
            <Box className={classes.container}>
                <Box className={classes.shadowContainer}>
                    <Box className={classes.wrapper}>
                        <Box
                            className={classes.cancelContainer}
                            onClick={cancelUploading}
                        >
                            <CancelOutlinedIcon fontSize='default' />
                        </Box>
                        <Box
                            className={classes.progress}
                            onClick={(e) => setOpened((prev) => !prev)}
                        >
                            {`Processing videos (${unfinishedUploadsKeys.length})`}
                            <Box className={classes.arrow}>
                                {opened ? (
                                    <ArrowDropDownIcon />
                                ) : (
                                    <ArrowDropUpIcon />
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Collapse in={opened}>
                        <Box className={classes.files}>
                            {uploadsKeys.map(toUploadInfo)}
                        </Box>
                    </Collapse>
                </Box>
            </Box>
        </Slide>
    );
};

export const DownloadUploadFiles = compose(
    withStyles(styles),
    withLocalState
)(downloadUploadFiles);
