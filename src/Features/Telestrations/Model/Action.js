export class Action {
    constructor(type) {
        this.type = type;
    }
}

export class ActionManager {
    constructor(teletrationManager) {
        this.manager = teletrationManager;

        this.actions = [];
        this.backupActions = [];
    }

    clearActions = function () {
        this.actions = [];
        this.backupActions = [];
    };

    pushAction = function (type) {
        this.actions.push(new Action(type));
    };

    restoreActions = function () {
        this.actions = this.backupActions;
    };

    setBackupActions = function () {
        // modify 'undo' temporarily to only undo chroma key picking
        this.backupActions = this.actions;
        this.actions = [];
    };

    undoAction = function () {
        if (this.actions.length > 0) {
            let lastAction = this.actions.pop();
            switch (lastAction.type) {
                case ActionTypeEnum.PLACE_LIGHT_SHAFT:
                    if (this.manager.lightShafts.length > 0) {
                        let lf = this.manager.lightShafts.pop();
                        this.manager.clearTelestration(lf);
                    }
                    break;
                case ActionTypeEnum.PLACE_CURSOR:
                    if (this.manager.cursors.length > 0) {
                        let kf = this.manager.cursors.pop();
                        this.manager.clearTelestration(kf);
                    }
                    break;
                case ActionTypeEnum.PLACE_ARROW:
                    if (this.manager.arrows.length > 0) {
                        const a = this.manager.arrows.pop();
                        this.manager.clearTelestration(a);
                    }
                    break;
                case ActionTypeEnum.PLACE_SMOOTH_ARROW:
                    if (this.manager.freehandArrows.length > 0) {
                        const fa = this.manager.freehandArrows.pop();
                        this.manager.clearTelestration(fa);
                    }
                    break;
                case ActionTypeEnum.CHROMA_KEY_PICK:
                    this.manager.undoChromaKey();
                    break;
                case ActionTypeEnum.PLACE_LINKED_CURSOR:
                    if (this.manager.linkedCursors.length > 0) {
                        const lc = this.manager.linkedCursors.pop();
                        this.manager.clearTelestration(lc);
                    }
                    break;
                case ActionTypeEnum.PLACE_LINKED_CURSOR_CURSOR:
                    if (
                        this.manager.creationObject &&
                        this.manager.creationObject.removeLastConfirmedCursor
                    ) {
                        this.manager.creationObject.removeLastConfirmedCursor();
                    }
                    break;
                case ActionTypeEnum.PLACE_POLYGON:
                    if (this.manager.polygons.length > 0) {
                        const po = this.manager.polygons.pop();
                        this.manager.clearTelestration(po);
                    }
                    break;
                case ActionTypeEnum.PLACE_POLYGON_POINT:
                    if (
                        this.manager.creationObject &&
                        this.manager.creationObject.removeLastConfirmedPoint
                    ) {
                        this.manager.creationObject.removeLastConfirmedPoint();
                    }
                    break;
                case ActionTypeEnum.PLACE_PLAYER_CUT_OUT:
                    if (this.manager.playerCutOuts.length > 0) {
                        const pcc = this.manager.playerCutOuts.pop();
                        const pca = this.manager.arrows.pop();
                        this.manager.clearTelestration(pcc);
                        this.manager.clearTelestration(pca);
                    }
                    break;
            }
        }
    };
}

export const ActionTypeEnum = {
    PLACE_ARROW: 1,
    PLACE_CURSOR: 0,
    PLACE_SMOOTH_ARROW: 2,
    CHROMA_KEY_PICK: 3,
    PLACE_LINKED_CURSOR: 4,
    PLACE_POLYGON: 5,
    PLACE_POLYGON_POINT: 9,
    PLACE_LIGHT_SHAFT: 6,
    PLACE_LINKED_CURSOR_CURSOR: 7,
    PLACE_PLAYER_CUT_OUT: 8,
};
