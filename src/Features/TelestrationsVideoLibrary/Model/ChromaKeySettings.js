export class ChromaKeySettings {
    constructor(manager) {
        this.manager = manager;
        this.enabled = true;

        this.vhardmin = 0.15;
        this.shardmin = 0.072;

        // list of hue values
        this.hlist = []; //[0.15, 0.17, 0.19, 0.21, 0.23, 0.25, 0.27, 0.29, 0.31, 0.33];
        this.hlimit = 0.010001; // required for precision issues

        this.maxHuePoints = 32;
    }

    addHuePoint = function (r, g, b) {
        let hsv = Utils.RGBtoHSV(r, g, b);
        this.hlist.push(hsv.h);
    };

    popHuePoint = function () {
        this.hlist.pop();
    };

    reset = function () {
        this.hlist = [];
    };

    isChromaBackground = function (r, g, b, a) {
        if (
            this.hlist.length == 0 &&
            this.manager.currentFunction !=
                this.manager.FUNCTION_ENUM.CHROMA_KEY_PICKER
        ) {
            return true;
        }

        let hsv = Utils.RGBtoHSV(r, g, b);
        // vtest (exclude things too dark)
        if (hsv.v < this.vhardmin) {
            return false;
        }
        // stest (exclude things too bright)
        if (hsv.s < this.shardmin) {
            return false;
        }

        for (let i = 0; i < this.hlist.length; i++) {
            if (Math.abs(hsv.h - this.hlist[i]) <= this.hlimit) {
                return true;
            }
        }

        return false;
    };

    getShaderParameters = function (gl, isBackground) {
        let hlist = this.hlist.slice();
        let limit = this.maxHuePoints - hlist.length;
        for (let i = 0; i < limit; i++) {
            hlist.push(-300); // math trick to always stay above the limit
        }

        let pureBackground =
            this.hlist.length == 0 &&
            this.manager.currentFunction !=
                this.manager.FUNCTION_ENUM.CHROMA_KEY_PICKER;

        let parameters = [
            { type: gl.FLOAT, name: 'vhardmin', value: this.vhardmin },
            { type: gl.FLOAT, name: 'shardmin', value: this.shardmin },
            { type: gl.FLOAT, name: 'hlimit', value: this.hlimit },
            { type: gl.FLOAT, name: 'hlist', value: hlist },
            {
                type: gl.BOOL,
                name: 'bisbackground',
                value: isBackground ? 1 : 0,
            },
            {
                type: gl.BOOL,
                name: 'btintbackground',
                value:
                    this.manager.currentFunction ==
                    this.manager.FUNCTION_ENUM.CHROMA_KEY_PICKER,
            },
            { type: gl.BOOL, name: 'bpurebackground', value: pureBackground },
        ];

        return parameters;
    };

    getShader = function () {
        const vertShaderSource = `
            attribute vec2 position;
            varying vec2 texCoords;
            void main() {
                texCoords = (position + 1.0) / 2.0;
                texCoords.y = 1.0 - texCoords.y;
    
                gl_Position = vec4(position, 0, 1.0);
            }
        `;

        const fragShaderSource = `
            precision highp float;
            varying vec2 texCoords;
            uniform sampler2D uTexture;
            
            uniform float vhardmin;
            uniform float shardmin;
            uniform float hlimit;
            uniform bool bisbackground;
            uniform bool btintbackground;
            uniform bool bpurebackground;
            uniform float hlist[32];
    
            float diffc(float c, float v, float diff){
                float nom = (v - c) / 6.0 ;
                return ( nom / diff + 0.5);
            }
    
            vec3 rgbToHSV(vec3 c){
                vec3 hsv = vec3(0.0, 0.0, max(max(c.r, c.g), c.b));
                float diff = hsv.z - min(min(c.r, c.g), c.b);
                
                if (diff != 0.0) {
                    hsv.y = diff / hsv.z;
                    float rr = diffc(c.r, hsv.z, diff);
                    float gg = diffc(c.g, hsv.z, diff);
                    float bb = diffc(c.b, hsv.z, diff);
    
                    if (c.x == hsv.z) {
                        hsv.x = bb - gg;
                    } else if (c.y == hsv.z) {
                        hsv.x = (1.0 / 3.0) + rr - bb;
                    } else if (c.z == hsv.z) {
                        hsv.x = (2.0 / 3.0) + gg - rr;
                    }
                    if (hsv.x < 0.0) {
                        hsv.x += 1.0;
                    }else if (hsv.x > 1.0) {
                        hsv.x -= 1.0;
                    }
                }
                return hsv;
            }
    
            bool isBackground(vec3 hsv, float hlist[32], float hlimit){
                if (hsv.z < vhardmin){
                    return false;
                }
                if (hsv.y < shardmin){
                    return false;
                }
    
                bool isB = false;
                for (int i = 0; i < 32; i++){
                    if (abs(hsv.x - hlist[i]) <= hlimit){
                        isB = true;
                    }
                }
                return isB;
            }
    
            void main() {
                vec4 color = texture2D(uTexture, texCoords);
                vec3 hsv = rgbToHSV(color.xyz);	
    
                bool isb = bpurebackground;
                if (!isb)
                    isb = isBackground(hsv, hlist, hlimit);
    
                if (bisbackground){
                    if (!isb){
                        color = vec4(0.0);
                    }else if (btintbackground){
                        // tint with a subtle red
                        vec3 tint = vec3(0.68235, 0.12549, 0.113725);
                        color.rgb = mix(color.rgb, tint, 0.5);
                    }
                }else{
                    if (isb){
                        color = vec4(0.0);
                    }
                }
                gl_FragColor = color;
            }
        `;

        return { vert: vertShaderSource, frag: fragShaderSource };
    };
}

let Utils = {};

Utils.RGBtoHSV = function (r, g, b) {
    if (arguments.length === 1) {
        g = r.g;
        b = r.b;
        r = r.r;
    }
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let d = max - min;
    let h = null;
    let s = max === 0 ? 0 : d / max;
    let v = max / 255;

    switch (max) {
        case min:
            h = 0;
            break;
        case r:
            h = g - b + d * (g < b ? 6 : 0);
            h /= 6 * d;
            break;
        case g:
            h = b - r + d * 2;
            h /= 6 * d;
            break;
        case b:
            h = r - g + d * 4;
            h /= 6 * d;
            break;
    }

    return {
        h: h,
        s: s,
        v: v,
    };
};
