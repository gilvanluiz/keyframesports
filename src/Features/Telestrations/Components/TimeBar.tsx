import * as React from 'react';
import {
    Slider,
    makeStyles,
    createStyles,
    Theme as ITheme,
} from '@material-ui/core';

import { useEffect, useState, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { getPercentageFromTeleTime } from '../Utils/CalculateTime';
import {
    ITelestrationPercentateChangeAction,
    ITelestrationPercentateCommittedAction,
    withTelestrationState,
} from '../State';
import { compose } from 'fp-ts/lib/function';
import { ITelestrationStateMgr } from '../Types';
import { formatTime } from 'src/Utilities/Time';

const TimeSlider = withStyles({
    root: {
        left: '0.2%',
        height: '35px',
        width: '87.8%',
        padding: '0px',
    },
    track: {
        opacity: 0,
        height: '35px',
    },
    rail: {
        height: '35px',
        background: 'black',
    },
})(Slider);

const useStyles = makeStyles((theme: ITheme) =>
    createStyles({
        thumbLine: {
            backgroundColor: '#fff',
            minWidth: '1px',
            minHeight: '150px',
            borderRadius: '0px',
        },
        thumbTriangle: {
            marginTop: '5px',
            fontSize: '0px',
            lineHeight: '0%',
            width: '0px',
            borderTop: '10px solid #fff',
            borderLeft: '7px solid rgba(0, 0, 0, 0)',
            borderRight: '7px solid rgba(0, 0, 0, 0)',
        },
    })
);

const Thumb = (props: any) => {
    const classes = useStyles();

    const style = {
        ...props.style,
        zIndex: '1',
        marginLeft: '0px',
        marginRight: '0px',
        display: 'flex',
        flexDirection: 'column' as 'column',
        width: '0px',
        height: 'auto',
        // boxShadow: '#ebebeb 0 2px 2px',
        '&:focus, &:hover, &$active': {
            // boxShadow: '#ccc 0 2px 3px 1px',
        },
    };

    return (
        <div {...props} style={style}>
            <div className={classes.thumbTriangle} />
            <div className={classes.thumbLine} />
        </div>
    );
};

const styles = (theme: ITheme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    controlButtons: {
        minWidth: '70px',
        maxWidth: '70px',
        textAlign: 'center' as 'center',
        '& > svg': {
            cursor: 'pointer',
        },
    },
});

const convertTime = (second: number) => {
    if (!second) {
        return '0';
    }
    const padString = second.toString().padStart(2, '0');
    return `00:${padString}:00`;
};

const secondDiv = (t: any) => {
    const { key, left, string } = t;
    return (
        <div
            style={{
                position: 'absolute',
                left: `${left}px`,
                display: 'flex',
                flexDirection: 'column',
                top: '-15px',
            }}
            key={key}
        >
            <div style={{ transform: 'translateX(-40%)' }}>{string}</div>
            <div>|</div>
        </div>
    );
};

interface ITimeBarProps {
    telestrationStateMgr: ITelestrationStateMgr;
    classes: any;
}
const timeBar = ({ classes, telestrationStateMgr }: ITimeBarProps) => {
    const { state, dispatchAction } = telestrationStateMgr;

    const { totalTelestrationDuration, telestrationTime } = state;
    const [progressState, setProgressState]: [any, any] = useState(0);
    const [timebarWidth, setTimebarWidth]: [number, any] = useState(0);
    const [timeArray, setTimeArray]: [[], any] = useState([]);

    const timeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const resizeHandler = () => {
            setTimebarWidth(timeRef.current?.offsetWidth);
            if (false) {
                console.log(timebarWidth);
            }
        };
        window.addEventListener('resize', resizeHandler);
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    const onChange = (event: any, value: number) => {
        dispatchAction(ITelestrationPercentateChangeAction(value));
    };

    const onChangeCommitted = (event: any, value: number) => {
        dispatchAction(ITelestrationPercentateCommittedAction(value));
    };

    // const updatePreview = async (time: number) => {
    //     const { current: video } = videoRef;

    //     if (video && video.paused) {
    //         const currentVolume = video.volume;
    //         // Turn off volume for update preview without sound.
    //         video.volume = 0;
    //         await video.play();
    //         await video.pause();
    //         video.currentTime = time;
    //         video.volume = currentVolume;
    //     }
    // };

    // const updateRelativeVideoTime = (time: number) => {
    //     dispatchAction(RelativeCurrentTimeChangeAction(time));
    // };

    useEffect(() => {
        setProgressState((telestrationTime / totalTelestrationDuration) * 100);
    }, [telestrationTime]);

    useEffect(() => {
        console.log(totalTelestrationDuration);
        if (timeRef.current) {
            const totalwidth = timeRef.current.offsetWidth;

            const secondWidth = totalwidth / totalTelestrationDuration;
            const secondArray = [];

            for (
                let i = 0;
                i < Math.floor(totalTelestrationDuration) + 2;
                i++
            ) {
                secondArray.push({
                    key: i,
                    left: i * secondWidth,
                    string: convertTime(i),
                });
            }
            setTimeArray(secondArray);
        }

        setProgressState(
            getPercentageFromTeleTime(
                telestrationTime,
                totalTelestrationDuration
            )
        );
    }, [totalTelestrationDuration]);

    return (
        <div
            className={classes.container}
            style={{
                position: 'relative',
                backgroundColor: '#363636',
                height: '35px',
                marginTop: '10px',
            }}
        >
            <div style={{ width: '12%', paddingLeft: '10px' }}>
                {/* <VideoTime videoRef={videoRef} telestrationTime /> */}
                <div style={{ fontWeight: 'bold' }}>
                    {formatTime(telestrationTime)}
                </div>
            </div>

            <TimeSlider
                value={progressState}
                ThumbComponent={Thumb}
                onChangeCommitted={onChangeCommitted}
                onChange={onChange}
                ref={timeRef}
                step={100 / totalTelestrationDuration / 5}
            ></TimeSlider>

            <div
                style={{
                    display: 'flex',
                    position: 'absolute',
                    width: '88%',
                    left: '12%',
                    backgroundColor: 'red',
                    fontSize: '8px',
                    pointerEvents: 'none',
                    top: '30px',
                }}
                ref={timeRef}
            >
                {timeArray && timeArray.map(secondDiv)}
            </div>
        </div>
    );
};

export const TimeBar = compose(
    withTelestrationState,
    withStyles(styles)
)(timeBar);
