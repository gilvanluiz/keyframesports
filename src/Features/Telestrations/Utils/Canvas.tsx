import * as React from 'react';
import { addImageAction, setDragStateAction } from '../State';
import { IOverlayImg, ICoordinates, ITelestrationStateMgr } from '../Types';
import { alongLine } from './Geometry';
import CircleImg from '../Assets/svg/Keyframe_Cursor-01_Near.svg';
import { max, min, ordNumber } from 'fp-ts/lib/Ord';

export const relativeCoords = (
    canvasRef: any,
    evt: React.MouseEvent<HTMLElement>
) => {
    const bounds = canvasRef.current.getBoundingClientRect();
    const x = evt.clientX - bounds.left;
    const y = evt.clientY - bounds.top;
    return { x, y };
};

interface IImageCenter {
    coordinates: ICoordinates;
    geometry: {
        height: number;
        width: number;
    };
}

export const _imageCenter = ({
    coordinates, // Top left coordinate
    geometry: { height, width },
}: IImageCenter): { x: number; y: number } => {
    return {
        x: coordinates.x + width / 2,
        y: coordinates.y + height / 2,
    };
};

interface IBoundingRectArgs {
    start: ICoordinates;
    end: ICoordinates;
}
interface IBoundingRectRet {
    topLeft: ICoordinates;
    topRight: ICoordinates;
    bottomLeft: ICoordinates;
    bottomRight: ICoordinates;
    center: ICoordinates;
    height: number;
    width: number;
    slope: number;
    diagonal: number;
}

export const boundingRect = ({
    start,
    end,
}: IBoundingRectArgs): IBoundingRectRet => {
    const maxNum = max(ordNumber);
    const minNum = min(ordNumber);
    const topY = minNum(start.y, end.y);
    const topX = maxNum(start.x, end.x);
    const bottomY = maxNum(start.y, end.y);
    const bottomX = minNum(start.x, end.x);
    const height = bottomY - topY;
    const width = topX - bottomX;
    const centerY = topY + height / 2;
    const centerX = topX - width / 2;
    const slope = (start.y - end.y) / (start.x - end.x);
    const diagonal = Math.sqrt(height * height + width * width);

    return {
        topLeft: { y: topY, x: bottomX },
        topRight: { x: topX, y: topY },
        bottomLeft: { x: bottomX, y: bottomY },
        bottomRight: { x: topX, y: bottomY },
        center: { x: centerX, y: centerY },
        height,
        width,
        slope,
        diagonal,
    };
};

interface IDrawImage {
    coordinates: ICoordinates;
    geometry: { width: number; height: number };
    img: any;
    ctx: any;
}

const _drawImage = ({
    ctx,
    coordinates: { x, y },
    geometry: { width, height },
    img,
}: IDrawImage) => {
    ctx.drawImage(img, x, y, width, height);
    return ctx;
};

interface IDrawImgByType {
    ctx: any;
    overlay: IOverlayImg;
}

const _drawImgByType = ({ ctx, overlay }: IDrawImgByType) => {
    switch (overlay.type) {
        case 'overlay/Circle': {
            const img = new Image();
            img.onload = () => {
                if (ctx && ctx.drawImage) {
                    const { coordinates } = overlay;
                    // Modified so we sit in the middle given
                    // height and width below
                    const coordinatesModified = {
                        x: coordinates.x - 45,
                        y: coordinates.y - 30,
                    };
                    _drawImage({
                        ctx,
                        img,
                        coordinates: coordinatesModified,
                        geometry: { width: 90, height: 60 },
                    });
                }
            };
            img.src = CircleImg;
            return ctx;
        }
        case 'overlay/Arrow': {
            // Find center of image to be drawn
            const { coordinates } = overlay;
            const xDirection =
                coordinates.start.x < coordinates.end.x ? 'right' : 'left';
            const yDirection =
                coordinates.start.y < coordinates.end.y ? 'down' : 'up';
            console.log(yDirection);

            const slopeFraction = {
                numerator: coordinates.end.y - coordinates.start.y,
                denominator: coordinates.end.x - coordinates.start.x,
            };
            const slope = slopeFraction.numerator / slopeFraction.denominator;
            const arrowType = Math.abs(slope) > 0.8 ? 'vertical' : 'horizontal';

            const [baseCenter1, baseCenter2] = alongLine({
                distance: 20,
                start: coordinates.end,
                slope,
            });
            // Draw arrow body
            ctx.fillStyle = 'red';
            ctx.strokeStyle = 'red';
            ctx.lineCap = 'round';
            ctx.lineWidth = 4;
            const baseCenter =
                xDirection === 'left' ? baseCenter1 : baseCenter2;
            ctx.beginPath();
            ctx.moveTo(coordinates.start.x, coordinates.start.y);
            ctx.lineTo(baseCenter.x, baseCenter.y);
            ctx.stroke();
            ctx.closePath();
            // End arrow Body

            if (arrowType === 'vertical') {
                ctx.beginPath();
                ctx.moveTo(coordinates.end.x, coordinates.end.y);
                ctx.lineTo(baseCenter.x - 25, baseCenter.y); // Base
                ctx.lineTo(baseCenter.x + 25, baseCenter.y);
                ctx.fill();
            }
            if (arrowType === 'horizontal') {
                console.log('Horizontal arrow');
                const baseCorners = alongLine({
                    distance: 20,
                    start: baseCenter,
                    slope: slope * -2,
                });
                ctx.beginPath();
                ctx.moveTo(coordinates.end.x, coordinates.end.y);
                ctx.lineTo(baseCorners[0].x, baseCorners[0].y);
                ctx.lineTo(baseCorners[1].x, baseCorners[1].y);
                ctx.fill();
            }
            return ctx;
        }
    }
};

