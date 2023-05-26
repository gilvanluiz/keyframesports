export class TextBox {
    constructor(manager, color, fontFamily, fontSize) {
        this.padding = 10;

        this.color = color;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.opacity = 1;
        this.width = 170;
        this.height = this.fontSize + this.padding * 2;
        this.backgroundEnable = true;
        this.backgroundImage = document.querySelector('#textboxback');
        
        this.manager = manager;
        this.position = null;
        this.text = 'This is some text';

        this.maskEnable = true;
    }
    getSize = function () {
        return this.fontSize;
    };
    switchMaskEnable = function () {
        this.maskEnable = !this.maskEnable;
    };
    applyFont = function (context) {
        context.font = 'bold ' + this.fontSize + 'px ' + this.fontFamily;
    };

    calculateBoxSize = function () {
        this.width = 2 * this.padding + this.getTextWidth(this.manager.context);
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

    setColor = function (color) {
        this.setTextColor(color);
    };

    getText = function () {
        return this.text;
    };

    setText = function (text) {
        this.text = text;
        this.calculateBoxSize();
    };
    setSize = function (size) {
        this.setFontSize(size);
    };
    setFontSize = function (fontSize) {
        this.fontSize = fontSize;
        this.calculateBoxSize();
    };

    getFontSize = function () {
        return this.fontSize;
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
            } else {
                context.globalAlpha = this.opacity;
            }

            if (this.backgroundEnable) {
                context.drawImage(
                    this.backgroundImage,
                    position.x,
                    position.y,
                    this.width,
                    this.height
                );
                context.restore();
            }

            this.drawText(context, position);
            context.restore();
        }
    };

    switchBackgroundEnable = function () {
        this.backgroundEnable = !this.backgroundEnable;
    };

    drawText = function (context, position) {
        var text = this.getSplitText();
        context.globalAlpha = this.opacity;
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
    getTextBackgroundEnable() {
        return this.backgroundEnable;
    }
    getSplitText = function () {
        return this.text.split('\n');
    };
}
