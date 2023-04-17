import { EditMode as IEditMode } from '../../Types';

export type IToolSize = {
    [key in IEditMode]: {
        maxValue: number;
        minValue: number;
        currentValue: number;
    };
};

export type IToolPerspective = {
    [key in IEditMode]: {
        maxValue: number;
        minValue: number;
        currentValue: number;
    };
};

export const initialToolSizes: IToolSize = {
    playercutout: {
        maxValue: 50,
        minValue: 10,
        currentValue: 28,
    },
    lightshaft: {
        maxValue: 120,
        minValue: 10,
        currentValue: 40,
    },
    arrow: {
        maxValue: 50,
        minValue: 10,
        currentValue: 28,
    },
    straightarrow: {
        maxValue: 50,
        minValue: 10,
        currentValue: 28,
    },
    freearrow: {
        maxValue: 50,
        minValue: 10,
        currentValue: 28,
    },
    circle: {
        maxValue: 120,
        minValue: 10,
        currentValue: 40,
    },
    linkedcursor: {
        maxValue: 200,
        minValue: 10,
        currentValue: 40,
    },

    chromakey: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    polygon_t: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    undo: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    redo: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    record: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    stop_recording: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    default: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    save_effect: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    chromakey_first_mount: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    textbox: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
};
export const initialToolPerspectives: IToolPerspective = {
    playercutout: {
        maxValue: 1,
        minValue: 0.2,
        currentValue: 0.36,
    },
    lightshaft: {
        maxValue: 1,
        minValue: 0.2,
        currentValue: 0.36,
    },
    arrow: {
        maxValue: 1,
        minValue: 0.2,
        currentValue: 0.36,
    },
    straightarrow: {
        maxValue: 1,
        minValue: 0.2,
        currentValue: 0.36,
    },
    freearrow: {
        maxValue: 1,
        minValue: 0.2,
        currentValue: 0.36,
    },
    circle: {
        maxValue: 1,
        minValue: 0.2,
        currentValue: 0.36,
    },
    linkedcursor: {
        maxValue: 1,
        minValue: 0.2,
        currentValue: 0.36,
    },

    chromakey: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    polygon_t: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    undo: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    redo: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    record: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    stop_recording: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    default: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    save_effect: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    chromakey_first_mount: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
    textbox: {
        maxValue: 0,
        minValue: 0,
        currentValue: 0,
    },
};

export const toolsDrawerInitialState = {
    circle: {
        wasClosed: false,
        currentlyOpen: false,
    },
    arrow: {
        wasClosed: false,
        currentlyOpen: false,
    },
    freearrow: {
        wasClosed: false,
        currentlyOpen: false,
    },
    straightarrow: {
        wasClosed: false,
        currentlyOpen: false,
    },
    lightshaft: {
        wasClosed: false,
        currentlyOpen: false,
    },
    playercutout: {
        wasClosed: false,
        currentlyOpen: false,
    },
    linkedcursor: {
        wasClosed: false,
        currentlyOpen: false,
    },
};

export interface IToolsDrawerState {
    circle: {
        wasClosed: boolean;
        currentlyOpen: boolean;
    };
    arrow: {
        wasClosed: boolean;
        currentlyOpen: boolean;
    };
    lightshaft: {
        wasClosed: boolean;
        currentlyOpen: boolean;
    };
    playercutout: {
        wasClosed: boolean;
        currentlyOpen: boolean;
    };
    linkedcursor: {
        wasClosed: boolean;
        currentlyOpen: boolean;
    };
}
