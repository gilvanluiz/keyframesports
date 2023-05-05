import { FadeInOutAnimation } from '../Animations/FadeInOutAnimation';

export class FreehandArrow {
    constructor(manager, color, borderColor, zAngle) {
        this.coords = [];
        this.color = color;
        this.borderColor = borderColor;
        this.zAngle = zAngle;
        this.manager = manager;
        this.type = 0; // 0 - default, 1 - dashed
        this.timer = 0;
        this.lastCoord = null;
        this.unsmoothedIndex = 0;
        this.finished = false;
        this.animation = null;
        this.hasBorder = true;
        this.lineWidth = 28;
        this.arrowBorderWidth = 8;
        this.lineBorderWidth = 12;
    }

    readyToFinish = function () {
        return this.coords.length > 2;
    };

    finishArrow = function () {
        this.smoothCoords(this.unsmoothedIndex);
        this.finished = true;
        this.animation = new FadeInOutAnimation(
            this.manager,
            this.manager.config.FADE_IN_TIME,
            this,
            0,
            false
        );
    };

    setColor = function (newColor) {
        this.color = newColor;
    };
    setSize = function (size) {
        this.setWidth(size);
    };
    getSize = function () {
        return this.lineWidth;
    };
    setWidth = function (width) {
        this.lineWidth = width;
    };

    setZAngle = function (zAngle) {
        this.zAngle = zAngle;
    };

    update = function (delta) {
        this.timer -= delta * 50;
    };

    switchType = function () {
        this.type = this.type === 0 ? 1 : 0;
    };

    getAbsolutePositionCoords = function () {
        let resultList = this.coords.reduce((coordlist, coord) => {
            coordlist.push(
                this.manager.transformToAbsolutePosition(coord, this)
            );
            return coordlist;
        }, []);
        resultList.push(
            this.manager.transformToAbsolutePosition(this.lastCoord, this)
        );
        return resultList;
    };

    addCoord = function (coord) {
        if (this.coords.length === 0) {
            this.coords.push(coord);
        } else {
            let lastConfirmedPoint = this.coords[this.coords.length - 1];
            if (
                Utils.dist(
                    lastConfirmedPoint.x,
                    lastConfirmedPoint.y,
                    coord.x,
                    coord.y
                ) > 0.02
            ) {
                this.coords.push(this.lastCoord);
            }
        }
        if (this.coords.length - this.unsmoothedIndex > 100) {
            this.smoothCoords(this.unsmoothedIndex);
        }

        this.lastCoord = coord;
    };

    distanceToPoint = function (line, point) {
        let x1 = line.p1.x;
        let y1 = line.p1.y;
        let x2 = line.p2.x;
        let y2 = line.p2.y;
        let xp = point.x;
        let yp = point.y;
        let ydif = y2 - y1;
        let xdif = x2 - x1;
        let denominator = Math.sqrt(ydif * ydif + xdif * xdif);
        if (denominator !== 0) {
            return (
                Math.abs(ydif * xp - xdif * yp + x2 * y1 - y2 * x1) /
                denominator
            );
        } else {
            return 0;
        }
    };

    douglasPeucker = function (points, tolerance) {
        if (points.length <= 2) {
            return [points[0]];
        }

        let returnPoints = [];
        // make line from start to end
        let line = { p1: points[0], p2: points[points.length - 1] };
        // find the largest distance from intermediate poitns to this line
        let maxDistance = 0;
        let maxDistanceIndex = 0;
        for (let i = 1; i <= points.length - 2; i++) {
            let distance = this.distanceToPoint(line, points[i]);
            if (distance > maxDistance) {
                maxDistance = distance;
                maxDistanceIndex = i;
            }
        }

        // check if the max distance is greater than our tollerance allows
        if (maxDistance >= tolerance) {
            let p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            // include this point in the output
            returnPoints = returnPoints.concat(
                this.douglasPeucker(
                    points.slice(0, maxDistanceIndex + 1),
                    tolerance
                )
            );
            returnPoints = returnPoints.concat(
                this.douglasPeucker(
                    points.slice(maxDistanceIndex, points.length),
                    tolerance
                )
            );
        } else {
            // ditching this point
            let p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            returnPoints = [points[0]];
        }
        return returnPoints;
    };

    smoothCoords = function (startIndex) {
        // rdp algorithm
        let toSmoothCoords = this.coords.slice(startIndex);
        let coords = this.douglasPeucker(toSmoothCoords, 0.002);
        coords.push(this.coords[this.coords.length - 1]);
        this.coords = this.coords.slice(0, startIndex).concat(coords);

        this.unsmoothedIndex = this.coords.length - 1;
    };

