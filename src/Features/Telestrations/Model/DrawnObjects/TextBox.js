export class TextBox {
    constructor(manager, backgroundColor, color, fontFamily, fontSize) {
        this.padding = 10;

        this.backgroundColor = backgroundColor;
        this.color = color;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;

        this.width = 30;
        this.height = this.fontSize + this.padding * 2;

        this.manager = manager;
        this.position = null;
        this.text = '';

        this.borderWidth = 6;
    }

    applyFont = function (context) {
        context.font = 'bold ' + this.fontSize + 'px ' + this.fontFamily;
    };

    calculateBoxSize = function (context) {
        this.width = 2 * this.padding + this.getTextWidth(context);
        this.height = 2 * this.padding + this.getTextHeight();
    };

    getPrintName = function () {
        return 'Text Box';
    };

    setPosition = function (position) {
        this.position = position;
    };

    setTextColor = function (color) {
        this.color = color;
    };

    setBackgroundColor = function (color) {
        this.backgroundColor = color;
    };

    setText = function (text, context) {
        this.text = text;
        this.calculateBoxSize(context);
    };

    setFontSize = function (fontSize, context) {
        this.fontSize = fontSize;
        this.calculateBoxSize(context);
    };

    getLineHeight = function () {
        return this.fontSize * 1.2;
    };

    getTextWidth = function (context) {
        context.save();
        this.applyFont(context);

        let text = this.getSplitText();
        let max = 0;
        for (let i = 0; i < text.length; i++) {
            let width = context.measureText(text[i]).width;
            max = Math.max(width, max);
        }
        context.restore();
        return max;
    };

    getTextHeight = function (context) {
        let text = this.getSplitText();
        return text.length * this.getLineHeight();
    };

    draw = function (context) {
        if (this.position) {
            let position = this.manager.transformToAbsolutePosition(
                this.position,
                this
            );
            context.save();

            if (this.animation) {
                this.animation.set(context);
            }

            context.fillStyle = 'white';
            context.fillRect(
                position.x - this.borderWidth,
                position.y - this.borderWidth,
                this.width + 2 * this.borderWidth,
                this.height + 2 * this.borderWidth
            );
            context.fillStyle = '#B4B4AE';
            var innerBorderWidth = 1;
            context.fillRect(
                position.x - innerBorderWidth,
                position.y - innerBorderWidth,
                this.width + 2 * innerBorderWidth,
                this.height + 2 * innerBorderWidth
            );

            var gradient = context.createLinearGradient(
                position.x,
                position.y,
                position.x,
                position.y + this.height
            );
            gradient.addColorStop(0, '#C8C8C4');
            gradient.addColorStop(0.3, '#979690');
            gradient.addColorStop(0.7, '#979690');
            gradient.addColorStop(1, '#C7C7C3');
            context.fillStyle = gradient;
            context.fillRect(position.x, position.y, this.width, this.height);

            context.save();
            context.globalAlpha = context.globalAlpha * 0.2;
            context.fillStyle = this.backgroundColor;
            context.fillRect(position.x, position.y, this.width, this.height);
            context.restore();

            this.drawText(context, position);

            context.restore();
        }
    };

    drawText = function (context, position) {
        var text = this.getSplitText();

        context.textBaseline = 'middle';
        context.textAlign = 'left';
        context.fillStyle = this.color;
        this.applyFont(context);

        var textY = position.y + this.padding + this.getLineHeight() / 2;
        for (var i = 0; i < text.length; i++) {
            context.fillText(text[i], position.x + this.padding, textY);
            textY += this.getLineHeight();
        }
    };

    getSplitText = function () {
        return this.text.split('\n');
    };
}
