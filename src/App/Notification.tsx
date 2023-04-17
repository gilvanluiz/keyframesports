import * as React from 'react';
import { withLocalState, ILocalStateMgr } from './LocalState';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

interface IProps {
    localStateMgr: ILocalStateMgr;
}

const notification = ({ localStateMgr }: IProps) => {
    const {
        state,
    } = localStateMgr;

    const handleClose = (index: number) => {
        // setState({
        //     ...state,
        //     notifications: state.notifications.filter((n, i) => i !== index),
        // });
    };

    return (
        <div>
            {state.notifications.map((n, i) => {
                return (
                    <Snackbar
                        key={i}
                        style={{ bottom: 60 * i + 20 || 20 }}
                        open={true}
                        autoHideDuration={3000}
                        onClose={() => handleClose(i)}
                    >
                        <Alert onClose={() => handleClose(i)} severity={n.type}>
                            {n.message}
                        </Alert>
                    </Snackbar>
                );
            })}
        </div>
    );
};

export const Notification = withLocalState(notification);
