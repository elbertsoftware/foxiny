import guilloche from '../../../../../images/guilloche.png';

const styles = theme => ({
  article: { width: '100%', margin: '0 auto' },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  wrapper: {
    zIndex: 100,
    borderRadius: theme.spacing(2), // 16px
    transition: '0.3s',
    width: '60%',
    minHeight: '600px',
    boxShadow: '0px 14px 80px rgba(34, 35, 58, 0.2)',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px 8px`,
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
  swipeContainer: {
    overflow: 'hidden',
  },
  wrapContent: {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px 0`,
    [theme.breakpoints.down(920)]: {
      justifyContent: 'center',
      width: '100%',
    },
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,

    [theme.breakpoints.down(920)]: {
      fontSize: 24,
    },
  },
  subtitle: {
    width: '70%',
    [theme.breakpoints.down(920)]: {
      fontSize: 16,
    },
  },
  logoContainer: {
    flexShrink: 0,
    width: '30%',
    height: '250px',
    transform: 'translateX(-24%)',
    boxShadow: '4px 4px 20px 1px rgba(252, 56, 56, 0.2)',
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    overflow: 'hidden',
    '&:after': {
      content: '" "',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'linear-gradient(147deg, #fe8a39 0%, #fd3838 74%)',
      borderRadius: theme.spacing(2), // 16
      opacity: 0.5,
    },
    [theme.breakpoints.down(920)]: {
      display: 'none',
    },
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  formContainer: {
    textAlign: 'left',
    paddingLeft: 0,
    padding: theme.spacing(2),
    width: '65%',
    [theme.breakpoints.down('md')]: {
      width: '80%',
    },
  },
  tabContainer: {
    marginBottom: theme.spacing(3),
  },
  heading: {
    marginTop: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0 0 16px 16px',
    marginTop: theme.spacing(4),
  },
  buttonAction: {
    backgroundImage: 'linear-gradient(147deg, #fe8a39 0%, #fd3838 74%)',
    boxShadow: '0px 4px 32px rgba(252, 56, 56, 0.4)',
    borderRadius: 100,
    paddingLeft: 24,
    paddingRight: 24,

    color: '#ffffff',
  },
  uploadZone: {
    width: '100%',
    margin: `${theme.spacing(2)}px 0`,
    height: 120,
    '& .title': {
      fontSize: 24,
      wordSpacing: 1,
    },
  },
  gridContainer: {
    width: '100%',
    overflow: 'auto',
    padding: '16px 0',
  },
  background: {
    backgroundImage: `url(${guilloche})`,
    backgroundSize: 7,
    backgroundPosition: 'left top',
    backgroundAttachment: 'fixed',
    opacity: 0.1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    minHeight: '100%',
    zIndex: 12,
  },
  v2: {
    backgroundImage: `url(${guilloche})`,
    backgroundSize: 6,
    backgroundAttachment: 'fixed',
  },
});

export default styles;
