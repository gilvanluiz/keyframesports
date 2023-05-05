import { Cursor } from './DrawnObjects/Cursor';
import PointyLight from '../Assets/pointyLight.png';
import ShinyLight from '../Assets/shinyLight.png';
import SharpLight from '../Assets/sharpLight.png';
import { ActionManager, ActionTypeEnum } from './Action';
import { ChromaKeySettings } from './ChromaKeySettings';
import { Arrow, FreehandArrow } from './DrawnObjects/Arrows';
import { Polygon } from './DrawnObjects/Polygon';
import { LightShaft } from './DrawnObjects/LightShaft';
import { PlayerCutOut } from './DrawnObjects/PlayerCutOut';
import { LinkedCursor } from './DrawnObjects/LinkedCursor';
import { TextBox } from './DrawnObjects/TextBox.js';
import Watermark from '../Assets/KeyframeWatermark.png';
import { FadeInOutAnimation } from './Animations/FadeInOutAnimation';
import { WebGLUtils } from '../Utils/WebGLUtils';

import { gsap } from 'gsap';

import {
    telestrationCircleAplied,
    telestrationHaloAplied,
    telestrationLinkAdded,
    telestrationLinkFinished,
    telestrationMaskAplied,
    telestrationPolygonFinishedDrawing,
    telestrationPolygonStartedDrawing,
} from 'src/App/UserEvents';
import { sendUserEvent } from 'src/App/UserEvents/UserEventManager';
import { Rectangle } from './DrawnObjects/Rectangle';
import { DrawnObjectDetail } from './DrawnObjectDetail';

const videoId = window.location.pathname.split('/').pop();

export default class TelestrationManager {
    constructor() {
        this.videoBackgroundCanvas = document.createElement('canvas');
        this.videoBackgroundContext = this.videoBackgroundCanvas.getContext(
            '2d'
        );

        this.videoForegroundCanvas = document.createElement('canvas');
        this.videoForegroundContext = this.videoForegroundCanvas.getContext(
            '2d'
        );

        this.canvas = null; // 2d visible screen canvas
        this.context = null;
        this.telestrationCanvas = document.createElement('canvas'); // texture for the 3d scene
        this.telestrationContext = this.telestrationCanvas.getContext('2d');

        this.recordCanvas = null;
        this.recordContext = null;

        this.onPerspective = false;
        this.mousePosition = { x: -1000, y: -1000 };

        this.config = {
            ARROW_HAS_BORDER: true,
            ARROW_BORDER_COLOR: 'white',
            ARROW_COLOR: '#cc0000',
            CURSOR_COLOR: '#cc0000',
            PLAYER_CUT_OUT_ARROW_COLOR: '#cc0000',
            FADE_IN_TIME: 1,
            FADE_OUT_TIME: 0.5,
            MAX_CURSOR_RADIUS: 200,
            MAX_LIGHTSHAFT_RADIUS: 200,
            MAX_ARROW_WIDTH: 50,
            MAX_Z_ANGLE: 1,
            MIN_CURSOR_RADIUS: 10,
            MIN_LIGHTSHAFT_RADIUS: 10,
            MIN_ARROW_WIDTH: 15,
            MIN_Z_ANGLE: 0.2,
            POLYGON_BORDER_COLOR: 'black',
            POLYGON_COLOR: '#EF3E46',
            POLYGON_OPACITY: 0.5,
            TEXT_BOX_BACKGROUND_COLOR: '#FFFFFF',
            TEXT_BOX_COLOR: '#000000',
            TEXT_BOX_FONT_FAMILY: 'Arial',
            TEXT_BOX_FONT_SIZE: 18,
            WHEEL_ALTER_SPEED: 0.03,
            Z_ANGLE_ALTER_SPEED: 0.0005,
        };

        this.angleTimeOffset = 0;
        this.cursorRadius = 40;
        this.lightShaftRadius = 36;

        this.arrowWidth = 28;

        this.zAngle = 0.36;
        this.xAngle = 1;

        this.shiftDown = false;
        this.controlDown = false;

        this.FUNCTION_ENUM = {
            CAPTURE_KEYFRAMES: 1,
            CHROMA_KEY_PICKER: 6,
            LIVE_MODE: 2,
            LIVE_MODE_PLACE_CURSOR: 3,
            NONE: 0,
            PLACE_ARROW_POINT: 4,
            PLACE_LIGHT_SHAFT: 7,
            PLACE_LINKED_CURSOR: 11,
            PLACE_POLYGON: 8,
            PLACE_SMOOTH_ARROW: 5,
            PLACE_STRAIGHT_ARROW: 9,
            PLAYER_CUT_OUT: 10,
            PLACE_TEXT_BOX: 13,
            SELECT_SHAPE: 14,
        };

        this.currentFunction = this.FUNCTION_ENUM.LIVE_MODE;
        this.initializeCurrentFunction();
        this.isRecording = false;

        this.cursors = [];
        this.linkedCursors = [];

        this.creationObject = null;
        this.closingObjects = [];

        this.arrows = [];
        this.freehandArrows = [];

        this.lightShafts = [];
        this.closingLightShafts = [];

        this.polygons = [];
        this.playerCutOuts = [];

        this.textBoxes = [];

        this.selectedShapes = [];

        this.addedShapes = [];

        this.lastFrame = 0;
        this.initializeHelperImages();

        this.actionManager = new ActionManager(this);

        this.chromaKey = new ChromaKeySettings(this);
        this.chromaKeyPrepared = false;
    }

    initializeHelperImages = function () {
        this.pointyLightImage = new Image();
        this.pointyLightImage.src = PointyLight;
        this.shinyLightImage = new Image();
        this.shinyLightImage.src = ShinyLight;
        this.sharpLightImage = new Image();
        this.sharpLightImage.src = SharpLight;
        this.watermarkImage = new Image();
        this.watermarkImage.src = Watermark;
    };
    renderTelestrationCanvas = function () {
        this.drawCursors();
        this.drawArrows();
        this.drawPolygons();
        this.drawClosingObjects(false);
        this.drawCreationTelestrations(this.nonRecordableContext);
        this.drawLightShafts(this.context, true);
    };

    renderPostChromaKeyTelestrations = function () {
        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.PLACE_LIGHT_SHAFT:
                this.drawCreationLightShaft(this.nonRecordableContext, false);
                break;
            case this.FUNCTION_ENUM.PLAYER_CUT_OUT:
                this.creationObject.draw(
                    this.nonRecordableContext,
                    this.getVideoTime(),
                    false,
                    this.nonRecordableContext
                );
                break;
            case this.FUNCTION_ENUM.SELECT_SHAPE:
                this.creationObject.draw(this.nonRecordableContext);
                break;
        }

