import * as React from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles, Theme as ITheme } from '@material-ui/core';
import {
    Clear as ClearIcon,
    Undo as UndoIcon,
    TurnedIn as TurnedInIcon,
    ArrowDownward as ArrowDownwardIcon,
} from '@material-ui/icons';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import { fade } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles((theme: ITheme) =>
    createStyles({
        iconContainer: {
            border: `1px solid ${theme.palette.common.white}`,
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: theme.spacing(2),
            width: theme.spacing(2),
        },
        iconButton: {
            height: theme.spacing(2.5),
            width: theme.spacing(2.5),
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: fade(theme.palette.primary.main, 0.8),
            },
        },
        icon: {
            display: 'block',
            padding: '5px',
        },
        disabled: {
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'rgba(255, 255, 255, 0.3)',
            pointerEvents: 'none',
        },
    })
);

type icon = 'info' | 'delete' | 'undo' | 'clear' | 'save' | 'downward';

interface IProps {
    iconName: icon;
    isButton?: boolean;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const RoundIcon = ({
    iconName,
    isButton,
    disabled,
    onClick,
}: IProps) => {
    const classes = useStyles();
    const icons = {
        info: <span className={classes.icon}>i</span>,
        delete: <DeleteOutlineRoundedIcon className={classes.icon} />,
        undo: <UndoIcon className={classes.icon} />,
        clear: <ClearIcon className={classes.icon} />,
        save: <TurnedInIcon className={classes.icon} />,
        downward: <ArrowDownwardIcon className={classes.icon} />,
    };

    return (
        <div
            className={clsx(
                classes.iconContainer,
                isButton && classes.iconButton,
                disabled && classes.disabled
            )}
            onClick={onClick}
        >
            {icons[iconName]}
        </div>
    );
};
