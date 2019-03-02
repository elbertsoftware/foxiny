import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';

const rawTheme = createMuiTheme({
  overrides: {
    MuiExpansionPanelSummary: {
      expandIcon: {
        '&:hover': {
          backgroundColor: '#e0e0e0',
        },
      },
    },
    MuiIconButton: {
      colorSecondary: {
        '&:hover': {
          backgroundColor: '#ffccbc',
        },
      },
      colorPrimary: {
        '&:hover': {
          backgroundColor: '#cfd8dc',
        },
      },
    },
    MuiButton: {
      textSecondary: {
        '&:hover': {
          backgroundColor: '#ffccbc',
        },
      },
      textPrimary: {
        '&:hover': {
          backgroundColor: '#cfd8dc',
        },
      },
    },
  },
  palette: {
    primary: {
      light: '#5c7184',
      main: '#314657',
      dark: '#071f2e',
    },
    secondary: {
      light: '#ffccbc',
      main: '#ff512f',
      dark: '#c40e00',
    },
    warning: {
      main: '#ffc071',
      dark: '#ffb25e',
    },
    error: {
      xLight: red[50],
      main: red[700],
      dark: red[900],
    },
    success: {
      xLight: green[50],
      dark: green[700],
    },
    text: {
      secondary: 'rgba(0, 0, 0, 0.76)',
    },
  },
  typography: {
    fontFamily: "'Patrick Hand', cursive",
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 700,
    useNextVariants: true,
  },
});

const fontHeader = {
  color: rawTheme.palette.primary.dark,
  fontWeight: rawTheme.typography.fontWeightMedium,
  fontFamily: rawTheme.typography.fontFamilySecondary,
};

const theme = {
  ...rawTheme,
  palette: {
    ...rawTheme.palette,
    background: {
      ...rawTheme.palette.background,
      default: '#eeeeee',
      placeholder: grey[300],
    },
  },
  typography: {
    ...rawTheme.typography,
    fontHeader,
    h1: {
      ...rawTheme.typography.h1,
      ...fontHeader,
      letterSpacing: 0,
      fontSize: 62,
    },
    h2: {
      ...rawTheme.typography.h2,
      ...fontHeader,
      fontSize: 50,
    },
    h3: {
      ...rawTheme.typography.h3,
      ...fontHeader,
      fontSize: 44,
    },
    h4: {
      ...rawTheme.typography.h4,
      ...fontHeader,
      fontSize: 40,
    },
    h5: {
      ...rawTheme.typography.h5,
      color: rawTheme.palette.primary.dark,
      fontSize: 24,
      fontWeight: rawTheme.typography.fontWeightLight,
      letterSpacing: '1px',
    },
    h6: {
      ...rawTheme.typography.h6,
      color: rawTheme.palette.text.secondary,
      fontSize: 20,
      fontWeight: rawTheme.typography.fontWeightLight,
      lineHeight: 'normal',
    },
    subtitle1: {
      ...rawTheme.typography.subtitle1,
      fontSize: 20,
    },
    subtitle2: {
      ...rawTheme.typography.subtitle2,
      fontSize: 18,
      fontWeight: rawTheme.typography.fontWeightLight,
      color: grey[600],
    },
    body1: {
      ...rawTheme.typography.body2,
      fontWeight: rawTheme.typography.fontWeightRegular,
      fontSize: 20,
    },
    body2: {
      ...rawTheme.typography.body1,
      fontSize: 18,
    },
  },
};

export default theme;
