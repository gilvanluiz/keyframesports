import { Theme as ITheme } from '@material-ui/core';

export const styles = (theme: ITheme) => ({
    action: {
        marginTop: theme.spacing(1.5),
        marginBottom: theme.spacing(1.5),
    },
    tooltip: {
        width: theme.spacing(40),
    },
    popover: {
        marginTop: theme.spacing(0.5),
        pointerEvents: 'none' as 'none',
    },
    popoverPaper: {
        borderRadius: theme.spacing(1.5),
        background: '#b4b4b4',
        border: `1px solid ${theme.palette.common.white}`,
    },
    mask: {
        fontSize: theme.spacing(1.5),
        paddingRight: theme.spacing(1),
    },
    chromaKeyActions: {
        fontSize: theme.spacing(1.1),
        alignItems: 'center',
    },
    chromaKeyIcons: {
        marginRight: theme.spacing(0.8),
    },
    name: {
        width: theme.spacing(8),
    },
    capitalize: {
        textTransform: 'capitalize' as 'capitalize',
    },
    flex: {
        display: 'flex',
    },
    column: {
        flexDirection: 'column' as 'column',
    },
    start: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    spaceBetween: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
