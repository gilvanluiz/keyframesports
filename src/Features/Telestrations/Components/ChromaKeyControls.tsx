import * as React from 'react';
import { ITelestrationStateMgr } from '../Types';
import { List } from '@material-ui/core';

interface IProps {
    classes: any;
    telestrationStateMgr: ITelestrationStateMgr;
}

export const chromaKeyControls = ({ classes }: IProps) => {
    return <List></List>;
};

