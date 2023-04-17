import TelestrationManager from '../../Model/TelestrationManager';
import { EditMode } from '../../Types';

export function handleConnectToolSizeToTelestrationManager(
    telestrationManager: TelestrationManager,
    handleChangeToolSize: (newValue: number, currentEditMode: EditMode) => void
) {
    const mapCurrentFunctionToEditMode = {
        playercutout: {
            name: 'playercutout',
            currentValue: telestrationManager.arrowWidth,
        },
        lightshaft: {
            name: 'lightshaft',
            currentValue: telestrationManager.lightShaftRadius,
        },
        arrow: { name: 'arrow', currentValue: telestrationManager.arrowWidth },
        straightarrow: {
            name: 'arrow',
            currentValue: telestrationManager.arrowWidth,
        },
        freearrow: {
            name: 'arrow',
            currentValue: telestrationManager.arrowWidth,
        },
        circle: {
            name: 'circle',
            currentValue: telestrationManager.cursorRadius,
        },
        linkedcursor: {
            name: 'linkedcursor',
            currentValue: telestrationManager.cursorRadius,
        },
    };
    const currentEditMode: any =
        typeof telestrationManager.currentFunction === 'string'
            ? telestrationManager.currentFunction
            : 'default';
    if (currentEditMode !== 'default') {
        const currentToolValue =
            mapCurrentFunctionToEditMode[currentEditMode].currentValue;
        if (
            telestrationManager.controlDown &&
            currentEditMode &&
            currentToolValue
        ) {
            handleChangeToolSize(currentToolValue, currentEditMode);
        }
    }
}

export function handleConnectToolPerspectiveToTelestrationManager(
    telestrationManager: TelestrationManager,
    handleChangeToolPerspective: (
        newValue: number,
        currentEditMode: EditMode
    ) => void
) {
    const currentEditMode: EditMode =
        typeof telestrationManager.currentFunction === 'string'
            ? telestrationManager.currentFunction
            : 'default';
    if (telestrationManager.shiftDown && currentEditMode !== 'default') {
        handleChangeToolPerspective(
            telestrationManager.zAngle,
            currentEditMode
        );
    }
}
