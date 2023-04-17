import * as React from 'react';

interface IPureCanvasProps {
    canvasref: React.RefObject<HTMLCanvasElement>;
    height: number;
    width: number;
}

export class PureCanvas extends React.Component<IPureCanvasProps, {}> {
    public shouldComponentUpdate() {
        return false;
    }
    public render() {
        const {
            props: { canvasref },
        } = this;
        if (!canvasref) {
            throw Error('no canvas ref!');
        }
        return (
            <canvas
                style={{ zIndex: 10, position: 'fixed', right: '100vw' }}
                ref={canvasref}
            />
        );
    }
}
