export class Rectangle {
    constructor(manager, color, lineWidth, opacity) {
        this.color = color;
        this.lineWidth = lineWidth;
        this.opacity = opacity;

        this.manager = manager;
        this.points = [];
    }

    copyPoints = function (otherr) {
        for (let i = 0; i < otherr.points.length; i++) {
            this.points.push({ x: otherr.points[i].x, y: otherr.points[i].y });
        }
    };

    addPoint = function (point) {
        if (this.points.length < 2) {
            this.points.push(point);
        }
    };

    setLastPointPosition = function (position) {
        if (this.points.length > 0) {
            this.points[this.points.length - 1].x = position.x;
            this.points[this.points.length - 1].y = position.y;
        }
    };

    getCenterPosition = function () {
        let width = this.getWidth();
        let height = this.getHeight();

        return {
            x: this.points[0].x + width / 2,
            y: this.points[0].y + height / 2,
        };
    };

    setCenterPosition = function (position) {
        let center = this.getCenterPosition();

        this.points[0].x += position.x - center.x;
        this.points[0].y += position.y - center.y;

        this.points[1].x += position.x - center.x;
        this.points[1].y += position.y - center.y;
    };

    getAbsoluteWidth = function () {
        return this.getWidth() * this.manager.canvas.width;
    };

    getAbsoluteHeight = function () {
        return this.getHeight() * this.manager.canvas.height;
    };

    getAbsolutePositionPoints = function () {
        let points = [];
        for (let i = 0; i < this.points.length; i++) {
            points.push(
                this.manager.transformToAbsolutePosition(this.points[i], this)
            );
        }
        return points;
    };

    getWidth = function () {
        return this.points[1].x - this.points[0].x;
    };

    getHeight = function () {
        return this.points[1].y - this.points[0].y;
    };

    draw = function (context) {
        if (this.points.length > 1) {
            let absPoints = this.getAbsolutePositionPoints();
            let width = absPoints[1].x - absPoints[0].x;
            let height = absPoints[1].y - absPoints[0].y;

            context.save();
            if (this.opacity < 1) {
                context.globalAlpha = this.opacity;
            }
            context.lineWidth = this.lineWidth;
            context.strokeStyle = this.color;

            context.beginPath();
            context.rect(absPoints[0].x, absPoints[0].y, width, height);
            context.stroke();

            context.restore();
        }
    };

    sortPoints = function () {
        let minx = Math.min(this.points[0].x, this.points[1].x);
        let maxx = Math.max(this.points[0].x, this.points[1].x);

        let miny = Math.min(this.points[0].y, this.points[1].y);
        let maxy = Math.max(this.points[0].y, this.points[1].y);

        this.points[0].x = minx;
        this.points[1].x = maxx;
        this.points[0].y = miny;
        this.points[1].y = maxy;
    };
}
