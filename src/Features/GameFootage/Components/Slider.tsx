import {
    Slider,
    withStyles,
    createStyles,
    Theme as ITheme,
} from '@material-ui/core';

export const StyledSlider = withStyles((theme: ITheme) =>
    createStyles({
        root: {
            color: theme.palette.grey[500],
            height: '4px',
            padding: '11px 2px 13px 0px',
        },
        thumb: {
            height: '12px',
            width: '6px',
            backgroundColor: '#fff',
            marginTop: '-4px',
            marginLeft: '-2px',
            borderRadius: '5px',
            '&:focus, &:hover, &$active': {
                boxShadow: 'inherit',
            },
        },
        active: {},
        valueLabel: {
            left: 'calc(-50% + 4px)',
        },
        track: {
            height: '4px',
            borderRadius: '4px',
        },
        rail: {
            height: '4px',
            borderRadius: '4px',
        },
    })
)(Slider);