export const drawImgToCanvas = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    overlayImg: IOverlayImg
) => {
    if (!canvasRef || !canvasRef.current) {
        console.warn('No canvas ref found.');
        return false;
    }
    const ctx = canvasRef.current && canvasRef.current.getContext('2d');

    return _drawImgByType({
        ctx,
        overlay: overlayImg,
    });
};

interface ICanvasMouseHandler {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    videoRef: React.RefObject<HTMLVideoElement>;
    telestrationStateMgr: ITelestrationStateMgr;
}
export const canvasClickHandler = ({
    canvasRef,
    videoRef,
    telestrationStateMgr: { state, dispatchAction },
}: ICanvasMouseHandler) => {
    if (state.editMode !== 'circle') {
        return () => false;
    }
    return (e: React.MouseEvent<HTMLElement>) => {
        if (!videoRef.current) {
            console.warn('No video ref, cannot handle click');
        }
        const coordinates = relativeCoords(canvasRef, e);
        switch (state.editMode) {
            case 'circle': {
                if (videoRef.current) {
                    const imageAction = addImageAction(
                        coordinates,
                        state.editMode,
                        videoRef.current.currentTime
                    );
                    dispatchAction(imageAction);
                    // state.overlays.map((overlay) => drawImgToCanvas(canvasRef, overlay));
                } else {
                    console.warn(
                        'Unable to handle click because no ' +
                            'video ref is available.'
                    );
                }
            }
            default: {
                return false;
            }
        }
    };
};

type IMouseDragHandler = {
    e: React.MouseEvent<HTMLElement>;
    mouseMode: 'down' | 'up';
} & ICanvasMouseHandler;

const _arrowMouseDown = ({
    canvasRef,
    telestrationStateMgr: { dispatchAction, state },
    e,
}: IMouseDragHandler) => {
    const coordinates = relativeCoords(canvasRef, e);
    const action = setDragStateAction(
        'start' as 'start',
        coordinates,
        state.editMode,
        0
    );
    dispatchAction(action);
};

const _arrowMouseUp = ({
    canvasRef,
    videoRef,
    e,
    telestrationStateMgr: { dispatchAction, state },
}: IMouseDragHandler) => {
    if (!videoRef.current || videoRef.current.currentTime === undefined) {
        console.error('No video ref in _arrowMouseUp', videoRef);
        return false;
    }
    const coordinates = relativeCoords(canvasRef, e);
    const action = setDragStateAction(
        'end' as 'end',
        coordinates,
        state.editMode,
        videoRef.current.currentTime
    );
    return dispatchAction(action);
};

export const canvasMouseDownUpHandler = (opts: IMouseDragHandler) => {
    if (opts.telestrationStateMgr.state.editMode !== 'arrow') {
        return () => false;
    }
    if (opts.mouseMode === 'down') {
        return _arrowMouseDown(opts);
    } else {
        return _arrowMouseUp(opts);
    }
};

export const clearCanvas = (canvasRef: any) => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};
