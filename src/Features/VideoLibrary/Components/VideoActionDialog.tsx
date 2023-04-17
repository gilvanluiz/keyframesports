import * as React from 'react';
import { Divider, Menu, MenuItem } from '@material-ui/core';
import { ActionList } from './VideoActionComponents/ActionList';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme: any) => ({
    dialogWrapper: {
        minWidth: '200px',
    },
    title: {
        padding: '10px',
        fontSize: '1.4em',
    },
});

interface IProps {
    closeModal: () => any;
    classes: any;
    anchorEl: any;
    open: boolean;
}

const videoActionDialog = ({ classes, closeModal, anchorEl, open }: IProps) => {
    return (
        <Menu
            className={classes.dialogWrapper}
            id='fade-menu'
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={closeModal}
        >
            <div className={classes.title}>Select an action</div>
            <Divider />
            <ActionList />
            <MenuItem onClick={closeModal}>Close</MenuItem>
        </Menu>
    );
};

export const VideoActionDialog = withStyles(styles)(videoActionDialog);
