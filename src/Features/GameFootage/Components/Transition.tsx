import * as React from 'react';
import { useState, useEffect } from 'react';
import { Collapse } from '@material-ui/core';
import { useLocation } from 'react-router';
import { IVideo } from '../types';

interface IProps {
    children: JSX.Element;
    animation: 'collapse';
    onMount: () => void;
    onUnmount: () => void;
    video: IVideo;
}

export const Transition = (props: IProps) => {
    const { children, onMount, onUnmount, video } = props;
    const route = useLocation().pathname;
    const [opened, setOpened] = useState(false);
    const timeout = 300;

    useEffect(() => {
        if (route.includes(video.id)) {
            setOpened(true);
            onMount();
        } else {
            setOpened(false);
            onUnmount();
        }
    }, [route]);

    return (
        <Collapse in={opened} timeout={timeout}>
            {children}
        </Collapse>
    );
};
