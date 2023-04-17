import * as React from 'react';
import { Snackbar, Box, Typography, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    uploadMessage: {
        minWidth: '210px',
        maxWidth: '210px',
        display: 'flex',
    },
    snackbarBackground: {
        background: '#2196f3',
    },
    uploadTitle: {
        maxWidth: '100px',
        display: 'inline-block',
        whiteSpace: 'nowrap' as 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    blackCircularProgress: {
        color: '#000',
    },
    progress: {
        paddingLeft: '5px',
    },
});

interface IProps {
    order: number;
    title: string;
    progress?: number;
    converting?: boolean;
    downloading?: boolean;
    open: boolean;
    position: {
        vertical: 'top' | 'bottom';
        horizontal: 'left' | 'center' | 'right';
    };
    classes: any;
}

const uploadSnackbar = ({
    order,
    title,
    progress,
    converting,
    downloading,
    open,
    position: { vertical, horizontal },
    classes,
}: IProps) => {
    const action =
        converting || downloading ? (
            <CircularProgress
                key={order}
                className={classes.blackCircularProgress}
            />
        ) : (
            <Box key={order} position='relative' display='inline-flex'>
                <CircularProgress
                    variant='static'
                    className={classes.blackCircularProgress}
                    value={progress}
                />
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position='absolute'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                >
                    <Typography variant='caption' component='div'>
                        {`${Math.trunc(progress || 0)}%`}
                    </Typography>
                </Box>
            </Box>
        );

    return (
        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            style={{
                [vertical]: `${60 * order + 10}px`,
                left: '10px',
            }}
            ContentProps={{
                'aria-describedby': `message-${order}`,
                className: classes.snackbarBackground,
            }}
            message={
                <div id={`message-${order}`} className={classes.uploadMessage}>
                    "<div className={classes.uploadTitle}>{title}</div>"
                    <div className={classes.progress}>
                        {converting
                            ? 'is converting'
                            : downloading
                            ? 'is downloading'
                            : 'is uploading'}
                    </div>
                </div>
            }
            action={[action]}
        />
    );
};

export const UploadSnackbar = withStyles(styles)(uploadSnackbar);
