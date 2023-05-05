import * as React from 'react';
import { compose } from 'fp-ts/lib/function';
import { Theme as ITheme } from '@material-ui/core';
import { useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ITelestrationStateMgr } from '../Types';
import { AddedShapeOrderChangeAction, withTelestrationState } from '../State';
import { ShapeRow } from './ShapeRow';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const styles = (theme: ITheme) => ({
    shapeRowsDiv: {
        height: '130px',
        gap: '2px',
        display: 'flex',
        // scrollbarColor: '#aaaaaa',
        // scrollbarWidth: '6px',
        // scrollBehavior: 'auto',
        // overflowX: 'auto',
        // flexDirection: 'column',
    },
});

interface IShapeRowsProps {
    classes: any;
    telestrationStateMgr: ITelestrationStateMgr;
}

const SortableItem = SortableElement(({ value, index }: any) => (
    <div>
        <ShapeRow shapeDetail={value} index={index} />
    </div>
));

const SortableList = SortableContainer(({ items }: any) => {
    return (
        <div>
            {items.map((shape: any, index: number) => (
                <SortableItem key={shape.title} index={index} value={shape} />
            ))}
        </div>
    );
});

const shapeRows = ({ classes, telestrationStateMgr }: IShapeRowsProps) => {
    const { state, dispatchAction } = telestrationStateMgr;
    // const { telestrationManager } = state;

    const rowRef = useRef<HTMLDivElement>(null);
    // const [shapeArray, setShapeArray]: [any, any] = React.useState([]);

    const onSortEnd = ({ oldIndex, newIndex }: any) => {
        dispatchAction(AddedShapeOrderChangeAction(oldIndex, newIndex));
        // this.setState(({ items }) => ({
        //   items: arrayMove(items, oldIndex, newIndex)
        // }));
    };

    // React.useEffect(() => {
    //     console.log('change order');

    //     // setShapeArray(state.telestrationManager.addedShapes);

    //     setShapeArray(state.telestrationManager.addedShapes);
    //     setTimeout(() => console.log(shapeArray), 1);
    // }, [state]);
    return (
        <div
            className={classes.shapeRowsDiv}
            style={{
                scrollBehavior: 'auto',
                overflowX: 'auto',
                flexDirection: 'column',
            }}
            ref={rowRef}
        >
            <SortableList
                items={state.telestrationManager.addedShapes}
                onSortEnd={onSortEnd}
                useDragHandle
            />
            {/* {telestrationManager.addedShapes.map(
                (shape: any, index: number) => {
                    switch (shape.type) {
                        case 'circle':
                            objectsCount.circle++;
                            break;
                        case 'lightshaft':
                            objectsCount.lightshaft++;
                            break;
                        case 'linkedcursor':
                            objectsCount.linkedcursor++;
                            break;
                    }
                    return (
                        <ShapeRow
                            key={index}
                            title={`${shape.type} ${objectsCount[shape.type]}`}
                            shapeDetail={shape}
                            totalTelestrationDuration={
                                state.totalTelestrationDuration
                            }
                        />
                    );
                }
            )} */}
        </div>
    );
};

export const ShapeRows = compose(
    withTelestrationState,
    withStyles(styles)
)(shapeRows);
