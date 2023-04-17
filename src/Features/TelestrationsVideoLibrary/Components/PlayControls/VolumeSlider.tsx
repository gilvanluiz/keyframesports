import { Slider, withStyles } from '@material-ui/core';
import * as React from 'react';
import { sliderStyles } from './PlayControlsStyles';

interface IVoumeState {
    current: number;
    previous: number;
    muted: boolean;
}

interface IProps {
    volumeState: IVoumeState;
    onVolumeChange: (event: React.ChangeEvent<{}>, value: number) => void;
    classes: any;
}

const volumeSlider = ({ volumeState, onVolumeChange, classes }: IProps) => {
    return (
        <Slider
            classes={{
                root: classes.root,
                thumb: classes.thumb,
                track: classes.track,
                rail: classes.rail,
            }}
            value={volumeState.muted ? 0 : volumeState.current * 100}
            onChange={onVolumeChange}
        />
    );
};

export const VolumeSlider = withStyles(sliderStyles)(volumeSlider);
