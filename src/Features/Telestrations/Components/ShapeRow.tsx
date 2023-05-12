import * as React from 'react';
import { compose } from 'fp-ts/lib/function';
import { Theme as ITheme, TextField } from '@material-ui/core';
import { useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { SortableHandle } from 'react-sortable-hoc';

// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import { MuiThemeProvider } from 'material-ui';
// import { MuiThemeProvider } from '@material-ui/core';

import { ITelestrationStateMgr } from '../Types';
import {
    ChangeObjectDurationAction,
    IChangeObjectVideoStopDurationAction,
    shapeRowSelectAction,
    withTelestrationState,
} from '../State';

import { Slider } from '@material-ui/core';
import {
    getPercentageFromTeleTime,
    getTeleTimeFromPercentage,
} from '../Utils/CalculateTime';

const styles = (theme: ITheme) => ({
    container: {
        display: 'flex',
    },
    shapeBar: {
        width: '87.8%',
        height: '25px',
        background: '#C4C4C4',
        left: '0.2%',
    },
    input: {
        color: 'black',
    },
});

const PauseSlider = withStyles({
    root: {
        height: '25px',
        padding: '0px',
        position: 'absolute',
    },
    track: {
        height: '25px',
        background:
            'linear-gradient(90deg, rgba(158,158,158,1) 50%, rgba(123,123,123,1) 50%)',
        backgroundSize: '10px',
        backgroundRepeatX: 'repeat',
    },
    rail: {
        opacity: 0,
        height: '25px',
    },
})(Slider);

const ShapeSlider = withStyles({
    root: {
        height: '25px',
        padding: '0px',
        position: 'absolute',
        pointerEvents: 'none',
    },
    track: {
        height: '25px',
        pointerEvents: 'all',
    },
    rail: {
        opacity: 0,
        height: '25px',
    },
})(Slider);

const CustomTextField = withStyles({
    root: {
        '& .MuiInputBase-input': {
            color: 'black',
            padding: '0px',
            fontSize: '14px',
        },
    },
})(TextField);

const Thumb = (props: any) => {
    const style = {
        ...props.style,
        marginLeft: '0px',
        marginRight: '0px',
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
        height: 'auto',
        top: '50%',
        transform: 'translateX(-50%)',
        // boxShadow: '#ebebeb 0 2px 2px',
        pointerEvents: 'all',
        cursor: 'col-resize',
        '&:focus, &:hover, &$active': {
            boxShadow: '#ccc 0 2px 3px 1px',
        },
    };

    return (
        <div
            {...props}
            style={style}
            onDrag={(e) => {
                console.log('thumb dragging');
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    minWidth: '10px',
                    minHeight: '10px',
                    borderRadius: '10px',
                }}
            />
        </div>
    );
};

interface IShapeRowProps {
    index: number;
    shapeDetail: any;
    telestrationStateMgr: ITelestrationStateMgr;
    classes: any;
}

const DragHandle = SortableHandle(() => (
    <span style={{ cursor: 'move', backgroundColor: 'white' }}>::::::</span>
));

const shapeRow = ({
    index,
    shapeDetail,
    telestrationStateMgr,
    classes,
}: IShapeRowProps) => {
    const { state, dispatchAction } = telestrationStateMgr;
    const { totalTelestrationDuration } = state;
    const { videoPauseDuration, objectDuration } = shapeDetail;
    const { color } = shapeDetail.object;

    const pauseArray = [
        getPercentageFromTeleTime(
            videoPauseDuration.startTime,
            totalTelestrationDuration
        ),
        getPercentageFromTeleTime(
            videoPauseDuration.endTime,
            totalTelestrationDuration
        ),
    ];
    const stopArray = [
        getPercentageFromTeleTime(
            objectDuration.startTime,
            totalTelestrationDuration
        ),
        getPercentageFromTeleTime(
            objectDuration.endTime,
            totalTelestrationDuration
        ),
    ];
    const secondPercentage = 100 / totalTelestrationDuration;
    const shapeBarRef: any = useRef(null);
    const spaneRef = useRef<any>(null);

    const [isdisabled, setIsDisabled]: [boolean, any] = React.useState(true);

    const handlePauseChange = (
        event: React.ChangeEvent<{}>,
        newArray: number[]
    ) => {
        if (newArray[0] <= stopArray[0] && newArray[1] >= stopArray[1]) {
            const timeArray = [
                getTeleTimeFromPercentage(
                    newArray[0],
                    totalTelestrationDuration
                ),
                getTeleTimeFromPercentage(
                    newArray[1],
                    totalTelestrationDuration
                ),
            ];
            dispatchAction(
                IChangeObjectVideoStopDurationAction(index, timeArray)
            );
        }
    };

    const handleShapeChange = (
        event: React.ChangeEvent<{}>,
        newArray: number[]
    ) => {
        if (
            newArray[0] > pauseArray[0] &&
            newArray[1] < pauseArray[1] &&
            newArray[1] - newArray[0] > secondPercentage
        ) {
            const timeArray = [
                getTeleTimeFromPercentage(
                    newArray[0],
                    totalTelestrationDuration
                ),
                getTeleTimeFromPercentage(
                    newArray[1],
                    totalTelestrationDuration
                ),
            ];
            dispatchAction(ChangeObjectDurationAction(index, timeArray));
        }
    };

    const selectHandler = (e: any) => {
        dispatchAction(shapeRowSelectAction(index));
    };

    React.useEffect(() => {
        spaneRef.current.querySelector(
            '.MuiSlider-track'
        ).style.backgroundColor = color;
    }, [color]);

    const rowTitleStyle = {
        width: '12%',
        height: '25px',
        background: shapeDetail.isSelected ? '#333333' : '#C4C4C4',
        display: 'flex',
        color: 'black',
        alignItems: 'center',
        gap: '5px',
    };

    return (
        <div className={classes.container}>
            <div style={rowTitleStyle} onClick={selectHandler}>
                <div
                    style={{
                        backgroundColor: `${color}`,
                        width: '10px',
                        height: '100%',
                    }}
                ></div>
                <DragHandle />
                <CustomTextField
                    disabled={isdisabled}
                    id='outlined-disabled'
                    margin='none'
                    defaultValue={shapeDetail.title}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                    }}
                    onDoubleClick={(e) => {
                        setIsDisabled(false);
                    }}
                />
            </div>

            <div
                ref={shapeBarRef}
                className={classes.shapeBar}
                style={{ position: 'relative' }}
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <PauseSlider
                    step={0.0005}
                    value={pauseArray}
                    onChange={handlePauseChange}
                    ThumbComponent={Thumb}
                    aria-labelledby='range-slider'
                ></PauseSlider>
                <ShapeSlider
                    step={0.0005}
                    ref={spaneRef}
                    value={stopArray}
                    onChange={handleShapeChange}
                    ThumbComponent={Thumb}
                    aria-labelledby='range-slider'
                />
            </div>
        </div>
    );
};

export const ShapeRow = compose(
    withTelestrationState,
    withStyles(styles)
)(shapeRow);
