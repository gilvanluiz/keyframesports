import * as React from 'react';
import {
    Box,
    Typography,
    makeStyles,
    createStyles,
    Theme as ITheme,
} from '@material-ui/core';
import CircularProgress, {
    CircularProgressProps as ICircularProgressProps,
} from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: ITheme) =>
    createStyles({
        container: {},
        bottom: {
            color:
                theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        top: {
            color: theme.palette.secondary.main,
            animationDuration: '550ms',
            position: 'absolute',
            left: '0px',
        },
        circle: {
            strokeLinecap: 'round',
        },
        progress: {
            fontSize: '0.6rem',
        },
    })
);

export const StyledCircularProgress = (props: ICircularProgressProps) => {
    const classes = useStyles();

    return (
        <Box
            className={classes.container}
            position='relative'
            display='inline-flex'
        >
            <CircularProgress
                className={classes.bottom}
                size={30}
                thickness={2}
                {...props}
                variant='determinate'
                value={100}
            />
            <CircularProgress
                variant='determinate'
                className={classes.top}
                classes={{
                    circle: classes.circle,
                }}
                size={30}
                thickness={2}
                {...props}
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
                <Typography
                    variant='caption'
                    component='div'
                    className={classes.progress}
                >
                    {props.value !== undefined
                        ? `${Math.trunc(props.value)}%`
                        : null}
                </Typography>
            </Box>
        </Box>
    );
};
