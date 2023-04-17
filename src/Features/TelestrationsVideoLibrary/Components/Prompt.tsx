import * as React from 'react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import {
    Snackbar,
    Button,
    Checkbox,
    Typography,
    Box,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import LinkedCursorIcon from '../Assets/LinkedCursor.png';
import PlayerCutOutIcon from '../Assets/PlayerCutOut.png';
import CircleIcon from '../Assets/Circle.png';
import LightShaftIcon from '../Assets/LightShaft.png';
import PolygonIcon from '../Assets/Polygon.png';
import ArrowIcon from '../Assets/Arrow.png';
import StraightArrowIcon from '../Assets/StraightArrow.png';
import FreehandArrowIcon from '../Assets/FreehandArrow.png';
import ControlPlusScroll from '../Assets/ControlPlusScroll.png';
import ControlPlusLMB from '../Assets/ControlPlusLMB.png';
import ShiftPlusScrollIcon from '../Assets/ShiftPlusScroll.png';
import RMB from '../Assets/RMB.png';
import LMB from '../Assets/LMB.png';

const styles = (theme: ITheme) => ({
    container: {
        maxWidth: theme.spacing(62.5),
        padding: theme.spacing(2.5),
        paddingBottom: theme.spacing(1),
        background: theme.palette.primary.main,
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
    },
    titleText: {
        textTransform: 'uppercase' as 'uppercase',
        display: 'flex',
        justifyContent: 'center',
        flex: 1,
    },
    closeButton: {
        alignSelf: 'baseline',
        padding: theme.spacing(0.5),
        minWidth: '0px',
        borderRadius: '50%',
    },
    smallTextIcon: {
        height: theme.spacing(3.5),
        margin: `0px ${theme.spacing(0.75)}px -${theme.spacing(1.25)}px`,
    },
    mediumTextIcon: {
        height: theme.spacing(4.25),
        margin: `0px ${theme.spacing(0.75)}px -${theme.spacing(1.5)}px`,
    },
    bigTextIcon: {
        height: theme.spacing(5),
        margin: `0px ${theme.spacing(0.75)}px -${theme.spacing(2)}px`,
    },
    borderedIcon: {
        border: '1px solid rgb(84, 84, 84)',
        borderRadius: '50%',
    },
    mainText: {
        lineHeight: 2,
        fontWeight: 500,
    },
    actions: {
        marginTop: theme.spacing(1),
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    checkbox: {
        color: `${theme.palette.common.white} !important`,
    },
    maskHintIcon: {
        margin: `0 0 -${theme.spacing(1.6)}px 0`,
    },
});

interface IProps extends IWithStyles {
    editMode: string;
}

const prompt = ({ editMode, classes }: IProps) => {
    const [open, setOpen] = useState(true);

    const currentPrompt = (() => {
        switch (editMode) {
            case 'playercutout': {
                return {
                    name: 'Player Cut Out Tool',
                    body: (
                        <Box>
                            <Typography className={classes.mainText}>
                                When using the Player Cut Out Tool
                                <img
                                    src={PlayerCutOutIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                , you can drag a box around the player and drag
                                your cut-out to where you want the player to be
                                on the field. Just drag using the left mouse
                                button
                                <img
                                    src={LMB}
                                    className={classes.bigTextIcon}
                                />
                                to place your cut-out in position.
                            </Typography>
                            <br />
                            <Typography className={classes.mainText}>
                                Remember, you may need to change the color of
                                your arrow trail
                                <img
                                    src={StraightArrowIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                before you place it but that's it!
                            </Typography>
                        </Box>
                    ),
                };
            }
            case 'linkedcursor': {
                return {
                    name: 'Linked Circle Tool',
                    body: (
                        <Box>
                            <Typography className={classes.mainText}>
                                When using the Linked Circle Tool
                                <img
                                    src={LinkedCursorIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                , you can use CONTROL + SCROLL
                                <img
                                    src={ControlPlusScroll}
                                    className={classes.mediumTextIcon}
                                />
                                to change the size. You can also change the
                                angle of the Circle by using SHIFT + SCROLL
                                <img
                                    src={ShiftPlusScrollIcon}
                                    className={classes.mediumTextIcon}
                                />
                                to flatten or raise the Linked circle.
                            </Typography>
                            <br />
                            <Typography className={classes.mainText}>
                                To end the sequence of Linked circles, just
                                double click!
                            </Typography>
                            <br />
                            <Typography className={classes.mainText}>
                                Remember, you may need to change the color, size
                                and angle of your Linked Circle
                                <img
                                    src={LinkedCursorIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                before you place it but that's it!
                            </Typography>
                        </Box>
                    ),
                };
            }
            case 'circle': {
                return {
                    name: 'Circle Tool',
                    body: (
                        <Box>
                            <Typography className={classes.mainText}>
                                When using the Circle Tool
                                <img
                                    src={CircleIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                , you can use CONTROL + SCROLL
                                <img
                                    src={ControlPlusScroll}
                                    className={classes.mediumTextIcon}
                                />
                                to change the size. You can also change the
                                angle of the Circle by using SHIFT + SCROLL
                                <img
                                    src={ShiftPlusScrollIcon}
                                    className={classes.mediumTextIcon}
                                />
                                to flatten or raise the circle.
                            </Typography>
                            <br />
                            <Typography className={classes.mainText}>
                                Remember, you may need to change the color, size
                                and angle of your Circle Tool
                                <img
                                    src={CircleIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                before you place it but that's it!
                            </Typography>
                        </Box>
                    ),
                };
            }
            case 'lightshaft': {
                return {
                    name: 'Light Beam Tool',
                    body: (
                        <Box>
                            <Typography className={classes.mainText}>
                                When using the Light Beam
                                <img
                                    src={LightShaftIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                , you can use CONTROL + SCROLL
                                <img
                                    src={ControlPlusScroll}
                                    className={classes.mediumTextIcon}
                                />
                                to change the size. You can also change the
                                angle of the Light Beam by using SHIFT + SCROLL
                                <img
                                    src={ShiftPlusScrollIcon}
                                    className={classes.mediumTextIcon}
                                />
                                to flatten or raise the lens.
                            </Typography>
                            <br />
                            <Typography className={classes.mainText}>
                                Remember, you may need to change the size and
                                angle of your Light Beam
                                <img
                                    src={LightShaftIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                before you place it but that's it!
                            </Typography>
                        </Box>
                    ),
                };
            }
            case 'polygon_t': {
                return {
                    name: 'Polygon Tool',
                    body: (
                        <Box>
                            <Typography className={classes.mainText}>
                                When using the Polygon Tool
                                <img
                                    src={PolygonIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                , you'll need to select four points. When you
                                pick point 4, the shape will appear in your
                                recording.
                            </Typography>
                            <br />
                            <Typography className={classes.mainText}>
                                Remember, you may need to change the color of
                                your Polygon Tool
                                <img
                                    src={PolygonIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                before you place it but that's it!
                            </Typography>
                        </Box>
                    ),
                };
            }
            case 'arrow':
            case 'freearrow':
            case 'straightarrow': {
                return {
                    name: 'Arrow Tools',
                    body: (
                        <Box>
                            <Typography className={classes.mainText}>
                                When using the Arrow Tools
                                <img
                                    src={ArrowIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                <img
                                    src={FreehandArrowIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                <img
                                    src={StraightArrowIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                , try using the right mouse button
                                <img
                                    src={RMB}
                                    className={classes.bigTextIcon}
                                />
                                or holding CONTROL + left mouse button
                                <img
                                    src={ControlPlusLMB}
                                    className={classes.bigTextIcon}
                                />
                                and dragging to draw a dashed arrow or the left
                                mouse button
                                <img
                                    src={LMB}
                                    className={classes.bigTextIcon}
                                />
                                and dragging to draw a regular arrow.
                            </Typography>
                            <br />
                            <Typography className={classes.mainText}>
                                Remember, you may need to change the color and
                                angle of your Arrow Tools
                                <img
                                    src={ArrowIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                <img
                                    src={FreehandArrowIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                <img
                                    src={StraightArrowIcon}
                                    className={clsx(
                                        classes.smallTextIcon,
                                        classes.borderedIcon
                                    )}
                                />
                                before you draw it but that's it!
                            </Typography>
                        </Box>
                    ),
                };
            }
            default: {
                return null;
            }
        }
    })();

    const onClose = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setOpen(false);
    };

    const doNotShowPrompt = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.checked
            ? localStorage.setItem(
                  `doNotShowPrompt_${editMode}`,
                  `${event.target.checked}`
              )
            : localStorage.removeItem(`doNotShowPrompt_${editMode}`);
    };

    useEffect(() => {
        setOpen(true);
    }, [editMode]);

    return (
        <Snackbar
            open={
                open &&
                !!currentPrompt &&
                !localStorage.getItem(`doNotShowPrompt_${editMode}`)
            }
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Alert
                className={classes.container}
                variant='filled'
                severity='info'
                icon={<></>}
            >
                <Box className={classes.title}>
                    <Typography variant='h5' className={classes.titleText}>
                        {currentPrompt?.name}
                    </Typography>
                    <Button className={classes.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </Button>
                </Box>
                <br />
                {currentPrompt?.body}
                <Box className={classes.actions}>
                    <Checkbox
                        className={classes.checkbox}
                        size='small'
                        onChange={doNotShowPrompt}
                    />
                    Don't show this message again
                </Box>
            </Alert>
        </Snackbar>
    );
};

export const Prompt = withStyles(styles)(prompt);
