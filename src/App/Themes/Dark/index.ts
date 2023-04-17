import { createMuiTheme } from '@material-ui/core/styles';
import Poppins from '../../../Assets/Fonts/PoppinsRegular.ttf';

//tslint:disable
declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        leftSideWidth: number;
    }
    interface ThemeOptions {
        leftSideWidth?: number;
    }
}

const poppins = {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontDisplay: 'swap' as 'swap',
    fontWeight: 400,
    src: `url(${Poppins}) format('ttf')`,
    unicodeRange:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

export default createMuiTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1097,
            xl: 1536,
        },
    },
    typography: {
        fontFamily: 'Poppins, Arial',
    },
    palette: {
        type: 'dark',
        primary: {
            main: 'rgb(236, 77, 69)',
            dark: 'rgb(26, 26, 26)',
        },
        secondary: {
            main: 'rgb(116, 243, 79)',
        },
    },
    overrides: {
        MuiPaper: {
            root: {
                backgroundColor: 'rgb(26, 26, 26)',
            },
        },
        MuiButton: {
            root: {
                borderRadius: '0px',
            },
        },
        MuiCssBaseline: {
            '@global': {
                '@font-face': [poppins],
            },
        },
    },
    leftSideWidth: 240,
});
