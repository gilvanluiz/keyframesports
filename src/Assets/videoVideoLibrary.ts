export interface IClip {
    title: string;
    subtitle: string;
    duration: number;
    s3_key: string;
    id: string;
    videoStream?: string;
    recent?: boolean;
}

export const tutorial = {
    id: 'tutorial',
    title: 'Tutorial',
    subtitle: 'The Basics',
    s3_key: 'siteAssets/Tutorial2.mp4',
};

export const chromakeyTools = [
    {
        name: 'Chroma Key',
        label: 'Mask',
        mode: 'chromakey' as 'chromakey',
    },
];

export const drawTools = [
    {
        name: 'Light Shaft',
        label: 'Draw a Light Beam',
        mode: 'lightshaft' as 'lightshaft',
    },
    {
        name: 'Polygon',
        label: 'Draw a Polygon',
        mode: 'polygon_t' as 'polygon_t',
    },
    {
        name: 'Arrow',
        label: 'Draw an Arrow',
        mode: 'arrow' as 'arrow',
    },
    {
        name: 'Straight Arrow',
        label: 'Draw a Straight Arrow',
        mode: 'straightarrow' as 'straightarrow',
    },
    {
        name: 'Freehand Arrow',
        label: 'Draw a Freehand Arrow',
        mode: 'freearrow' as 'freearrow',
    },
    {
        name: 'Circle',
        label: 'Draw a Circle',
        mode: 'circle' as 'circle',
    },
    {
        name: 'Linked Cursor',
        label: 'Draw a Linked Circle',
        mode: 'linkedcursor' as 'linkedcursor',
    },
    {
        name: 'Cut Out',
        label: 'Player Cut Out',
        mode: 'playercutout' as 'playercutout',
    },
];

export const editTools = [
    {
        name: 'Clear',
        label: 'Clear Telestrations',
        mode: 'default' as 'default',
    },
    {
        name: 'Undo',
        label: 'Undo',
        mode: 'undo' as 'undo',
    },
    {
        name: 'Redo',
        label: 'Redo',
        mode: 'redo' as 'redo',
    },
];

export const recordTools = [
    {
        name: 'Record',
        label: 'Record',
        mode: 'record' as 'record',
    },
];

export const chromaKeyActions = [
    'undo' as 'undo',
    'clear' as 'clear',
    'save' as 'save',
];
