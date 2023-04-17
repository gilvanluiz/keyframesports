import * as React from 'react';
import clsx from 'clsx';
import { Theme as ITheme } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Checkbox, {
    CheckboxProps as ICheckboxProps,
} from '@material-ui/core/Checkbox';
import { fade } from '@material-ui/core/styles/colorManipulator';

const useStyles = (theme: ITheme) =>
    makeStyles({
        root: {
            '&:hover': {
                backgroundColor: 'transparent',
            },
        },
        icon: {
            borderRadius: '0px',
            width: '10px',
            height: '10px',
            border: '1px solid #fff',
            backgroundColor: 'transparent',
            '$root.Mui-focusVisible &': {
                outline: 'none',
                outlineOffset: 0,
            },
            'input:hover ~ &': {
                backgroundColor: fade(theme.palette.primary.main, 0.8),
            },
            'input:disabled ~ &': {
                boxShadow: 'none',
                background: '#fff',
            },
        },
        checkedIcon: {
            backgroundColor: theme.palette.primary.main,
            '&:before': {
                display: 'block',
                width: '8px',
                height: '8px',
                backgroundImage:
                    //  tslint:disable-next-line
                    "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
                    //  tslint:disable-next-line
                    " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
                    //  tslint:disable-next-line
                    "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
                //  tslint:disable-next-line
                content: '""',
            },
            'input:hover ~ &': {
                backgroundColor: 'rgba(212, 70, 63, .8)',
            },
        },
    });

export const StyledCheckbox = (props: ICheckboxProps) => {
    const theme = useTheme();
    const classes = useStyles(theme)();

    return (
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Checkbox
                className={classes.root}
                style={{
                    backgroundColor: 'transparent',
                    padding: '0px',
                }}
                disableRipple
                color='default'
                checkedIcon={
                    <span className={clsx(classes.icon, classes.checkedIcon)} />
                }
                icon={<span className={classes.icon} />}
                {...props}
            />
        </div>
    );
};
