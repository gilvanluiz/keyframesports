import * as React from 'react';
import {
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
} from '@material-ui/core';
import { ArrowUpward as ArrowUpwardIcon } from '@material-ui/icons';

const styles = (theme: ITheme) => ({
    container: {
        display: 'flex',
        padding: '10px 20px',
        minHeight: '80px',
        justifyContent: 'space-between',
        flexDirection: 'row-reverse' as 'row-reverse',
    },
    uploadButton: {
        fontSize: theme.spacing(1.3),
        width: '50%',
        display: 'flex',
        cursor: 'pointer',
        border: '1px dashed #fff',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    uploadIcon: {
        border: '1px solid #fff',
        borderRadius: '50%',
        display: 'flex',
    },
});

interface IProps extends IWithStyles {
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const uploadButton = ({ classes, onClick }: IProps) => {
    return (
        <div className={classes.container}>
            <div className={classes.uploadButton} onClick={onClick}>
                <div className={classes.uploadIcon}>
                    <ArrowUpwardIcon style={{ fontSize: '1em' }} />
                </div>
                Upload video
            </div>
        </div>
    );
};

export const UploadButton = withStyles(styles)(uploadButton);
