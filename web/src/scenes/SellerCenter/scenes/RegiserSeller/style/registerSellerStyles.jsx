const signStyles = theme => ({
  container: {
    width: '100vw',
    height: '100vh',
    maxWidth: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: theme.palette.primary.main,
    width: '60%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  logotypeImage: {
    width: 165,
    marginBottom: theme.spacing.unit * 4,
  },
  logotypeText: {
    color: 'white',
    fontWeight: 500,
    fontSize: 84,
    [theme.breakpoints.down('md')]: {
      fontSize: 48,
    },
  },
  formContainer: {
    overflow: 'hidden',
    padding: 25,
    width: '40%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '70%',
    },
  },
  form: {
    width: 320,
  },
  formSellerInfo: {
    width: 420,
  },
  finalForm: {
    padding: 10,
  },
  tab: {
    fontWeight: 400,
    fontSize: 18,
  },
  businessTypeImg: {
    width: '100%',
    height: 250,
    objectFit: 'contain',
    marginTop: 24,
  },
  tabContent: {
    overflowX: 'hidden',
  },
  greeting: {
    fontWeight: 500,
    textAlign: 'center',
    marginTop: theme.spacing.unit * 4,
  },
  subGreeting: {
    fontWeight: 500,
    textAlign: 'center',
    marginTop: theme.spacing.unit * 2,
  },
  googleButton: {
    marginTop: theme.spacing.unit * 6,
    boxShadow: theme.customShadows.widget,
    backgroundColor: 'white',
    width: '100%',
    textTransform: 'none',
  },
  googleButtonCreating: {
    marginTop: 0,
  },
  googleIcon: {
    width: 30,
    marginRight: theme.spacing.unit * 2,
  },
  creatingButtonContainer: {
    marginTop: theme.spacing.unit * 2.5,
    height: 46,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createAccountButton: {
    height: 46,
    textTransform: 'none',
  },
  formDividerContainer: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
    display: 'flex',
    alignItems: 'center',
  },
  formDividerWord: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  formDivider: {
    flexGrow: 1,
    height: 1,
    backgroundColor: theme.palette.text.hint,
  },
  fieldRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rightSpacing: {
    marginRight: theme.spacing.unit * 2,
  },
  messagesContainer: {
    border: '1px solid grey',
    borderRadius: 20,
    padding: 16,
    margin: '16px 0',
  },
  formButtons: {
    padding: '16px 0',
    width: '100%',
    marginTop: theme.spacing.unit * 4,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgetButton: {
    textTransform: 'none',
    fontWeight: 400,
  },
  loader: {
    marginLeft: theme.spacing.unit * 4,
  },
  formControl: {
    marginRight: theme.spacing.unit * 2,
    minWidth: 120,
  },
});

export default signStyles;
