import {
    Switch,
    withStyles,
    createStyles,
    Theme as ITheme,
} from '@material-ui/core';

export const StyledSwitch = withStyles((theme: ITheme) =>
    createStyles({
        root: {
            width: '36px',
            height: '18px',
            padding: '0px',
            display: 'flex',
        },
        switchBase: {
            padding: '2px',
            color: theme.palette.grey[500],
            '&$checked': {
                transform: 'translateX(18px)',
                color: theme.palette.common.white,
                '& + $track': {
                    opacity: 1,
                    backgroundColor: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                },
            },
        },
        thumb: {
            width: '14px',
            height: '14px',
            boxShadow: 'none',
        },
        track: {
            border: `1px solid ${theme.palette.grey[500]}`,
            borderRadius: '8px',
            opacity: 1,
            backgroundColor: theme.palette.common.white,
        },
        checked: {},
    })
)(Switch);