    drawSmooth = function (context, points) {
        // move to the first point
        context.moveTo(points[0].x, points[0].y);

        let i;
        for (i = 1; i < points.length - 2; i++) {
            let xc = (points[i].x + points[i + 1].x) / 2;
            let yc = (points[i].y + points[i + 1].y) / 2;
            context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        // curve through the last two points
        context.quadraticCurveTo(
            points[i].x,
            points[i].y,
            points[i + 1].x,
            points[i + 1].y
        );
    };

    getDrawingProperties = function () {
        let lineWidth = this.hasBorder
            ? this.lineWidth - this.arrowBorderWidth
            : this.lineWidth;
        let arrowBorderWidth = this.hasBorder ? this.arrowBorderWidth : 0;
        let lineBorderWidth = this.hasBorder ? this.lineBorderWidth : 0;
        let borderColor = this.hasBorder ? this.borderColor : 'rgba(0,0,0,0)';
        let arrowHeadWidth = lineWidth + 28;
        return {
            arrowBorderWidth: arrowBorderWidth,
            arrowHeadWidth: arrowHeadWidth,
            borderColor: borderColor,
            lineBorderWidth: lineBorderWidth,
            lineDash: [50 + 5 / this.zAngle, 25 + 5 / this.zAngle],
            lineDashOffset: this.timer / (0.3 + this.zAngle),
            lineWidth: lineWidth,
        };
    };

    draw = function (context) {
        if (this.coords.length > 2) {
            this.manager.setObjectPerspectiveMode(this, context);
            let props = this.getDrawingProperties();
            let dots = this.getAbsolutePositionCoords();

            // now draw the inner secondary color arcs ars
            context.save();
            if (this.animation) {
                this.animation.set(context);
            }

            Utils.drawArrowHead(
                context,
                dots[dots.length - 2],
                dots[dots.length - 1],
                props.arrowHeadWidth,
                props.arrowBorderWidth,
                this.borderColor,
                this.color,
                this.hasBorder,
                true
            );

            context.beginPath();
            this.drawSmooth(context, dots);

            if (this.type === 1) {
                context.setLineDash(props.lineDash);
                context.lineDashOffset = Math.round(props.lineDashOffset);
            }

            context.lineWidth = props.lineWidth + props.lineBorderWidth;
            context.strokeStyle = props.borderColor;
            context.stroke();

            context.lineWidth = props.lineWidth;
            context.strokeStyle = this.color;
            context.stroke();

            context.restore();
            this.manager.unsetPerspectiveMode(context);
        }
    };
}

export class Arrow {
    constructor(manager, color, borderColor, hasBorder, zAngle) {
        this.dots = [];
        this.color = color;
        this.borderColor = borderColor;
        this.zAngle = zAngle;
        this.manager = manager;
        this.type = 0; // 0 - default, 1 - dashed
        this.timer = 0;
        this.lineWidth = 28;
        this.arrowBorderWidth = 8;
        this.lineBorderWidth = 12;
        this.hasBorder = hasBorder;
    }

    close = function () {
        this.dots.pop();
    };

    setColor = function (newColor) {
        this.color = newColor;
    };

    setZAngle = function (zAngle) {
        this.zAngle = zAngle;
    };

    setWidth = function (width) {
        this.lineWidth = width;
    };

    isComplete = function () {
        return this.dots.length > 0;
    };

    addPoint = function (point) {
        this.dots.push(point);
    };

    update = function (delta) {
        this.timer -= delta * 50;
    };

    switchType = function () {
        this.type = this.type === 0 ? 1 : 0;
    };

    finishArrow = function () {
        this.animation = new FadeInOutAnimation(
            this.manager,
            this.manager.config.FADE_IN_TIME,
            this,
            0,
            false
        );
    };

    setFirstPoint = function (point) {
        if (this.dots.length > 0) {
            this.dots[0].x = point.x;
            this.dots[0].y = point.y;
        }
    };

    setLastPoint = function (point) {
        if (this.dots.length > 0) {
            this.dots[this.dots.length - 1].x = point.x;
            this.dots[this.dots.length - 1].y = point.y;
        }
    };

    getSecondLastPoint = function () {
        return this.dots[this.dots.length - 2];
    };

    getLastPoint = function (point) {
        return this.dots[this.dots.length - 1];
    };

    getAbsolutePositionDots = function () {
        return this.dots.reduce((list, dot) => {
            list.push(this.manager.transformToAbsolutePosition(dot, this));
            return list;
        }, []);
    };

