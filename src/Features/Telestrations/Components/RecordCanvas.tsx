/*
   This canvas is hidden, but it is the one that is actually
   recorded. Both the video and the animation canvas are drawn
   on this canvas.

   Some helpful articles:

    https://stackoverflow.com/questions/49786505/what-is-correct-lifecycle-method-in-react-16-3-to-update-canvas-from-props/49803151#49803151
 */

import * as React from 'react';
import { PureCanvas } from './PureCanvas';
import { ITelestrationStateMgr } from '../Types';

interface IRecordingCanvasProps {
    animationCanvasRef: React.RefObject<HTMLCanvasElement>;
    cursorCanvasRef: React.RefObject<HTMLCanvasElement>;
    recordingCanvasRef: React.RefObject<HTMLCanvasElement>;
    videoRef: React.RefObject<HTMLVideoElement>;
    height: number;
    width: number;
    telestrationStateMgr: ITelestrationStateMgr;
}

export class RecordingCanvas extends React.Component<
    IRecordingCanvasProps,
    { telestrationManager: any }
> {
    constructor(props: IRecordingCanvasProps) {
        super(props);
        this.state = { telestrationManager: null };
    }

    public componentDidMount() {
        const tm = this.props.telestrationStateMgr.state.telestrationManager;

        tm.setCanvas(
            this.props.animationCanvasRef.current,
            this.props.cursorCanvasRef.current
        );
        tm.setVideo(this.props.videoRef.current);
        tm.setRecordCanvas(this.props.recordingCanvasRef.current);
        tm.setEvents();

        this.setState({ telestrationManager: tm });
        this.startAnimationLoop();
    }

    public paintCanvas = (n: number): any => {
        const {
            props: { animationCanvasRef, recordingCanvasRef },
        } = this;
        const currentAnimationCanvas = animationCanvasRef.current;
        const animationCtx =
            animationCanvasRef.current &&
            animationCanvasRef.current.getContext('2d');
        const recordingCtx =
            recordingCanvasRef.current &&
            recordingCanvasRef.current.getContext('2d');

        if (!animationCtx || !recordingCtx) {
            return requestAnimationFrame((m: number) => this.paintCanvas(m));
        } else if (!currentAnimationCanvas) {
            console.warn('No animation canvas', currentAnimationCanvas);
            return requestAnimationFrame((m: number) => this.paintCanvas(m));
        } else {

            if (this.state.telestrationManager) {
                // includes drawing of recording context
                this.state.telestrationManager.loop(n);
            }


            return requestAnimationFrame((m: number) => this.paintCanvas(m));
        }
    };

    public startAnimationLoop = () => {
        this.paintCanvas(0);
    };

    public render() {
        const {
            props: { height, width },
        } = this;
        return (
            <PureCanvas
                height={height}
                width={width}
                canvasref={this.props.recordingCanvasRef}
            />
        );
    }
}
