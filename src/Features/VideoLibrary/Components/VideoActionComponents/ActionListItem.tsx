import * as React from 'react';
import { ListItem, ListItemText } from '@material-ui/core';
import { IAction } from './types';

interface IActionListProps {
    action: IAction;
}

export const ActionListItem = ({ action }: IActionListProps) => {
    return (
        <ListItem button component='a' onClick={action.onClick}>
            <ListItemText primary={action.text} />
        </ListItem>
    );
};
