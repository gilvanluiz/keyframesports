import * as React from 'react';
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    withStyles,
} from '@material-ui/core';
import { flow } from 'fp-ts/lib/function';
import { telestrationSaveMask, telestrationUndoMask } from 'src/App/UserEvents';
import { sendUserEvent } from 'src/App/UserEvents/UserEventManager';
import { callChromakeyAction, withTelestrationState } from './../../State';
import { ITelestrationStateMgr } from 'src/Features/Telestrations/Types';
import { IActionButton } from './types';
import { styles } from './TelestrationControlsStyles';

interface IProps {
    classes: any;
    action: IActionButton;
    index: number;
    videoID: string;
    telestrationStateMgr: ITelestrationStateMgr;
}

const chromakeyActionButton = ({
    classes,
    action,
    index,
    videoID,
    telestrationStateMgr,
}: IProps) => {
    const { dispatchAction } = telestrationStateMgr;
    const onClick = () => {
        if (action.name === 'undo') {
            sendUserEvent(telestrationUndoMask, window.location.href, videoID);
        }
        if (action.name === 'save') {
            sendUserEvent(telestrationSaveMask, window.location.href, videoID);
        }

        const actionToDispatch = callChromakeyAction(action.name);
        dispatchAction(actionToDispatch);
    };

    const textEl = <Typography>{action.name}</Typography>;

    return (
        <ListItem
            key={index}
            onClick={onClick}
            className={classes.actionButton}
        >
            <ListItemIcon>{action.icon}</ListItemIcon>
            <ListItemText disableTypography primary={textEl} />
        </ListItem>
    );
};

export const ChromakeyActionButton = flow(
    withTelestrationState,
    withStyles(styles)
)(chromakeyActionButton);
