import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';

const rawTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#5c7184',
      main: '#314657',
      dark: '#071f2e',
    },
    secondary: {
      light: '#fff8e1',
      main: '#F9AA33',
      dark: '#c17b00',
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
      primary: '#4A4A4A',
      secondary: '#6E6E6E',
      hint: '#B9B9B9',
    },
    background: {
      default: '#F6F7FF',
      light: '#F3F5FF',
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
  shape: {
    borderRadius: 8,
  },
  customShadows: {
    widget: '0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A',
    widgetDark: '0px 3px 18px 0px #314657, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A',
    widgetWide: '0px 12px 33px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A',
  },
});

const fontHeader = {
  color: rawTheme.palette.primary.dark,
  fontWeight: rawTheme.typography.fontWeightLight,
  fontFamily: rawTheme.typography.fontFamilySecondary,
  letterSpacing: 1,
};

const theme = {
  ...rawTheme,
  overrides: {
    MuiListItem: {
      button: {
        '&:hover, &:focus': {
          backgroundColor: '#fff8e1',
        },
      },
      selected: {
        backgroundColor: '#fff8e1 !important',
        '&:focus': {
          backgroundColor: '#fff8e1',
        },
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: rawTheme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20,
        },
      },
    },
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
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
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
          backgroundColor: '#rgba(0, 0, 0, 0.08)',
        },
      },
      textPrimary: {
        '&:hover': {
          backgroundColor: '#cfd8dc',
        },
      },
      containedSecondary: {
        '&:hover': {
          backgroundColor: '#c17b00',
        },
      },
    },
    MuiMenu: {
      paper: {
        boxShadow: '0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A',
      },
    },
    MuiTableRow: {
      root: {
        height: 56,
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: '1px solid rgba(224, 224, 224, .5)',
      },
      head: {
        fontSize: '1.05rem',
      },
      body: {
        fontSize: '0.95rem',
      },
    },
  },
  palette: {
    ...rawTheme.palette,
    background: {
      ...rawTheme.palette.background,
      placeholder: grey[300],
    },
  },
  typography: {
    ...rawTheme.typography,
    fontHeader,
    h1: {
      ...rawTheme.typography.h1,
      ...fontHeader,
      wordSpacing: 3,
      fontSize: '240%',
      textTransform: 'uppercase',
    },
    h2: {
      ...rawTheme.typography.h2,
      ...fontHeader,
      fontSize: '180%',
      wordSpacing: 2,
      textTransform: 'uppercase',
    },
    h3: {
      ...rawTheme.typography.h3,
      ...fontHeader,
      fontSize: '110%',
      textTransform: 'uppercase',
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
      fontSize: 23,
      fontWeight: rawTheme.typography.fontWeightMedium,
      lineHeight: 1.5,
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
      ...rawTheme.typography.body1,
      fontWeight: rawTheme.typography.fontWeightRegular,
      fontSize: 20,
    },
    body2: {
      ...rawTheme.typography.body2,
      fontSize: 21.5,
    },
  },
};

export default theme;