    getDrawingProperties = function () {
        let lineWidth = this.hasBorder
            ? this.lineWidth - this.arrowBorderWidth
            : this.lineWidth;
        let arrowBorderWidth = this.hasBorder ? this.arrowBorderWidth : 0;
        let lineBorderWidth = this.hasBorder ? this.lineBorderWidth : 0;
        let borderColor = this.hasBorder
            ? this.borderColor
            : 'rgba(0, 0, 0, 0)';
        let arrowHeadWidth = lineWidth + 28;
        return {
            arrowBorderWidth: arrowBorderWidth,
            arrowHeadWidth: arrowHeadWidth,
            borderColor: borderColor,
            lineBorderWidth: lineBorderWidth,
            lineDash: [50 + 5 / this.zAngle, 25 + 5 / this.zAngle],
            lineDashOffset: this.timer / (0.3 + this.zAngle),
            lineWidth: lineWidth,
        };
    };

    draw = function (context) {
        if (this.dots.length > 1) {
            this.manager.setObjectPerspectiveMode(this, context);
            let dots = this.getAbsolutePositionDots();
            let props = this.getDrawingProperties();

            // now draw the inner secondary color arcs ars
            context.save();
            if (this.animation) {
                this.animation.set(context);
            }

            // draw arrow
            Utils.drawArrowHead(
                context,
                dots[dots.length - 2],
                dots[dots.length - 1],
                props.arrowHeadWidth,
                props.arrowBorderWidth,
                this.borderColor,
                this.color,
                this.hasBorder,
                true
            );

            context.shadowBlur = 4;
            context.shadowColor = 'rgba(0,0,0,0.8)';

            context.lineJoin = 'round';

            context.beginPath();
            context.moveTo(dots[0].x, dots[0].y);
            for (let i = 1; i < dots.length; i++) {
                context.lineTo(dots[i].x, dots[i].y);
            }

            context.shadowBlur = 2;

            if (this.type === 1) {
                context.setLineDash(props.lineDash);
                context.lineDashOffset = Math.round(props.lineDashOffset);
            }

            context.lineWidth = props.lineWidth + props.lineBorderWidth;
            context.strokeStyle = props.borderColor;
            context.stroke();

            context.lineWidth = props.lineWidth;
            context.strokeStyle = this.color;
            context.stroke();

            context.restore();
            this.manager.unsetPerspectiveMode(context);
        }
    };

    readyToFinish = function () {
        let ready = false;
        if (this.dots.length === 2) {
            if (
                Utils.dist(
                    this.dots[0].x,
                    this.dots[0].y,
                    this.dots[1].x,
                    this.dots[1].y
                ) > 0.002
            ) {
                ready = true;
            }
        }
        return ready;
    };
}

export const Utils = {};

Utils.getLastPointWithoutHeadLength = function (slp, lp, arrowLength) {
    let angle = Math.atan2(lp.y - slp.y, lp.x - slp.x);
    return {
        x: lp.x - Math.cos(angle) * arrowLength,
        y: lp.y - Math.sin(angle) * arrowLength,
    };
};

Utils.getHeadDots = function (slp, lp, arrowLength) {
    let angle = Math.atan2(lp.y - slp.y, lp.x - slp.x);
    let hd = {
        x: lp.x + Math.cos(angle) * arrowLength,
        y: lp.y + Math.sin(angle) * arrowLength,
    }; // head dot
    let bd = {
        x: lp.x + (Math.cos(Math.PI / 2 + angle) * arrowLength) / 2,
        y: lp.y + (Math.sin(Math.PI / 2 + angle) * arrowLength) / 2,
    }; // base dot
    let bd2 = { x: 2 * lp.x - bd.x, y: 2 * lp.y - bd.y };

    return { hd, bd, bd2 };
};

Utils.drawArrowHead = function (
    context,
    fp,
    sp,
    arrowLength,
    borderWidth,
    borderColor,
    innerColor,
    stroke,
    fill
) {
    const { hd, bd, bd2 } = this.getHeadDots(fp, sp, arrowLength);
    context.beginPath();
    context.moveTo(bd.x, bd.y);
    context.lineTo(bd2.x, bd2.y);
    context.lineTo(hd.x, hd.y);
    context.closePath();

    if (stroke) {
        context.lineWidth = borderWidth;
        context.strokeStyle = borderColor;
        context.stroke();
    }

    if (fill) {
        context.fillStyle = innerColor;
        context.fill();
    }
};

Utils.sqr = function (x) {
    return x * x;
};

Utils.dist2 = function (x1, y1, x2, y2) {
    return Utils.sqr(x1 - x2) + Utils.sqr(y1 - y2);
};

Utils.dist = function (x1, y1, x2, y2) {
    return Math.sqrt(Utils.dist2(x1, y1, x2, y2));
};
