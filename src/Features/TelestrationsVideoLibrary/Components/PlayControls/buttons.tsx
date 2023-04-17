import * as React from 'react';
import Forward from '../../Assets/Player/rewind-forward-2.svg';
import FastForward from '../../Assets/Player/fast-forward.svg';
import FastBackward from '../../Assets/Player/fast-backward.svg';
import PreviousVideo from '../../Assets/Player/previous-video.svg';
import NextVideo from '../../Assets/Player/next-video.svg';
import FrameForward from '../../Assets/Player/forward-frame.svg';
import BackwardFrame from '../../Assets/Player/backward-frame.svg';
import Backward from '../../Assets/Player/rewind-backward-2.svg';
import Play from '../../Assets/Player/play_icon.svg';
import Pause from '../../Assets/Player/pause-outline.svg';
import ForwardEngaged from '../../Assets/Player/Engaged/rewind-forward-2.svg';
import FastForwardEngaged from '../../Assets/Player/Engaged/fast-forward.svg';
import FastBackwardEngaged from '../../Assets/Player/Engaged/fast-backward.svg';
import PreviousVideoEngaged from '../../Assets/Player/Engaged/previous-video.svg';
import NextVideoEngaged from '../../Assets/Player/Engaged/next-video.svg';
import FrameForwardEngaged from '../../Assets/Player/Engaged/forward-frame.svg';
import BackwardFrameEngaged from '../../Assets/Player/Engaged/backward-frame.svg';
import BackwardEngaged from '../../Assets/Player/Engaged/rewind-backward-2.svg';
import PlayEngaged from '../../Assets/Player/Engaged/play_icon.svg';
import PauseEngaged from '../../Assets/Player/Engaged/pause-outline.svg';

export const controlButtons = [
    {
        name: 'prev-video',
        hint: () => 'Previous Video(Z)',
        icon: () => <img src={PreviousVideo} />,
        engagedIcon: () => <img src={PreviousVideoEngaged} />,
        keyboardEvent: 'KeyZ',
    },
    {
        name: 'fast-backward',
        hint: () => 'Fast backward(A)',
        icon: () => <img src={FastBackward} />,
        engagedIcon: () => <img src={FastBackwardEngaged} />,
        keyboardEvent: 'KeyA',
    },
    {
        name: 'rewind-backward',
        hint: () => 'Backward frame(S)',
        icon: () => <img src={BackwardFrame} />,
        engagedIcon: () => <img src={BackwardFrameEngaged} />,
        keyboardEvent: 'KeyS',
    },
    {
        name: 'replay',
        hint: () => 'Replay (Arrow Left)',
        icon: () => <img src={Backward} />,
        engagedIcon: () => <img src={BackwardEngaged} />,
        keyboardEvent: 'ArrowLeft',
    },
    {
        name: 'play/pause',
        hint: (paused: boolean | undefined) =>
            paused ? 'Play (Space)' : 'Pause (Space)',
        icon: (paused: boolean | undefined) =>
            paused ? <img src={Play} /> : <img src={Pause} />,
        engagedIcon: (paused: boolean | undefined) =>
            paused ? <img src={PlayEngaged} /> : <img src={PauseEngaged} />,
        keyboardEvent: 'Space',
    },
    {
        name: 'forward',
        hint: () => 'Forward (Arrow Right)',
        icon: () => <img src={Forward} />,
        engagedIcon: () => <img src={ForwardEngaged} />,
        keyboardEvent: 'ArrowRight',
    },
    {
        name: 'rewind-forward',
        hint: () => 'Forward frame(D)',
        icon: () => <img src={FrameForward} />,
        engagedIcon: () => <img src={FrameForwardEngaged} />,
        keyboardEvent: 'KeyD',
    },
    {
        name: 'fast-forward',
        hint: () => 'Fast forward(F)',
        icon: () => <img src={FastForward} />,
        engagedIcon: () => <img src={FastForwardEngaged} />,
        keyboardEvent: 'KeyF',
    },
    {
        name: 'next-video',
        hint: () => 'Next Video(X)',
        icon: () => <img src={NextVideo} />,
        engagedIcon: () => <img src={NextVideoEngaged} />,
        keyboardEvent: 'KeyX',
    },
];
