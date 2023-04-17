import { ICoordinates } from '../Types';

interface IPointAlongLineArgs {
    distance: number;
    start: ICoordinates;
    slope: number;
}
type IPointAlongLineRet = [ICoordinates, ICoordinates];

export function alongLine({
    distance,
    start, // {x: 10, y: 19}
    slope,
}: IPointAlongLineArgs): IPointAlongLineRet {
    /* Given a point, a slope, and a distance,
       return the two points that are on that
       line. */
    const norm = Math.sqrt(slope * slope + 1);
    const x1 = start.x + distance / norm;
    const y1 = start.y + (distance * slope) / norm;
    const x2 = start.x - distance / norm;
    const y2 = start.y - (distance * slope) / norm;
    const p1 = {
        x: x1,
        y: y1,
    };
    const p2 = {
        x: x2,
        y: y2,
    };
    return [p1, p2];
}

interface IRect {
    height: number;
    width: number;
}

interface IMaxRectArgs {
    innerRect: IRect;
    outerRect: IRect;
}
export function maxRect({ innerRect, outerRect }: IMaxRectArgs): IRect {
    /* Give the maximum dimensions innerRect can have
       to fit in outer rect.

       The problem we are trying to solve is that if we set
       innerRect's width to = outerRect's width, innerRect
       may be too tall.
     */
    const innerAspectRatio = innerRect.width / innerRect.height;
    const outerAspectRatio = outerRect.width / outerRect.height;
    if (outerAspectRatio > innerAspectRatio) {
        // outerRect is relatively wider than inner Rect.
        // so stretching innerRect will make it too tall.
        // so go with height
        // So for a 4 x 4 outerRect and a 1w x 2h inner width,
        // we want the height to be 4 and the width to be
        // 4 * innerAspectRatio
        const r = {
            height: outerRect.height,
            width: outerRect.height * innerAspectRatio,
        };
        return r;
    } else {
        // outerRect is relatively taller than innerRect. So
        // we go with outerwidth.
        // if the outerRect is 8 x 4 and innerRect is 1 x 2 (h / w)
        // then we set the  to 4 and the height to
        // aspectRatio (1/2)
        // * width
        const r = {
            height: outerRect.width * (innerRect.height / innerRect.width),
            width: outerRect.width,
        };
        return r;
    }
}
