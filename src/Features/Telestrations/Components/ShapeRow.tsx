import * as React from 'react';
import { Theme as ITheme } from '@material-ui/core';
import { useEffect, useState, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme: ITheme) => ({
    container: {
        display: 'flex',
    },
    controlButtons: {
        minWidth: '70px',
        maxWidth: '70px',
        textAlign: 'center' as 'center',
    },
    timeBar: {
        width: '87.8%',
        height: '25px',
        background: '#C4C4C4',
        left: '0.2%',
    },
    resizble: {
        height: '25px',
        justifyContent: 'space-between',
    },
    resizer: {
        backgroundColor: 'white',
        border: 'solid 1px black',
        borderRadius: '10px',
        cursor: 'col-resize',
        width: '10px',
        height: '10px',
        alignSelf: 'center',
    },
});

const shapeRow = ({
    key,
    title,
    shapeDetail,
    totalVideoDuration,
    classes,
}: any) => {
    const { color } = shapeDetail.object;

    const { videoPauseDuration } = shapeDetail;

    const timeBarRef: any = useRef(null);
    const [secondWidth, setSecondWidth]: [number, any] = useState(100);

    useEffect(() => {
        setSecondWidth(timeBarRef.current.offsetWidth / totalVideoDuration);
    }, [totalVideoDuration]);

    const [state, setState]: [any, any] = useState({
        margin: {
            left: 50,
            right: 50,
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
                margin.left > timeBarRef.current.offsetWidth - margin.right - 50
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
                margin.right > timeBarRef.current.offsetWidth - margin.left - 50
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
    const rowTitleStyle = {
        width: '12%',
        height: '25px',
        background: '#C4C4C4',
        display: 'flex',
        color: 'black',
        alignItems: 'center',
        gap: '5px',
    };
    const resizbleStyle = {
        marginLeft: `${state.margin.left}px`,
        marginRight: `${state.margin.right}px`,
        backgroundColor: color,
        display: 'flex',
    };
    const stopTimeStyle = {
        marginLeft: `${videoPauseDuration.startTime * secondWidth}px`,
        width: `${
            (videoPauseDuration.endTime - videoPauseDuration.startTime) *
            secondWidth
        }px`,
        background:
            'linear-gradient(90deg, rgba(158,158,158,1) 50%, rgba(123,123,123,1) 50%)',
        backgroundSize: '10px',
        backgroundRepeatX: 'repeat',
    };
    return (
        <div className={classes.container}>
            <div style={rowTitleStyle}>
                <div
                    style={{
                        backgroundColor: `${color}`,
                        width: '7px',
                        height: '100%',
                    }}
                ></div>
                {title}
            </div>
            <div
                ref={timeBarRef}
                className={classes.timeBar}
                style={{ position: 'relative' }}
            >
                <div style={stopTimeStyle}>
                    <div className={classes.resizble} style={resizbleStyle}>
                        <div
                            onMouseDown={(e) => handleMousedown(e, 'left')}
                            className={classes.resizer}
                            style={{
                                left: '0px',
                                transform: 'translateX(-50%)',
                            }}
                        />
                        <div
                            onMouseDown={(e) => handleMousedown(e, 'right')}
                            className={classes.resizer}
                            style={{
                                right: '0px',
                                transform: 'translateX(50%)',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ShapeRow = withStyles(styles)(shapeRow);
