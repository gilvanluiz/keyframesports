import * as React from 'react';
import {
    Divider,
    Button,
    Slide,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
    Typography,
} from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import { RoundIcon } from './RoundIcon';

const styles = (theme: ITheme) => ({
    container: {
        overflow: 'hidden',
        paddingTop: '10px',
        left: '0px',
        bottom: '0px',
        width: theme.leftSideWidth - 1,
        position: 'absolute' as 'absolute',
        zIndex: 2000,
    },
    shadowContainer: {
        background: theme.palette.primary.dark,
        boxShadow: '0px 2px 8px 4px #000',
    },
    buttonsRow: {
        display: 'flex',
        minHeight: theme.spacing(6),
    },
    button: {
        width: '45%',
        minWidth: 'auto',
        padding: '10px 5px',
        borderRadius: '0px',
        textTransform: 'none' as 'none',
        '&:first-child': {
            width: '40%',
        },
        '&:last-child': {
            width: '15%',
        },
        '& div:first-child': {
            marginRight: '8px',
        },
    },
    text: {
        fontSize: theme.spacing(1.1),
    },
    divider: {
        marginRight: '3px',
    },
});

interface IProps extends IWithStyles {
    open: boolean;
    toDelete: number;
    toDownload: number;
    onPress: (action: 'delete' | 'download' | 'cancel') => void;
}

const downloadDeleteButtons = ({
    open,
    toDelete,
    toDownload,
    onPress,
    classes,
}: IProps) => {
    return (
        <Slide direction='up' in={open} mountOnEnter unmountOnExit>
            <div className={classes.container}>
                <div className={classes.shadowContainer}>
                    <div className={classes.buttonsRow}>
                        <Button
                            className={classes.button}
                            onClick={() => onPress('delete')}
                        >
                            <RoundIcon iconName='delete' />
                            <Typography className={classes.text}>
                                Delete ({toDelete})
                            </Typography>
                        </Button>
                        <Divider
                            orientation='vertical'
                            flexItem
                            className={classes.divider}
                        />
                        <Button
                            disabled={!toDownload}
                            className={classes.button}
                            onClick={() => onPress('download')}
                        >
                            <RoundIcon
                                disabled={!toDownload}
                                iconName='downward'
                            />
                            <Typography className={classes.text}>
                                Download ({toDownload})
                            </Typography>
                        </Button>
                        <Divider
                            orientation='vertical'
                            flexItem
                            className={classes.divider}
                        />
                        <Button
                            className={classes.button}
                            onClick={() => onPress('cancel')}
                        >
                            <ClearIcon />
                        </Button>
                    </div>
                </div>
            </div>
        </Slide>
    );
};

export const DownloadDeleteButtons = withStyles(styles)(downloadDeleteButtons);
