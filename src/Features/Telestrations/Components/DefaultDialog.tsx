import { withStyles } from '@material-ui/core/styles';
import { compose } from 'fp-ts/lib/function';
import {
    Button,
    Box,
    Divider,
    DialogTitle,
    Dialog,
    Theme as ITheme,
    WithStyles as IWithStyles,
} from '@material-ui/core';

import { withLocalState } from 'src/App/LocalState';
import { ITelestrationStateMgr } from '../Types';
import * as React from 'react';

const styles = (theme: ITheme) => ({
    dialogBox: {
        borderRadius: '10px',
    },
    dialogTitle: {
        textAlign: 'center' as 'center',
    },
    buttonsRow: {
        display: 'flex',
    },
    button: {
        width: '50%',
        padding: '10px',
        borderRadius: '0px',
        borderTop: '1px solid #fff',
        '&:last-child': {
            borderLeft: '1px solid #fff',
        },
    },
});

interface IProps extends IWithStyles {
    telestrationStateMgr: ITelestrationStateMgr;
    openState: boolean;
    closeModal: any;
    confirm: any;
}

const defaultDialog = ({
    classes,
    telestrationStateMgr,
    openState,
    closeModal,
    confirm,
}: IProps) => {
    return (
        <Box>
            <Dialog open={openState} onClose={closeModal}>
                <Box className={classes.dialogBox}>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <Divider />

                    <Box className={classes.buttonRow}>
                        <Button className={classes.button} onClick={confirm}>
                            Yes
                        </Button>
                        <Button className={classes.button} onClick={closeModal}>
                            No
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </Box>
    );
};

export const DefaultDialog = compose(
    withLocalState,
    withStyles(styles)
)(defaultDialog);
