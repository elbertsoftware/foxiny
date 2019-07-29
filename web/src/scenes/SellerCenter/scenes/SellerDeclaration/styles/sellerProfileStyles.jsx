const styles = theme => ({
  cardRoot: {
    marginTop: '3%',
    zIndex: 99,
    borderRadius: theme.spacing.unit * 2, // 16px
    transition: '0.3s',
    width: '60%',
    minHeight: '600px',
    boxShadow: '0px 14px 80px rgba(34, 35, 58, 0.2)',
    backgroundColor: '#ffffff',
    marginBottom: 24,
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
    },
    [theme.breakpoints.down(1348)]: {
      width: '80%',
    },
    [theme.breakpoints.down(800)]: {
      padding: 20,
    },
  },
  cardMedia: {
    position: 'relative',
    height: 300,
  },
  buttonBase: {
    position: 'absolute',
    zIndex: 10,
  },
  buttonChangeAva: {
    bottom: 0,
    left: 54,
  },
  buttonChangeCover: {
    top: '30%',
    left: '45%',
  },
  avatar: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    border: '2px solid #ffffff',
    transform: 'translateY(32%)',
    alignItems: 'center',
  },
  avatarDarker: {
    filter: 'brightness(70%)',
  },
  changeAvaIcon: {
    color: 'rgba(245,245,245)',
  },
  avatarBig: {
    width: 150,
    height: 150,
  },
  contentRoot: {
    paddingTop: 8,
  },
  cardAction: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  more: {
    padding: 4,
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  subheading: {
    marginBottom: 12,
  },
  button: {
    borderRadius: 20,
    marginLeft: 16,
    boxShadow: 'none',
    minWidth: 100,
  },
  finalForm: {
    padding: 32,
  },
  field: {
    width: '90%',
    marginBottom: 16,
  },
  width60: {
    width: '60%',
  },
  formControl: {
    margin: 0,
  },
  width30: {
    width: '30%',
  },
  marginBottom: {
    marginBottom: 18,
  },
  icon: {},
  buttonSend: {
    transform: 'translate(16%, -30%)',
  },
});

export default styles;
