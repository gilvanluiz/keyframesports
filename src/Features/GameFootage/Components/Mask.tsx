import * as React from 'react';
import clsx from 'clsx';
import {
    Popover,
    withStyles,
    WithStyles as IWithStyles,
    Typography,
    Box,
} from '@material-ui/core';
import { compose } from 'fp-ts/lib/function';
import { StyledSwitch } from './Switch';
import { RoundIcon } from './RoundIcon';
import {
    withTelestrationState,
    setModeAction,
    callChromakeyAction,
} from '../../Telestrations/State';
import {
    ITelestrationStateMgr,
    IAction,
    EditMode,
} from '../../Telestrations/Types';
import { chromaKeyActions } from '../../../Assets/video';
import maskTooltip from '../../../Assets/TooltipMask.png';
import { styles } from './styles/MaskStyles';
import { sendUserEvent } from 'src/App/UserEvents/UserEventManager';
import { telestrationSaveMask, telestrationUndoMask } from 'src/App/UserEvents';

interface IProps extends IWithStyles {
    telestrationStateMgr: ITelestrationStateMgr;
    videoID: string;
}

const mask = ({ telestrationStateMgr, classes, videoID }: IProps) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const { state, dispatchAction } = telestrationStateMgr;

    const handlePopoverOpen = (
        event: React.MouseEvent<HTMLElement, MouseEvent>
    ) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    function onSwitch() {
        const editMode =
            state.editMode === 'chromakey'
                ? 'default'
                : ('chromakey' as EditMode);
        const action = setModeAction(editMode) as IAction;
        dispatchAction(action);
    }

    const onChromaKeyAction = (actionName: 'undo' | 'clear' | 'save') => {
        if (actionName === 'undo') {
            sendUserEvent(telestrationUndoMask, window.location.href, videoID);
        }
        if (actionName === 'save') {
            sendUserEvent(telestrationSaveMask, window.location.href, videoID);
        }
        const action = callChromakeyAction(actionName);
        dispatchAction(action);
    };

    return (
        <Box>
            <Box
                className={clsx(
                    classes.flex,
                    classes.center,
                    classes.spaceBetween,
                    classes.action
                )}
            >
                <Box
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                    className={clsx(classes.flex, classes.spaceBetween)}
                >
                    <Typography className={classes.mask}>Mask</Typography>
                    <RoundIcon iconName='info' />
                    <Popover
                        id='mouse-over-popover'
                        className={classes.popover}
                        classes={{
                            paper: classes.popoverPaper,
                        }}
                        open={!!anchorEl}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                    >
                        <img
                            src={maskTooltip}
                            alt='mask tooltip'
                            className={classes.tooltip}
                        />
                    </Popover>
                </Box>
                <Box>
                    <StyledSwitch
                        checked={state.editMode === 'chromakey'}
                        onChange={onSwitch}
                    />
                </Box>
            </Box>
            <Box
                className={clsx(
                    classes.flex,
                    classes.spaceBetween,
                    classes.action
                )}
            >
                {chromaKeyActions.map((action, i) => (
                    <Box
                        key={i}
                        onClick={() => onChromaKeyAction(action)}
                        className={clsx(
                            classes.flex,
                            classes.start,
                            classes.name,
                            classes.capitalize
                        )}
                    >
                        <Box className={classes.chromaKeyIcons}>
                            <RoundIcon iconName={action} isButton />
                        </Box>
                        <Typography className={classes.chromaKeyActions}>
                            {action}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export const Mask = compose(withStyles(styles), withTelestrationState)(mask);
