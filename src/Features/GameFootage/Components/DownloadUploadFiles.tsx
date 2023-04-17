import * as React from 'react';
import { useState, useEffect } from 'react';
import {
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
import { withLocalState, ILocalStateMgr } from '../../../App/LocalState';
import { StyledCircularProgress } from './CircularProgress';

const styles = (theme: ITheme) => ({
    container: {
        overflow: 'hidden',
        paddingTop: '10px',
        left: '0px',
        bottom: '0px',
        width: theme.leftSideWidth - 1,
        position: 'absolute' as 'absolute',
        zIndex: 2000,
    },
    shadowContainer: {
        background: theme.palette.primary.dark,
        boxShadow: '0px 2px 8px 4px #000',
    },
    opened: {},
    progress: {
        padding: '0px 20px',
        minHeight: theme.spacing(8),
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        '& > div:first-child': {
            margin: '0px 10px',
        },
    },
    arrow: {
        marginTop: '8px',
        marginLeft: 'auto',
    },
    files: {
        width: theme.leftSideWidth,
    },
    uploadTitle: {
        maxWidth: '100px',
        display: 'inline-block',
        whiteSpace: 'nowrap' as 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    uploadStage: {
        marginLeft: '5px',
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

    return (
        <Slide
            direction='up'
            in={!!unfinishedUploadsKeys.length}
            mountOnEnter
            unmountOnExit
        >
            <div className={classes.container}>
                <div className={classes.shadowContainer}>
                    <div
                        className={classes.progress}
                        onClick={(e) => setOpened((prev) => !prev)}
                    >
                        <StyledCircularProgress
                            variant='indeterminate'
                            size={20}
                        />
                        {`Processing videos (${unfinishedUploadsKeys.length})`}
                        <div className={classes.arrow}>
                            {opened ? (
                                <ArrowDropDownIcon />
                            ) : (
                                <ArrowDropUpIcon />
                            )}
                        </div>
                    </div>
                    <Collapse in={opened}>
                        <div className={classes.files}>
                            {uploadsKeys.map((uploadKey, index) => {
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
                                        <div className={classes.progress}>
                                            <StyledCircularProgress
                                                value={progress}
                                                variant={
                                                    converting || downloading
                                                        ? 'indeterminate'
                                                        : 'determinate'
                                                }
                                            />
                                            "
                                            <div
                                                className={classes.uploadTitle}
                                            >
                                                {title}
                                            </div>
                                            "
                                            <div
                                                className={classes.uploadStage}
                                            >
                                                {` is ${
                                                    converting
                                                        ? 'converting'
                                                        : downloading
                                                        ? 'downloading'
                                                        : 'uploading'
                                                }...`}
                                            </div>
                                        </div>
                                    </Slide>
                                );
                            })}
                        </div>
                    </Collapse>
                </div>
            </div>
        </Slide>
    );
};

export const DownloadUploadFiles = compose(
    withStyles(styles),
    withLocalState
)(downloadUploadFiles);
