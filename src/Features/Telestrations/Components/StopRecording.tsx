import * as React from 'react';
import { useRef } from 'react';
import {
    Box,
    Button,
    Snackbar,
    makeStyles,
    createStyles,
    Theme as ITheme,
} from '@material-ui/core';
import Draggable from 'react-draggable';

const indents = {
    left: 252,
    top: 5,
};

const useStyles = makeStyles((theme: ITheme) =>
    createStyles({
        snackbar: {
            left: indents.left,
            top: indents.top,
        },
        container: {
            cursor: 'grab',
            background: theme.palette.primary.dark,
            minWidth: 'auto',
            padding: theme.spacing(1),
            paddingLeft: theme.spacing(2.5),
        },
        button: {
            fontWeight: 'bold' as 'bold',
            minWidth: 'auto',
            borderRadius: theme.spacing(1),
            margin: `0px ${theme.spacing(1.5)}px`,
        },
        '@keyframes woong': {
            '0%': {
                transform: 'scale(1.2)',
            },
            '50%': {
                transform: 'scale(1.8)',
                opacity: 0.5,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
        '@keyframes woong-2': {
            '0%': {
                transform: 'scale(1.2)',
                opacity: 0.6,
            },
            '50%': {
                transform: 'scale(1.6)',
                opacity: 0.5,
            },
            '100%': {
                transform: 'scale(2)',
                opacity: 0,
            },
        },
        recorder: {
            display: 'block',
            borderRadius: '100%',
            cursor: 'default',
            position: 'relative',
        },
        micro: {
            color: '#fff',
            height: theme.spacing(3),
            width: theme.spacing(3),
            borderRadius: '100%',
            display: 'block',
            textAlign: 'center',
            backgroundColor: theme.palette.primary.main,
            position: 'relative',
        },
        outer: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            transform: 'scale(1)',
            borderRadius: '100%',
            position: 'absolute',
            transition: '1.5s all ease',
            '&:first-child': {
                backgroundColor: 'transparent',
                border: `1px solid ${theme.palette.grey[400]}`,
                animation: '$woong 1.5s infinite',
            },
            '&:nth-child(2)': {
                backgroundColor: theme.palette.grey[500],
                animation: '$woong-2 1.5s infinite',
                animationDelay: '2.5s',
            },
        },
    })
);

interface IBounds {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

interface IProps {
    open: boolean;
    onStopRecording: () => void;
}

export const StopRecording = ({ onStopRecording, open }: IProps) => {
    const classes = useStyles();
    const containerRef = useRef<HTMLDivElement>();

    const message = (
        <Box>
            <Box className={classes.recorder}>
                <Box className={classes.outer}></Box>
                <Box className={classes.outer}></Box>
                <Box className={classes.micro}></Box>
            </Box>
        </Box>
    );

    const button = (
        <Button
            key='undo'
            color='primary'
            size='small'
            className={classes.button}
            onClick={onStopRecording}
        >
            STOP
        </Button>
    );

    const bounds: IBounds = {};

    if (containerRef.current) {
        bounds.top = indents.top;
        bounds.left = -indents.left;
        bounds.top =
            -window.innerHeight +
            containerRef.current.offsetHeight +
            indents.top;
        bounds.right =
            window.innerWidth - containerRef.current.offsetWidth - indents.left;
    }

    return (
        <Draggable bounds={bounds}>
            <Snackbar
                className={classes.snackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={open}
                message={message}
                action={[button]}
                ContentProps={{
                    className: classes.container,
                    ref: containerRef,
                }}
            />
        </Draggable>
    );
};
