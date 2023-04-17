import * as React from 'react';
import { Theme as ITheme } from '@material-ui/core';
import { useEffect, useState, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import SoundIcon from '../../../Assets/sound.png';
import NoSoundIcon from '../../../Assets/no_sound.png';
import RecordIcon from '../../../Assets/record.png';

const styles = (theme: ITheme) => ({
    container: {
        display: 'flex',
    },
    controlButtons: {
        minWidth: '70px',
        maxWidth: '70px',
        textAlign: 'center' as 'center',
    },
    soundBar: {
        width: '100%',
        height: '25px',
        borderRadius: '25px',
        background: 'rgba(255, 255, 255, .2)',
    },
    resizble: {
        height: '25px',
        borderRadius: '25px',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0px 10px',
        background: 'rgba(255, 255, 255, .9)',
    },
    resizer: {
        minWidth: '3px',
        backgroundColor: '#000',
        cursor: 'col-resize',
    },
    soundIcon: {
        width: '12px',
        height: '20px',
        marginRight: '10px',
        cursor: 'pointer',
    },
    recordIcon: {
        width: '20px',
        height: '20px',
        cursor: 'pointer',
    },
});

const soundBar = ({ sound, videoRef, classes }: any) => {
    const soundBarRef: any = useRef(null);

    const [state, setState]: [any, any] = useState({
        margin: {
            left: 150,
            right: 150,
        },
    });
    const handleMousedown = (e: any, side: any) => {
        setState({ ...state, isResizing: true, side, lastDownX: e.clientX });
    };

    const handleMousemove = (e: any) => {
        if (!state.isResizing) {
            return;
        }

        const margin = {
            right: state.margin.right,
            left: state.margin.left,
        };

        if (state.side === 'left') {
            margin.left =
                e.clientX < state.lastDownX
                    ? margin.left - (state.lastDownX - e.clientX)
                    : e.clientX > state.lastDownX
                    ? margin.left + (e.clientX - state.lastDownX)
                    : margin.left;

            if (
                margin.left < 0 ||
                margin.left >
                    soundBarRef.current.offsetWidth - margin.right - 50
            ) {
                return;
            }
        } else if (state.side === 'right') {
            margin.right =
                e.clientX > state.lastDownX
                    ? margin.right + (state.lastDownX - e.clientX)
                    : e.clientX < state.lastDownX
                    ? margin.right - (e.clientX - state.lastDownX)
                    : margin.right;
            if (
                margin.right < 0 ||
                margin.right >
                    soundBarRef.current.offsetWidth - margin.left - 50
            ) {
                return;
            }
        }

        setState({ ...state, margin, lastDownX: e.clientX });
    };

    const handleMouseup = (e: any) => {
        setState({ ...state, isResizing: false });
    };

    useEffect(() => {
        const mousemove = (e: any) => handleMousemove(e);
        const mouseup = (e: any) => handleMouseup(e);

        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);

        return () => {
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
        };
    }, [state]);

    const resizbleStyle = {
        marginLeft: `${state.margin.left}px`,
        marginRight: `${state.margin.right}px`,
    };

    return (
        <div className={classes.container}>
            <div className={classes.controlButtons}>
                {videoRef.current?.volume > 0 ? (
                    <img
                        src={SoundIcon}
                        className={classes.soundIcon}
                        alt='sound'
                        onClick={sound}
                    />
                ) : (
                    <img
                        src={NoSoundIcon}
                        className={classes.soundIcon}
                        alt='no sound'
                        onClick={sound}
                    />
                )}
                <img
                    src={RecordIcon}
                    className={classes.recordIcon}
                    alt='record'
                />
            </div>
            <div ref={soundBarRef} className={classes.soundBar}>
                <div className={classes.resizble} style={resizbleStyle}>
                    <div
                        onMouseDown={(e) => handleMousedown(e, 'left')}
                        className={classes.resizer}
                    />
                    <div
                        onMouseDown={(e) => handleMousedown(e, 'right')}
                        className={classes.resizer}
                    />
                </div>
            </div>
        </div>
    );
};

export const SoundBar = withStyles(styles)(soundBar);
