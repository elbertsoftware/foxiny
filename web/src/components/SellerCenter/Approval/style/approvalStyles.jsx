import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ spacing, transitions, breakpoints, palette, shape }) => ({
  bar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  toolbar: {
    justifyContent: 'space-between',
  },
  table: {
    marginTop: 16,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 20,
    objectFit: 'contain',
    marginRight: 16,
  },
  button: {
    borderRadius: '30px',
  },
  productCard: {
    display: 'flex',
    alignItems: 'center',
    padding: 16,
  },
  searchContainer: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    marginRight: 8,
    borderRadius: shape.borderRadius,
    background: palette.grey[200],
    '&:hover': {
      background: palette.grey[300],
    },
    marginLeft: 0,
    width: '30%',
    [breakpoints.up('sm')]: {
      marginLeft: spacing.unit,
      width: 'auto',
      minWidth: 300,
    },
  },
  searchIcon: {
    width: spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    borderRadius: 4,
    paddingTop: spacing.unit,
    paddingRight: spacing.unit,
    paddingBottom: spacing.unit,
    paddingLeft: spacing.unit * 10,
    transition: transitions.create('width'),
    width: '100%',
    [breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 320,
      },
    },
  },
}));
export default useStyles;
