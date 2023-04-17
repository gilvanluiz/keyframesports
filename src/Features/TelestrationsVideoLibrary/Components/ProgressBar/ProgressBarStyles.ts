import { Slider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export const VideoSlider = withStyles({
    root: {
        height: 18,
    },
    thumb: {
        height: 18,
        width: 20,
        backgroundColor: '#ec4e45',
        borderRadius: 8,
        border: 'none',
        marginTop: 0,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    track: {
        left: '-1%',
        width: 'calc(100% + 24px)',
        height: 18,
        color: '#fff',
    },
    rail: {
        marginLeft: -12,
        width: 'calc(100% + 24px)',
        height: '100%',
        color: '#fff',
    },
})(Slider);

export const videoSliderStyles = () => ({
    videoSlider: {
        padding: 0,
        position: 'relative' as 'relative',
    },
});
