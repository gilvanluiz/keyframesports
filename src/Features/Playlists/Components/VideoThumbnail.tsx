import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    root: {
        width: '100px',
        height: '70px',
        display: 'flex',
        position: 'relative' as 'relative',
        overflow: 'hidden',
        fontSize: '1.25rem',
        alignItems: 'center',
        flexShrink: 0,
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        userSelect: 'none' as 'none',
        justifyContent: 'center' as 'center',
    },
    img: {
        width: 'inherit',
    },
});

interface IVideoThumbProps {
    classes: any;
    src: string;
}
const videoThumbnail = ({ classes, src }: IVideoThumbProps) => (
    <div className={classes.root}>
        <img className={classes.img} src={src} />
    </div>
);

export const VideoThumbnail = withStyles(styles)(videoThumbnail);
