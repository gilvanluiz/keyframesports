export const styles = {
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
    form: {
        margin: '15px 0',
    },
    files: {
        padding: '10px',
        paddingBottom: '0px',
        maxHeight: '190px',
        overflowY: 'scroll' as 'scroll',
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    videoTitle: {
        marginRight: '12px',
        width: '30%',
    },
    videoDescription: {
        width: 'calc(70% - 24px)',
        marginRight: '12px',
    },
    attachedFile: {
        display: 'flex',
        justifyContent: 'space-between',
        border: '1px solid rgba(255, 255, 255, 0.23)',
    },
    clearIcon: {
        cursor: 'pointer',
        alignSelf: 'center',
        '&:hover': {
            color: '#3f7fb5ab',
        },
    },
    divider: {
        background: '#fff',
    },
};
