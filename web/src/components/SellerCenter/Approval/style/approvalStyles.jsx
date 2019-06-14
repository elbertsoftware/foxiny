import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  bar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
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
});
export default useStyles;
