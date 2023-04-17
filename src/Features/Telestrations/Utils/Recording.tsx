/* For an example implementation,
   see https://github.com/webrtc/samples/blob/gh-pages/src/content/capture/canvas-record/js/main.js
 */
import * as React from 'react';

declare var MediaRecorder: any;
interface ICanvasElement extends HTMLCanvasElement {
    captureStream(n: number): MediaStream;
}

const _setWindowProperty = (name: string, value: any) => {
    window['__KEYFRAME_' + name] = value;
};

const _getWindowProperty = (name: string) => {
    return window['__KEYFRAME_' + name];
};

export const telestrationBlob = () => {
    const recordedBlobs = _getWindowProperty('recordedBlobs') as any;
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    return { blob };
};

interface IGetRecorderArgs {
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

interface IGetRecorderRet {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    recordedBlobs: any[];
    mediaRecorder: any;
}

export const getRecorderAndBlobs = async (
    opts: IGetRecorderArgs,
    setHint?: any
): Promise<IGetRecorderRet> => {
    const canvas = opts.canvasRef.current as ICanvasElement;
    if (!canvas) {
        throw Error('Canvas ref empty.');
    }

    const { state } = await navigator.permissions.query({ name: 'microphone' });
    let microTracks: any[] = [];

    if (state === 'prompt' && setHint) {
        setHint((prev: any) => ({
            ...prev,
            micro: true,
        }));
    }

    try {
        const microStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });

        microTracks = microStream.getTracks();
    } catch (error) {
        if (setHint) {
            setHint((prev: any) => ({
                ...prev,
                micro: true,
            }));
        }
    }

    const canvasTracks = (await canvas.captureStream(50)).getTracks();
    const stream = new MediaStream(canvasTracks.concat(microTracks));
    const recordedBlobs: any[] = [];
    const options = { mimeType: 'video/webm' };
    const mediaRecorder = new MediaRecorder(stream, options) as any;

    _setWindowProperty('mediaRecorder', mediaRecorder);
    _setWindowProperty('recordedBlobs', recordedBlobs);

    return {
        ...opts,
        recordedBlobs,
        mediaRecorder,
    };
};

interface I_StartRecorderArgs {
    mediaRecorder: any;
    recordedBlobs: any[];
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const _startRecorder = (opts: I_StartRecorderArgs): void => {
    const mediaRecorder = _getWindowProperty('mediaRecorder') as any;
    const recordedBlobs = _getWindowProperty('recordedBlobs') as any;
    mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    };
    mediaRecorder.start(100);
};

export const stopRecorder = () => {
    const recorder = _getWindowProperty('mediaRecorder') as any;

    try {
        return recorder.stop();
    } catch (error) {
        console.error('Could not stop recording');
    }
};

export const startRecorder = async (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    setHint?: (hint: string) => void
) => {
    const recorderAndBlobs = await getRecorderAndBlobs({ canvasRef }, setHint);
    return _startRecorder(recorderAndBlobs);
};