        this.drawLightShafts(this.context, false);
        this.drawPlayerCutOuts();
        this.drawClosingObjects(true);
        this.drawTextBoxes(this);
    };

    draw = function () {
        this.clearCanvases();

        // prepare chroma key and draw background
        if (this.chromaKeyEnabled() && this.video.paused) {
            if (!this.chromaKeyPrepared) {
                this.prepareChromaKeyCanvas();
            }

            this.drawChromaKeyBackground();
        } else {
            this.chromaKeyPrepared = false;
            this.drawVideo();
        }

        if (this.currentFunction != this.FUNCTION_ENUM.CHROMA_KEY_PICKER) {
            this.renderTelestrationCanvas();
            this.drawTelestrationCanvas();
        }

        // if exists, draw foreground
        if (this.chromaKeyEnabled() && this.video.paused) {
            this.drawChromaKeyForeground();
        }

        if (this.currentFunction != this.FUNCTION_ENUM.CHROMA_KEY_PICKER) {
            this.renderPostChromaKeyTelestrations();
        }

        this.renderRecordingCanvas();
    };

    getBaseLightShaftRadius = function () {
        return this.lightShaftRadius;
    };

    setVideo = function (video) {
        this.video = video;
        this.chromaKeyPrepared = false;
    };

    getVideoTime = function () {
        return this.video ? this.video.currentTime : 0;
    };

    setCanvas = function (canvas, cursorCanvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.telestrationCanvas.width = this.canvas.width;
        this.telestrationCanvas.height = this.canvas.height;

        this.nonRecordableCanvas = cursorCanvas;
        this.nonRecordableContext = cursorCanvas.getContext('2d');
    };

    setRecordCanvas = function (canvas) {
        this.recordCanvas = canvas;
        this.recordContext = canvas.getContext('2d');
    };

    chromaKeyEnabled = function () {
        return this.chromaKey.enabled;
    };

    drawChromaKeyBackground = function () {
        this.context.drawImage(this.videoBackgroundCanvas, 0, 0);
    };

    drawVideo = function () {
        let dimensions = Utils.resizeImage(
            this.video,
            this.canvas.width,
            this.canvas.height,
            true
        );
        this.context.drawImage(
            this.video,
            0,
            0,
            dimensions.width,
            dimensions.height
        );
    };

    drawTelestrationCanvas = function () {
        this.context.drawImage(this.telestrationCanvas, 0, 0);
    };

    pickChromaPixelActionTrigger = function () {
        if (this.mouseInCanvas()) {
            this.pickChromaKey();
            this.actionManager.pushAction(ActionTypeEnum.CHROMA_KEY_PICK);
            this.chromaKeyPrepared = false;
            sendUserEvent(
                telestrationMaskAplied,
                window.location.href,
                videoId
            );
        }
    };

    triggerUndo = function () {
        this.actionManager.undoAction();
        this.prepareChromaKeyCanvas();
    };

    // pre: mousePosition is within canvas
    pickChromaKey = function () {
        let x = Math.round(this.mousePosition.x);
        let y = Math.round(this.mousePosition.y);

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;

        let dimensions = Utils.resizeImage(
            this.video,
            this.canvas.width,
            this.canvas.height,
            true
        );
        context.drawImage(
            this.video,
            0,
            0,
            dimensions.width,
            dimensions.height
        );

        let videoImageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        ).data;

        let pixelCoord = (y * this.canvas.width + x) * 4;

        let r = videoImageData[pixelCoord];
        let g = videoImageData[pixelCoord + 1];
        let b = videoImageData[pixelCoord + 2];

        this.chromaKey.addHuePoint(r, g, b);
    };

    prepareChromaKeyCanvas = function () {
        let dimensions = Utils.resizeImage(
            this.video,
            this.canvas.width,
            this.canvas.height,
            true
        );

        this.videoBackgroundCanvas.width = this.canvas.width;
        this.videoBackgroundCanvas.height = this.canvas.height;
        this.videoForegroundCanvas.width = this.canvas.width;
        this.videoForegroundCanvas.height = this.canvas.height;
        this.videoBackgroundContext.drawImage(
            this.video,
            0,
            0,
            dimensions.width,
            dimensions.height
        );

        let backgroundImageData = this.videoBackgroundContext.getImageData(
            0,
            0,
            this.videoBackgroundCanvas.width,
            this.videoBackgroundCanvas.height
        );
        let dbackground = backgroundImageData.data;

        let foregroundImageData = new ImageData(
            backgroundImageData.width,
            backgroundImageData.height
        );
        let dforeground = foregroundImageData.data;

        let nonBlack = false;
        let cy;
        let cx;

        let playerCutOutsPositions = [];

        this.playerCutOuts.forEach((playerCutOut) => {
            const {
                x: x1,
                y: y1,
            } = playerCutOut.firstRectangle.getAbsolutePositionPoints()[0];
            const x2 = playerCutOut.firstRectangle.getAbsoluteWidth() + x1;
            const y2 = playerCutOut.firstRectangle.getAbsoluteHeight() + y1;
            playerCutOutsPositions.push({
                x1: Math.floor(x1),
                y1: Math.floor(y1),
                x2: Math.floor(x2),
                y2: Math.floor(y2),
            });
        });

        for (let i = 0; i < dbackground.length; i += 4) {
            let r = dbackground[i];
            let g = dbackground[i + 1];
            let b = dbackground[i + 2];
            let a = dbackground[i + 3];
            dforeground[i] = r;
            dforeground[i + 1] = g;
            dforeground[i + 2] = b;
            dforeground[i + 3] = a;

            if (r != 0 || b != 0 || g != 0 || a != 0) {
                nonBlack = true;
            }

            if (this.chromaKey.isChromaBackground(r, g, b, a)) {
                dforeground[i + 3] = 0;
                // on chroma_key_picker mode, draw background in purple
                if (
                    this.currentFunction == this.FUNCTION_ENUM.CHROMA_KEY_PICKER
                ) {
                    let ckColor = { r: 174, g: 32, b: 29 };
                    // add with 50% opacity
                    dbackground[i] = dbackground[i] * 0.5 + ckColor.r * 0.5;
                    dbackground[i + 1] =
                        dbackground[i + 1] * 0.5 + ckColor.g * 0.5;
                    dbackground[i + 2] =
                        dbackground[i + 2] * 0.5 + ckColor.b * 0.5;
                }
            } else {
                cx = (i / 4) % this.canvas.width;
                cy = Math.floor(i / 4 / this.canvas.width);

                let currentPlayerCutOutPosition = playerCutOutsPositions.find(
                    ({ x1, x2, y1, y2 }) =>
                        Utils.inRange(cx, x1, x2) && Utils.inRange(cy, y1, y2)
                );

                if (currentPlayerCutOutPosition && cx && cy) {
                    let index =
                        (currentPlayerCutOutPosition.x1 +
                            currentPlayerCutOutPosition.y1 *
                                this.canvas.width) *
                        4;
                    let coColor = { r: 127, g: 133, b: 140, a: 255 * 0.65 };
                    dforeground[i] = coColor.r;
                    dforeground[i + 1] = coColor.g;
                    dforeground[i + 2] = coColor.b;
                    dforeground[i + 3] = coColor.a;
                }

                dbackground[i + 3] = 0;
            }
        }

        this.chromaKeyPrepared = nonBlack;

        this.videoBackgroundContext.putImageData(backgroundImageData, 0, 0);
        this.videoForegroundContext.putImageData(foregroundImageData, 0, 0);
    };

    calculateChromaKeyLayer = function (glContext, targetCanvas, isBackground) {
        WebGLUtils.setGLContext(glContext);
        WebGLUtils.resizeAndClear();

        let shaders = this.chromaKey.getShader();
        let shaderParameters = this.chromaKey.getShaderParameters(
            glContext,
            isBackground
        );

        WebGLUtils.applyShader(
            this.canvas,
            targetCanvas,
            shaders.vert,
            shaders.frag,
            glContext,
            shaderParameters
        );
    };

    drawChromaKeyForeground = function () {
        this.context.drawImage(this.videoForegroundCanvas, 0, 0);
    };

    clearCanvases = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.telestrationContext.clearRect(
            0,
            0,
            this.telestrationCanvas.width,
            this.telestrationCanvas.height
        );
        this.nonRecordableContext.clearRect(
            0,
            0,
            this.nonRecordableCanvas.width,
            this.nonRecordableCanvas.height
        );
    };

    setObjectPerspectiveMode = function (object, context) {
        let xAngle = object.xAngle || this.xAngle;
        let zAngle = object.zAngle || this.zAngle;
        this.setPerspectiveMode(context, xAngle, zAngle);
    };

    setPerspectiveMode = function (context, xAngle, zAngle) {
        context.save();
        this.onPerspective = true;
        context.scale(xAngle, zAngle);
    };

    unsetPerspectiveMode = function (context) {
        this.onPerspective = false;
        context.restore();
    };

    isPostChromaKeyObject = function (obj) {
        return obj instanceof PlayerCutOut || obj instanceof LightShaft;
    };

    drawTextBoxes = function () {
        this.textBoxes.map((textbox) => textbox.draw(this.context));
    };

    drawCreationTelestrations = function (context) {
        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.LIVE_MODE_PLACE_CURSOR:
                this.creationCursor.draw(context);
                break;
            case this.FUNCTION_ENUM.PLACE_ARROW_POINT:
            case this.FUNCTION_ENUM.PLACE_SMOOTH_ARROW:
            case this.FUNCTION_ENUM.PLACE_STRAIGHT_ARROW:
                this.drawCreationArrow(context);
                break;
            case this.FUNCTION_ENUM.PLACE_POLYGON:
                this.drawCreationPolygon(context);
                break;
            case this.FUNCTION_ENUM.PLACE_LINKED_CURSOR:
                this.drawCreationObject(context);
                break;
            case this.FUNCTION_ENUM.PLACE_LIGHT_SHAFT:
                this.drawCreationLightShaft(context, true);
                break;
        }
    };

    setShadowBlur = function (context) {
        context.shadowBlur = 10;
        context.shadowColor = 'rgba(255,255,255,0.8)';
    };

    renderRecordingCanvas = function () {
        this.recordContext.drawImage(this.canvas, 0, 0);
        this.renderWatermark(this.recordContext);
    };

    renderWatermark = function (context) {
        let userEmail = localStorage.getItem('username');
        let excludedList = [
            'coachkevin@bluefiresoccer.com',
            'gary@modernsoccercoach.com',
            'hectik_greek9@hotmail.com',
            'markrobert.colvin@gmail.com',
            'pconnolly1981@gmail.com',
            'randy@radiusathletics.com',
            'jwalker@huskers.com',
            'ibridge@huskers.com',
            'meverding@huskers.com',
            'crobertson@huskers.com',
            'melissa.phillips@londoncitylionesses.com',
        ];
        if (userEmail) {
            return;
        }

        if (this.watermarkImage && this.watermarkImage.width > 0) {
            let dimensions = Utils.resizeImage(
                this.watermarkImage,
                context.canvas.width * 0.8,
                context.canvas.height * 0.8
            );
            context.save();
            context.globalAlpha = 0.3;
            context.drawImage(
                this.watermarkImage,
                context.canvas.width * 0.5 - dimensions.width * 0.5,
                context.canvas.height * 0.5 - dimensions.height * 0.5,
                dimensions.width,
                dimensions.height
            );
            context.restore();
        }
    };

    drawLightShafts = function (context, background) {
        let time = this.getVideoTime();
        this.lightShafts.map((lightshaft) =>
            lightshaft.draw(context, time, background)
        );
        this.closingLightShafts.map((lightshaft) =>
            lightshaft.draw(context, time, background)
        );
    };

    drawPlayerCutOuts = function () {
        let time = this.getVideoTime();
        this.playerCutOuts.map((cu) =>
            cu.draw(this.context, time, false, this.nonRecordableContext)
        );
    };

    drawPolygons = function () {
        this.polygons.map((polygon) => polygon.draw(this.telestrationContext));
    };

    drawArrows = function () {
        this.arrows.map((arrow) => arrow.draw(this.telestrationContext));
        this.freehandArrows.map((arrow) =>
            arrow.draw(this.telestrationContext)
        );
    };

    drawCreationObject = function (context) {
        this.creationObject.draw(
            context,
            this.getVideoTime(),
            false,
            this.nonRecordableContext
        );
    };

    drawCreationArrow = function (context) {
        if (this.creationObject) {
            this.creationObject.draw(context);
        }
    };

    drawCreationPolygon = function (context) {
        if (this.creationObject) {
            this.creationObject.draw(context);
        }
    };

    drawCreationLightShaft = function (context, background) {
        if (this.creationLightShaft) {
            this.creationLightShaft.draw(
                context,
                this.getVideoTime(),
                background
            );
        }
    };

    drawClosingCursors = function () {
        for (let i = 0; i < this.closingCursors.length; i++) {
            this.closingCursors[i].draw(this.telestrationContext);
        }
    };

    drawClosingObjects = function (postChromaKey) {
        for (let i = 0; i < this.closingObjects.length; i++) {
            const obj = this.closingObjects[i];
            if (!(postChromaKey ^ this.isPostChromaKeyObject(obj))) {
                obj.draw(
                    this.context,
                    this.getVideoTime(),
                    false,
                    this.nonRecordableContext
                );
            }
        }
    };

    removeClosingObject = function (element) {
        // draw and remove from there
        for (let i = 0; i < this.closingLightShafts.length; i++) {
            if (this.closingLightShafts[i] == element) {
                this.closingLightShafts.splice(i, 1);
                return;
            }
        }
        for (let i = 0; i < this.closingObjects.length; i++) {
            if (this.closingObjects[i] == element) {
                this.closingObjects.splice(i, 1);
                return;
            }
        }
    };

    undoChromaKey = function () {
        this.chromaKey.popHuePoint();
        this.chromaKeyPrepared = false;
    };

    resetChromaKey = function () {
        this.chromaKey.reset();
        this.chromaKeyPrepared = false;
    };

    clearTelestration = function (drawnObject) {
        let startOpacity = 1;
        if (drawnObject.animation) {
            startOpacity = drawnObject.animation.opacity;
            drawnObject.animation.cancel();
        }
        drawnObject.animation = new FadeInOutAnimation(
            this,
            this.config.FADE_OUT_TIME,
            drawnObject,
            startOpacity,
            true
        );
        this.closingObjects.push(drawnObject);
    };

    fadeInTelestration = function (drawnObject) {
        gsap.to(drawnObject, {
            opacity: 1,
            duration: this.config.FADE_IN_TIME,
        });
    };

    fadeOutTelestration = function (drawnObject) {
        gsap.to(drawnObject, {
            opacity: 0,
            duration: this.config.FADE_OUT_TIME,
        });
    };

    clearTelestrations = function () {
        this.clearAddedShapes();
        this.clearCursors();
        this.clearArrows();
        this.clearPolygons();
        this.clearLightShafts();
        this.clearPlayerCutOuts();
        this.clearTextBoxes();

        this.actionManager.clearActions();
        this.prepareChromaKeyCanvas();
    };

    clearCursors = function () {
        this.linkedCursors.map((lk) => this.clearTelestration(lk));
        this.cursors.map((cu) => this.clearTelestration(cu));

        this.cursors = [];
        this.linkedCursors = [];
    };
    clearAddedShapes = function () {
        this.addedShapes = [];
    };
    clearArrows = function () {
        this.arrows.map((arr) => this.clearTelestration(arr));
        this.freehandArrows.map((farr) => this.clearTelestration(farr));

        this.creationObject = null;
        this.arrows = [];
        this.freehandArrows = [];
    };

    clearPolygons = function () {
        this.polygons.map((po) => this.clearTelestration(po));

        this.creationObject = null;
        this.polygons = [];
    };

    clearPlayerCutOuts = function () {
        this.playerCutOuts.map((pco) => this.clearTelestration(pco));

        this.creationObject = null;
        this.playerCutOuts = [];
    };

    clearTextBoxes = function () {
        this.textBoxes.map((textbox) => this.clearTelestration(textbox));

        this.creationObject = null;
        this.textBoxes = [];
    };

    clearLightShafts = function () {
        this.lightShafts.map((ls) => this.clearTelestration(ls));

        this.creationLightShaft = null;
        this.lightShafts = [];
    };

    drawCursors = function () {
        this.cursors.map((c) => {
            c.draw(this.telestrationContext);
        });

        this.linkedCursors.map((lk) => lk.draw(this.telestrationContext));
    };

    drawCursor = function (position, options) {
        options = options || {};

        this.telestrationContext.save();
        // now draw the inner secondary color arcs ars

        if (options.alpha) {
            this.telestrationContext.globalAlpha = options.alpha;
        }

        this.telestrationContext.lineWidth = 14;
        this.telestrationContext.strokeStyle = this.config.PRIMARY_DARK_COLOR;
        this.telestrationContext.beginPath();
        this.telestrationContext.arc(
            position.x,
            position.y,
            options.cursorRadius,
            0,
            2 * Math.PI
        );
        this.telestrationContext.stroke();

        this.telestrationContext.lineWidth = 8;
        for (let i = 0; i < 4; i++) {
            if (i % 2 === 0) {
                this.telestrationContext.strokeStyle = this.config.PRIMARY_COLOR;
            } else {
                this.telestrationContext.strokeStyle = this.config.SECONDARY_COLOR;
            }
            this.telestrationContext.beginPath();
            this.telestrationContext.arc(
                position.x,
                position.y,
                options.cursorRadius,
                this.angleTimeOffset + (i * 2 * Math.PI) / 4 + Math.PI / 128,
                this.angleTimeOffset +
                    ((i + 1) * 2 * Math.PI) / 4 -
                    (2 * Math.PI) / 128
            );
            this.telestrationContext.stroke();
        }

        if (options.isClosing || options.isOpening) {
            // render images for closing
            this.telestrationContext.translate(position.x, position.y);
            this.telestrationContext.rotate(this.angleTimeOffset);
            this.telestrationContext.translate(-position.x, -position.y);
            this.telestrationContext.globalAlpha = 0.8;

            this.telestrationContext.drawImage(
                this.pointyLightImage,
                position.x - options.lightCursorRadius / 2,
                position.y - options.lightCursorRadius / 2,
                options.lightCursorRadius,
                options.lightCursorRadius
            );
            this.telestrationContext.drawImage(
                this.shinyLightImage,
                position.x - options.lightCursorRadius / 2,
                position.y - options.lightCursorRadius / 2,
                options.lightCursorRadius,
                options.lightCursorRadius
            );
        }

        this.telestrationContext.restore();
    };

    syncCanvasDimensions = function () {
        if (
            this.telestrationCanvas.width !== this.canvas.width ||
            this.telestrationCanvas.height !== this.canvas.height
        ) {
            this.telestrationCanvas.width = this.canvas.width;
            this.telestrationCanvas.height = this.canvas.height;
        }
    };

    update = function (delta) {
        let deltaInSeconds = delta;
        this.angleTimeOffset += (deltaInSeconds * 2 * Math.PI) / 2;

        this.syncCanvasDimensions();
        this.updateTelestrations(delta);
    };

    updateTelestrations = function (delta) {
        this.updateCreationTelestrations(delta);

        this.updateArrows(delta);
        this.updateCursors(delta);
        this.updateLightShafts(delta);

        this.updateClosingTelestrations(delta);
    };

    updateCreationTelestrations = function (delta) {
        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.LIVE_MODE_PLACE_CURSOR:
                this.creationCursor.setKeyFrame(
                    this.getVideoTime(),
                    this.getRelativeMousePosition()
                );
                this.creationCursor.update(delta);
                break;
            case this.FUNCTION_ENUM.PLACE_ARROW_POINT:
                if (this.creationObject) {
                    this.creationObject.setLastPoint(
                        this.getRelativeMousePosition()
                    );
                    this.creationObject.update(delta);
                }
                break;
            case this.FUNCTION_ENUM.PLACE_STRAIGHT_ARROW:
                if (this.creationObject) {
                    this.creationObject.setLastPoint(
                        this.getRelativeMousePosition()
                    );
                    this.creationObject.update(delta);
                }
                break;
            case this.FUNCTION_ENUM.PLACE_SMOOTH_ARROW:
                if (this.creationObject) {
                    this.creationObject.update(delta);
                }
                break;
            case this.FUNCTION_ENUM.PLACE_LIGHT_SHAFT:
                this.creationLightShaft.setKeyFrame(
                    this.getVideoTime(),
                    this.getRelativeMousePosition()
                );
                this.creationLightShaft.update(delta);
                break;
            case this.FUNCTION_ENUM.PLACE_POLYGON:
                this.creationObject.setLastPoint(
                    this.getRelativeMousePosition()
                );
                break;
            case this.FUNCTION_ENUM.PLACE_LINKED_CURSOR:
                this.creationObject.setLastCursorPosition(
                    this.getVideoTime(),
                    this.getRelativeMousePosition()
                );
                this.creationObject.update(delta);
                break;
            case this.FUNCTION_ENUM.PLAYER_CUT_OUT:
                this.creationObject.setLastPointPosition(
                    this.getRelativeMousePosition()
                );
                break;
            case this.FUNCTION_ENUM.SELECT_SHAPE:
            // this.creationObject.setLastPointPosition(
            //     this.getRelativeMousePosition()
            // );
            // break;
        }
    };

    updateClosingTelestrations = function (delta) {
        for (let i = 0; i < this.closingObjects.length; i++) {
            if (this.closingObjects[i].update) {
                this.closingObjects[i].update(delta);
            }
        }
        this.closingLightShafts.map((ls) => ls.update(delta));
    };

    updateArrows = function (delta) {
        this.freehandArrows.map((arrow) => arrow.update(delta));
        this.arrows.map((arrow) => arrow.update(delta));
    };

    updateCursors = function (delta) {
        this.cursors.map((cursor) => cursor.update(delta));
        this.linkedCursors.map((lk) => lk.update(delta));
    };

    updateLightShafts = function (delta) {
        this.lightShafts.map((lightShaft) => lightShaft.update(delta));
    };

    setRecordingMode = function (isRecording) {
        this.isRecording = false;
    };

    changeSize = function (radiusVariation) {
        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.LIVE_MODE_PLACE_CURSOR:
            case this.FUNCTION_ENUM.PLACE_LINKED_CURSOR:
                this.cursorRadius += radiusVariation;
                this.cursorRadius = Utils.clamp(
                    this.cursorRadius,
                    this.config.MIN_CURSOR_RADIUS,
                    this.config.MAX_CURSOR_RADIUS
                );

                if (
                    this.currentFunction ==
                    this.FUNCTION_ENUM.PLACE_LINKED_CURSOR
                ) {
                    this.creationObject.setRadius(this.cursorRadius);
                } else {
                    this.creationCursor.setRadius(this.cursorRadius);
                }
                break;
            case this.FUNCTION_ENUM.PLACE_LIGHT_SHAFT:
                this.lightShaftRadius += radiusVariation;
                this.lightShaftRadius = Utils.clamp(
                    this.lightShaftRadius,
                    this.config.MIN_LIGHTSHAFT_RADIUS,
                    this.config.MAX_LIGHTSHAFT_RADIUS
                );

                this.creationLightShaft.setRadius(
                    this.getBaseLightShaftRadius()
                );
                break;
            case this.FUNCTION_ENUM.PLACE_SMOOTH_ARROW:
            case this.FUNCTION_ENUM.PLACE_STRAIGHT_ARROW:
            case this.FUNCTION_ENUM.PLACE_ARROW_POINT:
                this.arrowWidth += radiusVariation;
                this.arrowWidth = Utils.clamp(
                    this.arrowWidth,
                    this.config.MIN_ARROW_WIDTH,
                    this.config.MAX_ARROW_WIDTH
                );

                this.creationObject.setWidth(this.arrowWidth);
                break;
            case this.FUNCTION_ENUM.PLAYER_CUT_OUT:
                this.arrowWidth += radiusVariation;
                this.arrowWidth = Utils.clamp(
                    this.arrowWidth,
                    this.config.MIN_ARROW_WIDTH,
                    this.config.MAX_ARROW_WIDTH
                );

                this.creationObject.setArrowWidth(this.arrowWidth);
                break;
        }
    };

    changeSizeSlider = function (radiusVariation) {
        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.SELECT_SHAPE:
                // this.setSelectedSize(radiusVariation);
                this.cursorRadius = radiusVariation;
                this.cursorRadius = Utils.clamp(
                    this.cursorRadius,
                    this.config.MIN_CURSOR_RADIUS,
                    this.config.MAX_CURSOR_RADIUS
                );
                this.selectedShapes.forEach((s) =>
                    s.setRadius(this.cursorRadius)
                );
                break;
            case this.FUNCTION_ENUM.LIVE_MODE_PLACE_CURSOR:
                this.cursorRadius = radiusVariation;
                this.cursorRadius = Utils.clamp(
                    this.cursorRadius,
                    this.config.MIN_CURSOR_RADIUS,
                    this.config.MAX_CURSOR_RADIUS
                );
                this.creationCursor.setRadius(this.cursorRadius);
                break;
            case this.FUNCTION_ENUM.PLACE_LINKED_CURSOR:
                this.cursorRadius = radiusVariation;
                this.cursorRadius = Utils.clamp(
                    this.cursorRadius,
                    this.config.MIN_CURSOR_RADIUS,
                    this.config.MAX_CURSOR_RADIUS
                );

                this.creationObject.setRadius(this.cursorRadius);
                this.creationCursor.setRadius(this.cursorRadius);
                break;
            case this.FUNCTION_ENUM.PLACE_LIGHT_SHAFT:
                this.lightShaftRadius = radiusVariation;
                this.lightShaftRadius = Utils.clamp(
                    this.lightShaftRadius,
                    this.config.MIN_LIGHTSHAFT_RADIUS,
                    this.config.MAX_LIGHTSHAFT_RADIUS
                );

                this.creationLightShaft.setRadius(
                    this.getBaseLightShaftRadius()
                );
                break;
            case this.FUNCTION_ENUM.PLACE_SMOOTH_ARROW:
            case this.FUNCTION_ENUM.PLACE_STRAIGHT_ARROW:
            case this.FUNCTION_ENUM.PLACE_ARROW_POINT:
                this.arrowWidth = radiusVariation;
                this.arrowWidth = Utils.clamp(
                    this.arrowWidth,
                    this.config.MIN_ARROW_WIDTH,
                    this.config.MAX_ARROW_WIDTH
                );

                this.creationObject.setWidth(this.arrowWidth);
                break;
            case this.FUNCTION_ENUM.PLAYER_CUT_OUT:
                this.arrowWidth = radiusVariation;
                this.arrowWidth = Utils.clamp(
                    this.arrowWidth,
                    this.config.MIN_ARROW_WIDTH,
                    this.config.MAX_ARROW_WIDTH
                );

                this.creationObject.setArrowWidth(this.arrowWidth);
                break;
        }
    };

    setSelectedSize = function (radius) {
        this.selectedShapes.forEach((s) => s.setRadius(radius));
    };

    setSelectedZAngle = function (zAngle) {
        if (this.selectedShapes.length === 0) return;
        this.selectedShapes.forEach((s) => s.setZAngle(zAngle));
    };

    changeZAngle = function (zAngleVariation) {
        this.zAngle += zAngleVariation;
        this.zAngle = Utils.clamp(
            this.zAngle,
            this.config.MIN_Z_ANGLE,
            this.config.MAX_Z_ANGLE
        );

        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.LIVE_MODE_PLACE_CURSOR:
                this.creationCursor.setZAngle(this.zAngle);
                break;
            case this.FUNCTION_ENUM.PLACE_LIGHT_SHAFT:
                this.creationLightShaft.setZAngle(this.zAngle);
                break;
            case this.FUNCTION_ENUM.PLAYER_CUT_OUT:
                this.creationObject.setArrowZAngle(this.zAngle);
                break;
            default:
                if (this.creationObject) {
                    this.creationObject.setZAngle(this.zAngle);
                }
                break;
        }
    };

    changeZAngleSlider = function (zAngleVariation) {
        this.zAngle = zAngleVariation;
        this.zAngle = Utils.clamp(
            this.zAngle,
            this.config.MIN_Z_ANGLE,
            this.config.MAX_Z_ANGLE
        );

        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.SELECT_SHAPE:
                this.setSelectedZAngle(this.zAngle);
                break;
            case this.FUNCTION_ENUM.LIVE_MODE_PLACE_CURSOR:
                this.creationCursor.setZAngle(this.zAngle);
                break;
            case this.FUNCTION_ENUM.PLACE_LIGHT_SHAFT:
                this.creationLightShaft.setZAngle(this.zAngle);
                break;
            case this.FUNCTION_ENUM.PLAYER_CUT_OUT:
                this.creationObject.setArrowZAngle(this.zAngle);
                break;
            default:
                if (this.creationObject) {
                    this.creationObject.setZAngle(this.zAngle);
                }
                break;
        }
    };

    loop = function (currentTime) {
        let delta = (currentTime - this.lastFrame) / 1000;
        this.lastFrame = currentTime;

        this.update(delta);
        this.draw();
    };

    captureKeyFrame = function (currentTime) {
        if (this.positionOverCanvas(this.mousePosition)) {
            let kf = new Cursor(
                this,
                this.getVideoTime(),
                this.getRelativeMousePosition(),
                this.cursorRadius,
                1,
                this.config.CURSOR_COLOR,
                this.zAngle
            );

            this.cursors.push(kf);

            let index = 0;
            this.addedShapes.forEach((shape) => {
                if (shape.type === 'circle') {
                    index++;
                }
            });

            const objectDetail = new DrawnObjectDetail(
                kf,
                currentTime,
                'circle',
                ++index
            );
            this.addedShapes.push(objectDetail);

            this.actionManager.pushAction(ActionTypeEnum.PLACE_CURSOR);
            sendUserEvent(
                telestrationCircleAplied,
                window.location.href,
                videoId
            );
        }
    };

    placeLightShaft = function (currentTime) {
        let ls = new LightShaft(
            this,
            this.getVideoTime(),
            this.getRelativeMousePosition(),
            false,
            this.getBaseLightShaftRadius(),
            this.zAngle
        );
        ls.startOpenTimer(this.config.FADE_IN_TIME);
        this.lightShafts.push(ls);

        let index = 0;
        this.addedShapes.forEach((shape) => {
            if (shape.type === 'lightshaft') {
                index++;
            }
        });

        const objectDetail = new DrawnObjectDetail(
            ls,
            currentTime,
            'lightshaft',
            ++index
        );
        this.addedShapes.push(objectDetail);

        this.actionManager.pushAction(ActionTypeEnum.PLACE_LIGHT_SHAFT);
        sendUserEvent(telestrationHaloAplied, window.location.href, videoId);
    };

    placePlayerCutOutPoint = function (isMouseUp) {
        if (this.creationObject) {
            if (this.creationObject.isPlacingPoints()) {
                if (
                    isMouseUp &&
                    !this.creationObject.pointGoodForClosingRectangle(
                        this.getRelativeMousePosition()
                    )
                ) {
                    this.initializePlayerCutOutFunction();
                } else {
                    this.creationObject.placePoint(
                        this.getRelativeMousePosition()
                    );
                    if (this.creationObject.isFinished()) {
                        this.playerCutOuts.push(this.creationObject);
                        this.creationObject.markAsFinished();
                        this.actionManager.pushAction(
                            ActionTypeEnum.PLACE_PLAYER_CUT_OUT
                        );
                        this.initializePlayerCutOutFunction();
                        this.prepareChromaKeyCanvas();
                    }
                }
            }
        }
    };

    placeLastLinkedCursorPoint = function (currentTime) {
        this.creationObject.confirmLastCursor();
        this.creationObject.markAsFinished();
        this.linkedCursors.push(this.creationObject);

        let index = 0;
        this.addedShapes.forEach((shape) => {
            if (shape.type === 'linkedcursor') {
                index++;
            }
        });

        const objectDetail = new DrawnObjectDetail(
            this.creationObject,
            currentTime,
            'linkedcursor',
            ++index
        );

        this.addedShapes.push(objectDetail);

        this.actionManager.pushAction(ActionTypeEnum.PLACE_LINKED_CURSOR);
        this.initializeCreationLinkedCursor();
        sendUserEvent(telestrationLinkFinished, window.location.href, videoId);
    };

    placePolygonPoint = function (currentTime) {
        if (this.creationObject.points.length === 1) {
            sendUserEvent(
                telestrationPolygonStartedDrawing,
                window.location.href,
                videoId
            );
        }
        if (this.creationObject.isFinished()) {
            sendUserEvent(
                telestrationPolygonFinishedDrawing,
                window.location.href,
                videoId
            );
            this.creationObject.markAsFinished();
            this.polygons.push(this.creationObject);

            let index = 0;
            this.addedShapes.forEach((shape) => {
                if (shape.type === 'polygon') {
                    index++;
                }
            });
            const objectDetail = new DrawnObjectDetail(
                this.creationObject,
                currentTime,
                'polygon',
                ++index
            );
            this.addedShapes.push(objectDetail);

            this.actionManager.pushAction(ActionTypeEnum.PLACE_POLYGON);
            this.initializeCreationPolygon();
        } else {
            this.creationObject.addPoint(this.getRelativeMousePosition());
            this.actionManager.pushAction(ActionTypeEnum.PLACE_POLYGON_POINT);
        }
    };

    positionOverCanvas = function (p) {
        return (
            p.x >= 0 &&
            p.x <= this.canvas.width &&
            p.y >= 0 &&
            p.y <= this.canvas.height
        );
    };

    getObjectPerspective = function (object) {
        let p = { xAngle: 1, zAngle: 1 };
        if (this.onPerspective) {
            p.xAngle = object.xAngle || this.xAngle;
            p.zAngle = object.zAngle || this.zAngle;
        }
        return p;
    };

    // from (0,1) coordinates, transforms to canvas coordinates, takingperspective into consideration
    transformToAbsolutePosition = function (position, object) {
        let perspective = this.getObjectPerspective(object);
        let x =
            (position.x * this.telestrationCanvas.width) / perspective.xAngle;
        let y =
            (position.y * this.telestrationCanvas.height) / perspective.zAngle;
        return { x: x, y: y };
    };

    transformToCanvasPosition = function (position, object) {
        let perspective = this.getObjectPerspective(object);
        let x = position.x / this.telestrationCanvas.width / perspective.xAngle;
        let y =
            position.y / this.telestrationCanvas.height / perspective.zAngle;
        return { x: x, y: y };
    };

    getRelativeMousePosition = function () {
        return {
            x: this.mousePosition.x / this.canvas.width,
            y: this.mousePosition.y / this.canvas.height,
        };
    };

    placeTextBoxPoint = function () {
        if (this.creationObject) {
            this.creationObject.setPosition(this.getRelativeMousePosition());
            this.textBoxes.push(this.creationObject);
        }
    };

    saveTextBox = function () {
        this.initializeTextBoxFunction();
    };

    placeLinkedCursorPoint = function () {
        this.creationObject.addCursor(this.getRelativeMousePosition());
        this.actionManager.pushAction(
            ActionTypeEnum.PLACE_LINKED_CURSOR_CURSOR
        );
        sendUserEvent(telestrationLinkAdded, window.location.href, videoId);
    };

    placeArrowPoint = function () {
        let newPoint = this.getRelativeMousePosition();
        let lastPoint = this.creationObject.getSecondLastPoint();
        if (lastPoint) {
            // do not allow points too close (bad results)
            if (
                Utils.dist(newPoint.x, newPoint.y, lastPoint.x, lastPoint.y) >
                0.001 * 1.41
            ) {
                // sqrt(2)
                this.creationObject.addPoint(this.getRelativeMousePosition());
            }
        } else {
            this.creationObject.addPoint(this.getRelativeMousePosition());
        }
    };

    captureSmoothArrowPoint = function () {
        this.creationObject.addCoord(this.getRelativeMousePosition());
    };

    closeArrow = function () {
        if (this.creationObject) {
            this.creationObject.close();
            if (this.creationObject.isComplete()) {
                this.creationObject.finishArrow();
                this.arrows.push(this.creationObject);
                this.actionManager.pushAction(ActionTypeEnum.PLACE_ARROW);
                this.creationObject = null;
            }
        }
    };

    changeCurrentFunction = function (f) {
        this.currentFunctionExitUpdate();
        this.currentFunction = f;
        this.initializeCurrentFunction();
    };

    selectShape = function () {
        this.changeCurrentFunction(this.FUNCTION_ENUM.SELECT_SHAPE);
    };

    setPlaceCursorFunction = function () {
        this.changeCurrentFunction(this.FUNCTION_ENUM.LIVE_MODE_PLACE_CURSOR);
    };

    setPlaceLinkedCursorFunction = function () {
        this.changeCurrentFunction(this.FUNCTION_ENUM.PLACE_LINKED_CURSOR);
    };

    setPlayerCutOutFunction = function () {
        this.changeCurrentFunction(this.FUNCTION_ENUM.PLAYER_CUT_OUT);
    };

    setPlaceStraightArrowFunction = function () {
        this.changeCurrentFunction(this.FUNCTION_ENUM.PLACE_STRAIGHT_ARROW);
    };

    setPlaceTextBoxFunction = function () {
        this.changeCurrentFunction(this.FUNCTION_ENUM.PLACE_TEXT_BOX);
    };

    setPlaceFreeArrowFunction = function () {
        this.changeCurrentFunction(this.FUNCTION_ENUM.PLACE_SMOOTH_ARROW);
    };

    setPlaceArrowFunction = function () {
        this.changeCurrentFunction(this.FUNCTION_ENUM.PLACE_ARROW_POINT);
    };

    setPlacePolygonFunction = function () {
        this.changeCurrentFunction(this.FUNCTION_ENUM.PLACE_POLYGON);
    };

    setPlaceLightShaftFunction = function () {
        this.changeCurrentFunction(this.FUNCTION_ENUM.PLACE_LIGHT_SHAFT);
    };

    setChromaKeySettingsFunction = function () {
        this.changeCurrentFunction(this.FUNCTION_ENUM.CHROMA_KEY_PICKER);
    };

    updateChromaKeyStatus = function () {
        if (this.video && !this.video.paused) {
            this.chromaKeyPrepared = false;
        }
    };

    haveTelestrationsPlaced = function () {
        let haveTelestrations =
            this.cursors.length > 0 ||
            this.lightShafts.length > 0 ||
            this.arrows.length > 0 ||
            this.polygons.length > 0 ||
            this.closingObjects.length > 0;
        return haveTelestrations;
    };

    toggleChromaKeySettingsFunction = function () {
        if (this.currentFunction === this.FUNCTION_ENUM.CHROMA_KEY_PICKER) {
            this.setLiveModeFunction();
        } else {
            this.changeCurrentFunction(this.FUNCTION_ENUM.CHROMA_KEY_PICKER);
        }
    };

    setLiveModeFunction = function () {
        this.changeCurrentFunction(this.FUNCTION_ENUM.LIVE_MODE);
    };

    // function called before leaving a state
    currentFunctionExitUpdate = function () {
        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.CHROMA_KEY_PICKER:
                console.log('restore');
                this.chromaKeyPrepared = false;
                // restore undo functionality
                this.actionManager.restoreActions();
                break;
            case this.FUNCTION_ENUM.PLACE_LINKED_CURSOR:
                this.actionManager.restoreActions();
                break;
            case !this.FUNCTION_ENUM.SELECT_SHAPE:
                this.clearSelected();
        }
    };

    // function called after entering a different state
    initializeCurrentFunction = function () {
        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.SELECT_SHAPE:
                this.creationObject = new Rectangle(this, 'green', 2, 1);
                break;
            case this.FUNCTION_ENUM.LIVE_MODE_PLACE_CURSOR:
                this.creationCursor = new Cursor(
                    this,
                    this.getVideoTime(),
                    this.getRelativeMousePosition(),
                    this.cursorRadius,
                    0.5,
                    this.config.CURSOR_COLOR,
                    this.zAngle
                );
                break;
            case this.FUNCTION_ENUM.PLACE_ARROW_POINT:
                this.creationObject = new Arrow(
                    this,
                    this.config.ARROW_COLOR,
                    this.config.ARROW_BORDER_COLOR,
                    this.config.ARROW_HAS_BORDER,
                    this.zAngle
                );
                this.creationObject.addPoint(this.getRelativeMousePosition());
                break;
            case this.FUNCTION_ENUM.PLACE_STRAIGHT_ARROW:
                this.creationObject = new Arrow(
                    this,
                    this.config.ARROW_COLOR,
                    this.config.ARROW_BORDER_COLOR,
                    this.config.ARROW_HAS_BORDER,
                    this.zAngle
                );
                break;
            case this.FUNCTION_ENUM.PLACE_SMOOTH_ARROW:
                this.creationObject = new FreehandArrow(
                    this,
                    this.config.ARROW_COLOR,
                    this.config.ARROW_BORDER_COLOR,
                    this.zAngle
                );
                break;
            case this.FUNCTION_ENUM.CHROMA_KEY_PICKER:
                this.chromaKeyPrepared = false;

                // modify 'undo' temporarily to only undo chroma key picking
                this.actionManager.setBackupActions();
                break;
            case this.FUNCTION_ENUM.PLACE_LIGHT_SHAFT:
                this.creationLightShaft = new LightShaft(
                    this,
                    this.getVideoTime(),
                    this.getRelativeMousePosition(),
                    true,
                    this.getBaseLightShaftRadius(),
                    this.zAngle
                );
                break;
            case this.FUNCTION_ENUM.PLACE_POLYGON:
                this.initializeCreationPolygon();
                break;
            case this.FUNCTION_ENUM.PLACE_LINKED_CURSOR:
                this.initializeCreationLinkedCursor();
                this.actionManager.setBackupActions();
                break;
            case this.FUNCTION_ENUM.PLAYER_CUT_OUT:
                this.initializePlayerCutOutFunction();
                break;
            case this.FUNCTION_ENUM.PLACE_TEXT_BOX:
                this.initializeTextBoxFunction();
                break;
        }
    };

    setTelestrationColor = function (newColor) {
        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.SELECT_SHAPE:
                this.chageSelectedShapeColor(newColor);
                break;
            case this.FUNCTION_ENUM.LIVE_MODE_PLACE_CURSOR:
            case this.FUNCTION_ENUM.PLACE_LINKED_CURSOR:
                this.setCursorColor(newColor);
                break;
            case this.FUNCTION_ENUM.PLACE_POLYGON:
                this.setPolygonColor(newColor);
                break;
            case this.FUNCTION_ENUM.PLACE_ARROW_POINT:
            case this.FUNCTION_ENUM.PLACE_SMOOTH_ARROW:
            case this.FUNCTION_ENUM.PLACE_STRAIGHT_ARROW:
                this.setArrowColor(newColor);
                break;
            case this.FUNCTION_ENUM.PLAYER_CUT_OUT:
                this.setPlayerCutOutArrowColor(newColor);
                break;
        }
    };

    chageSelectedShapeColor = function (newColor) {
        this.selectedShapes.forEach((s) => {
            s.setColor(newColor);
        });
    };

    setTelestrationBackgroundColor = function (backgroundColor) {
        this.creationObject.setBackgroundColor(backgroundColor);
    };

    setTelestrationTextColor = function (textColor) {
        this.creationObject.setTextColor(textColor);
    };

    setTelestrationText = function (text) {
        this.creationObject.setText(text, this.context);
    };

    setTelestrationFontSize = function (fontSize) {
        this.creationObject.setFontSize(fontSize, this.context);
    };

    setCursorColor = function (newColor) {
        this.config.CURSOR_COLOR = newColor;

        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.LIVE_MODE_PLACE_CURSOR:
                if (this.creationCursor) {
                    this.creationCursor.setColor(newColor);
                }
                break;
            case this.FUNCTION_ENUM.PLACE_LINKED_CURSOR:
                if (this.creationObject) {
                    this.creationObject.setColor(newColor);
                }
                break;
        }
    };

    setPolygonColor = function (newColor) {
        this.config.POLYGON_COLOR = newColor;

        if (
            this.currentFunction == this.FUNCTION_ENUM.PLACE_POLYGON &&
            this.creationObject
        ) {
            this.creationObject.setColor(newColor);
        }
    };

    setArrowColor = function (newColor) {
        this.config.ARROW_COLOR = newColor;

        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.PLACE_ARROW_POINT:
            case this.FUNCTION_ENUM.PLACE_SMOOTH_ARROW:
            case this.FUNCTION_ENUM.PLACE_STRAIGHT_ARROW:
                if (this.creationObject) {
                    this.creationObject.setColor(newColor);
                }
                break;
        }
    };

    setPlayerCutOutArrowColor = function (newColor) {
        this.config.PLAYER_CUT_OUT_ARROW_COLOR = newColor;

        if (this.creationObject) {
            this.creationObject.setArrowColor(newColor);
        }
    };

    initializePlayerCutOutFunction = function () {
        this.creationObject = new PlayerCutOut(
            this,
            this.config.PLAYER_CUT_OUT_ARROW_COLOR
        );
        this.creationObject.placePoint(this.getRelativeMousePosition());
    };

    initializeTextBoxFunction = function (argument) {
        this.creationObject = new TextBox(
            this,
            this.config.TEXT_BOX_BACKGROUND_COLOR,
            this.config.TEXT_BOX_COLOR,
            this.config.TEXT_BOX_FONT_FAMILY,
            this.config.TEXT_BOX_FONT_SIZE
        );
    };

    initializeCreationLinkedCursor = function () {
        this.creationObject = new LinkedCursor(
            this,
            this.getVideoTime(),
            this.cursorRadius,
            this.config.CURSOR_COLOR,
            this.zAngle
        );
        this.creationObject.addCursor(this.getRelativeMousePosition());
    };

    initializeCreationPolygon = function () {
        this.creationObject = new Polygon(
            this,
            this.config.POLYGON_COLOR,
            this.config.POLYGON_BORDER_COLOR,
            this.config.POLYGON_OPACITY,
            this.zAngle
        );

        this.creationObject.addPoint(this.getRelativeMousePosition());
    };

    mouseInCanvas = function () {
        return (
            this.mousePosition.x >= 0 &&
            this.mousePosition.x <= this.canvas.width &&
            this.mousePosition.y >= 0 &&
            this.mousePosition.y <= this.canvas.height
        );
    };

    captureCanvasMousePosition = function (event) {
        // capture mouse position
        Utils.captureCanvasMousePosition(
            event,
            this.canvas,
            this.mousePosition
        );
    };

    transformMousePositionTo3d = function () {
        let position3d = this.field3d.getTelestrationCoordinates(
            this.mousePosition,
            this.canvas.width,
            this.canvas.height
        );
        if (position3d != null) {
            this.mousePosition.x = position3d.x * this.canvas.width;
            this.mousePosition.y = this.canvas.height * (1 - position3d.y);
        }
    };

    selectShapeCheck = function () {
        const rMousePos = this.getRelativeMousePosition();
        this.cursors.forEach((s) => {
            if (s.isMouseOver(rMousePos)) this.switchSelectedShapes(s);
        });
    };

    clearSelected = function () {
        if (this.selectedShapes.length === 0) return;
        this.selectedShapes.forEach((s) => {
            s.isSelected = false;
            s.lowLight();
        });
        this.selectedShapes = [];
    };

    selectRectEnd = function () {
        this.cursors.forEach((s) => {
            if (this.creationObject.isContain(s.position))
                this.switchSelectedShapes(s);
        });
        this.creationObject.clear();
    };

    switchSelectedShapes = function (s) {
        if (s.isSelected) {
            if (this.controlDown) {
                s.lowLight();
                s.isSelected = false;
                this.selectedShapes.forEach((s1, i) => {
                    if (s1 === s) this.selectedShapes.splice(i, 1);
                });
            }
        } else {
            s.highLight();
            s.isSelected = true;
            this.selectedShapes.push(s);
        }
    };

    // events
    onclick = function (event, currentTime = 0) {
        this.captureCanvasMousePosition(event);
        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.LIVE_MODE_PLACE_CURSOR:
                this.captureKeyFrame(currentTime);
                break;
            case this.FUNCTION_ENUM.CAPTURE_KEYFRAMES:
                this.captureKeyFrame();
                break;
            case this.FUNCTION_ENUM.PLACE_ARROW_POINT:
                this.placeArrowPoint();
                break;
            case this.FUNCTION_ENUM.PLACE_LIGHT_SHAFT:
                this.placeLightShaft(currentTime);
                break;
            case this.FUNCTION_ENUM.CHROMA_KEY_PICKER:
                this.pickChromaPixelActionTrigger();
                break;
            case this.FUNCTION_ENUM.PLACE_POLYGON:
                this.placePolygonPoint(currentTime);
                break;
            case this.FUNCTION_ENUM.PLACE_LINKED_CURSOR:
                this.placeLinkedCursorPoint();
                break;
            case this.FUNCTION_ENUM.PLACE_TEXT_BOX:
                this.placeTextBoxPoint();
                break;
            case this.FUNCTION_ENUM.SELECT_SHAPE:
                this.selectShapeCheck();
                break;
        }
    };
    deleteSelectedShape = function () {
        const newAddedShapes = [];
        let deletedCount_Cursor = 0;
        let deletedCount_LinkedCursor = 0;
        let deletedCount_LightShaft = 0;
        let deletedCount_Ploygon = 0;

        this.addedShapes.forEach((shape, index) => {
            if (!shape.isSelected) {
                newAddedShapes.push(shape);
            } else {
                switch (shape.type) {
                    case !'circle':
                        this.cursors.splice(
                            shape.index - 1 - deletedCount_Cursor,
                            1
                        );
                        deletedCount_Cursor++;
                        break;
                    case 'linkedcursor':
                        this.linkedCursors.splice(
                            shape.index - 1 - deletedCount_LinkedCursor,
                            1
                        );
                        deletedCount_LinkedCursor++;
                        break;
                    case 'polygon':
                        this.polygons.splice(
                            shape.index - 1 - deletedCount_LightShaft,
                            1
                        );
                        deletedCount_LightShaft++;
                        break;
                    case 'lightshaft':
                        this.lightShafts.splice(
                            shape.index - 1 - deletedCount_Ploygon,
                            1
                        );
                        deletedCount_Ploygon++;
                        break;
                }
            }
        });
        this.addedShapes = newAddedShapes;
    };
    placeSelectRect = function () {
        if (this.creationObject.points.length < 2) {
            this.creationObject.addPoint(this.getRelativeMousePosition());
        } else {
            this.creationObject.setLastPointPosition(
                this.getRelativeMousePosition()
            );
        }
    };

    onmousemove = function (event) {
        this.captureCanvasMousePosition(event);

        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.PLACE_SMOOTH_ARROW:
                if (this.mouseDown) {
                    this.captureSmoothArrowPoint();
                }
                break;
            case this.FUNCTION_ENUM.SELECT_SHAPE:
                if (this.mouseDown) {
                    this.placeSelectRect();
                }
                break;
        }
    };

    onmousedown = function (event) {
        this.captureCanvasMousePosition(event);

        this.mouseDown = true;
        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.PLACE_STRAIGHT_ARROW:
                this.creationObject.addPoint(this.getRelativeMousePosition());
                this.creationObject.addPoint(this.getRelativeMousePosition());
                break;
            case this.FUNCTION_ENUM.PLAYER_CUT_OUT:
                if (
                    this.creationObject &&
                    !this.creationObject.hasPlacedPoints()
                ) {
                    this.placePlayerCutOutPoint();
                }
                break;
            case this.FUNCTION_ENUM.SELECT_SHAPE:
                !this.controlDown && this.clearSelected();
                this.creationObject.addPoint(this.getRelativeMousePosition());
                break;
        }
    };

    onmouseup = function (event) {
        if (this.mouseDown) {
            this.captureCanvasMousePosition(event);
            this.mouseDown = false;
            switch (this.currentFunction) {
                case this.FUNCTION_ENUM.PLACE_SMOOTH_ARROW:
                    if (this.creationObject) {
                        if (this.creationObject.readyToFinish()) {
                            this.creationObject.finishArrow();
                            this.actionManager.pushAction(
                                ActionTypeEnum.PLACE_SMOOTH_ARROW
                            );
                            this.freehandArrows.push(this.creationObject);
                        }
                        this.creationObject = null;
                        this.initializeCurrentFunction();
                    }
                    break;
                case this.FUNCTION_ENUM.PLACE_STRAIGHT_ARROW:
                    if (this.creationObject) {
                        if (this.creationObject.readyToFinish()) {
                            this.creationObject.finishArrow();
                            this.arrows.push(this.creationObject);
                            this.actionManager.pushAction(
                                ActionTypeEnum.PLACE_ARROW
                            );
                        }
                        this.creationObject = null;
                        this.initializeCurrentFunction();
                    }
                    break;
                case this.FUNCTION_ENUM.PLAYER_CUT_OUT:
                    this.placePlayerCutOutPoint(true);
                    break;
                case this.FUNCTION_ENUM.SELECT_SHAPE:
                    this.selectRectEnd();
                    break;
            }
        }
    };

    ondblclick = function (event, currentTime) {
        this.captureCanvasMousePosition(event);
        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.PLACE_ARROW_POINT:
                this.closeArrow();
                this.initializeCurrentFunction();
                break;
            case this.FUNCTION_ENUM.PLACE_LINKED_CURSOR:
                this.placeLastLinkedCursorPoint(currentTime);
                break;
        }
    };

    oncontextmenu = function (event) {
        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.PLACE_SMOOTH_ARROW:
            case this.FUNCTION_ENUM.PLACE_STRAIGHT_ARROW:
            case this.FUNCTION_ENUM.PLACE_ARROW_POINT:
                event.preventDefault();
                this.creationObject.switchType();
                break;
        }
    };

    onmousewheel = function (event) {
        if (this.shiftDown) {
            event.preventDefault();
            this.changeZAngle(
                event.wheelDelta * this.config.Z_ANGLE_ALTER_SPEED
            );
        } else if (this.controlDown) {
            event.preventDefault();
            this.changeSize(event.wheelDelta * this.config.WHEEL_ALTER_SPEED);
        }
    };

    onSliderChangeSize = function (sliderStep) {
        this.changeSizeSlider(sliderStep);
    };

    cancelKeyPressed = function () {
        switch (this.currentFunction) {
            case this.FUNCTION_ENUM.PLACE_LINKED_CURSOR:
                this.initializeCreationLinkedCursor();
                break;
        }
    };

    onkeydown = function (event) {
        switch (event.code) {
            case Utils.KEY_ENUM.SHIFT_RIGHT:
            case Utils.KEY_ENUM.SHIFT_LEFT:
                this.shiftDown = true;
                break;
            case Utils.KEY_ENUM.CONTROL_RIGHT:
            case Utils.KEY_ENUM.CONTROL_LEFT:
                this.controlDown = true;
                break;
            case Utils.KEY_ENUM.ESCAPE:
                this.cancelKeyPressed();
                break;
        }
    };

    onkeyup = function (event) {
        switch (event.code) {
            case Utils.KEY_ENUM.SHIFT_RIGHT:
            case Utils.KEY_ENUM.SHIFT_LEFT:
                this.shiftDown = false;
                break;
            case Utils.KEY_ENUM.CONTROL_RIGHT:
            case Utils.KEY_ENUM.CONTROL_LEFT:
                this.controlDown = false;
                break;
        }
    };

    // ListenSliderInputs = () => {
    //     //access input and adding observer to access related tool slider change
    //     const sliderSizeInput = document.getElementById('size-slider-input');
    //     const sliderPerspectiveInput = document.getElementById(
    //         'perspective-slider-input'
    //     );
    //     const config = { attributes: true, value: true };

    //     // Callback function to execute when mutations are observed
    //     const toolSizeCallback = (mutationsList, observer) => {
    //         // Use traditional 'for loops' for IE 11
    //         for (const mutation of mutationsList) {
    //             if (mutation.type === 'value') {
    //             } else if (mutation.type === 'attributes') {
    //                 this.onSliderChangeSize(sliderSizeInput.value);
    //             }
    //         }
    //     };

    //     // Create an observer instance linked to the callback function
    //     const sizeObserver = new MutationObserver(toolSizeCallback);
    //     // sometimes it's not true and throwing error
    //     if (sliderSizeInput) {
    //         sizeObserver.observe(sliderSizeInput, config);
    //     }

    //     const perspectiveInputCallback = (mutationsList, observer) => {
    //         // Use traditional 'for loops' for IE 11
    //         for (const mutation of mutationsList) {
    //             if (mutation.type === 'value') {
    //             } else if (mutation.type === 'attributes') {
    //                 this.changeZAngleSlider(sliderPerspectiveInput.value);
    //             }
    //         }
    //     };

    //     const perspectiveInputObserver = new MutationObserver(
    //         perspectiveInputCallback
    //     );
    //     // sometimes it's not true and throwing error
    //     if (sliderPerspectiveInput) {
    //         perspectiveInputObserver.observe(sliderPerspectiveInput, config);
    //     }
    // };

    setEvents = function () {
        // this.ListenSliderInputs();
        this.nonRecordableCanvas.addEventListener('mousemove', (event) =>
            this.onmousemove(event)
        );
        document.addEventListener('mouseup', (event) => this.onmouseup(event));
        this.nonRecordableCanvas.addEventListener('mousedown', (event) =>
            this.onmousedown(event)
        );

        document.addEventListener(
            'mousewheel',
            (event) => this.onmousewheel(event),
            { passive: false }
        );

        // this.nonRecordableCanvas.addEventListener('click', (event) =>
        //     this.onclick(event)
        // );
        // this.nonRecordableCanvas.addEventListener('dblclick', (event) =>
        //     this.ondblclick(event)
        // );
        this.nonRecordableCanvas.addEventListener('contextmenu', (event) =>
            this.oncontextmenu(event)
        );

        document.addEventListener('keydown', (event) => this.onkeydown(event));
        document.addEventListener('keyup', (event) => this.onkeyup(event));
    };
}

// utils functions below

let Utils = {};

Utils.captureCanvasMousePosition = function (event, canvas, mousePosition) {
    mousePosition = mousePosition || {};
    let rect = canvas.getBoundingClientRect();
    mousePosition.x = event.clientX - rect.left;
    mousePosition.y = event.clientY - rect.top;
    return mousePosition;
};

Utils.KEY_ENUM = {
    0: 'Digit0',
    1: 'Digit1',
    2: 'Digit2',
    3: 'Digit3',
    4: 'Digit4',
    5: 'Digit5',
    6: 'Digit6',
    7: 'Digit7',
    8: 'Digit8',
    9: 'Digit9',

    ALT_RIGHT: 'AltRight',
    ALT_LEFT: 'AltLeft',

    CONTROL_RIGHT: 'ControlRight',
    CONTROL_LEFT: 'ControlLeft',

    ENTER: 'Enter',
    ESCAPE: 'Escape',

    SHIFT_RIGHT: 'ShiftRight',
    SHIFT_LEFT: 'ShiftLeft',
    SPACE: 'Space',

    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
};

Utils.resizeImage = function (
    selectedImage,
    maxWidth,
    maxHeight,
    fillContainer
) {
    let isVideo = selectedImage instanceof HTMLVideoElement;
    let imageWidth = isVideo ? selectedImage.videoWidth : selectedImage.width;
    let imageHeight = isVideo
        ? selectedImage.videoHeight
        : selectedImage.height;

    let resize = { width: 0, height: 0 };
    if (fillContainer) {
        if (imageWidth / maxWidth < imageHeight / maxHeight) {
            // width drives
            resize.width = maxWidth;
            resize.x = 0;
            resize.height = (imageHeight * maxWidth) / imageWidth;
            resize.y = resize.height - maxHeight / 2;
        } else {
            resize.width = (imageWidth * maxHeight) / imageHeight;
            resize.x = resize.width - maxWidth / 2;
            resize.height = maxHeight;
            resize.y = 0;
        }
    } else {
        if (maxWidth > imageWidth && maxHeight > imageHeight) {
            resize.width = imageWidth;
            resize.height = imageHeight;
        } else if (maxWidth < imageWidth && maxHeight > imageHeight) {
            resize.height = (imageHeight * maxWidth) / imageWidth;
            resize.width = maxWidth;
        } else if (maxWidth > imageWidth && maxHeight < imageHeight) {
            resize.width = (imageWidth * maxHeight) / imageHeight;
            resize.height = maxHeight;
        } else {
            // neither width or height are sufficient
            if (imageWidth / maxWidth > imageHeight / maxHeight) {
                // width drives
                resize.width = maxWidth;
                resize.height = (imageHeight * maxWidth) / imageWidth;
            } else {
                resize.width = (imageWidth * maxHeight) / imageHeight;
                resize.height = maxHeight;
            }
        }
    }
    return resize;
};

Utils.clamp = function (value, min, max) {
    return Math.max(Math.min(value, max), min);
};

Utils.linearInterpolation = function (startX, endX, interY, startY, endY) {
    let yInterval = endY - startY;
    let fraction = (interY - startY) / yInterval;
    return startX + (endX - startX) * fraction;
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

Utils.inRange = function (number, start, end) {
    return number >= start && number <= end;
};
