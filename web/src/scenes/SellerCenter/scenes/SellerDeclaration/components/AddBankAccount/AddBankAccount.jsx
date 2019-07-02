import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, FormControl, OutlinedInput, MenuItem, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Field } from 'react-final-form';
import RFTextField from '../../../../../../components/TextField/RFTextField';
import SelectList from '../../../../../../components/Select/SelectList';
import banklist from '../../data/banklist';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    marginTop: 16,
    padding: 20,
  },
  noteContainer: {
    padding: 16,
    backgroundColor: palette.secondary.light,
  },
  noteText: {
    color: palette.text.secondary,
  },
  formContainer: {
    margin: `${spacing(3)}px 0`,
  },
}));

const BankAccount = props => {
  const classes = useStyles();
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);
  return (
    <Paper className={classes.root} elevation={0}>
      <div className={classes.noteContainer}>
        <Typography gutterBottom className={classes.noteText}>
          Lưu ý đối với tài khoản ngân hàng:
        </Typography>
        <Typography gutterBottom className={classes.noteText}>
          - Trường hợp Công ty: Tên chủ tài khoản ngân hàng trùng khớp với tên Công ty trên giấy phép kinh doanh
        </Typography>
        <Typography className={classes.noteText}>
          - Trường hợp Hộ Kinh Doanh: Tên tài khoản ngân hàng là tên chủ hộ kinh doanh trên giấy phép kinh doanh
        </Typography>
      </div>
      <div className={classes.formContainer}>
        <Field
          fullWidth
          margin="normal"
          size="large"
          component={RFTextField}
          name="fullname"
          label="Họ và tên chủ tài khoản"
          type="text"
          variant="outlined"
        />
        <Field
          fullWidth
          size="large"
          margin="normal"
          component={RFTextField}
          name="accountNumber"
          label="Số tài khoản"
          type="text"
          variant="outlined"
        />
        <FormControl variant="outlined" margin="normal" fullWidth className={classes.formControl}>
          <InputLabel ref={inputLabel} htmlFor="outlined-banks">
            Tên ngân hàng
          </InputLabel>
          <Field
            name="bankList"
            component={SelectList}
            inputVariant={<OutlinedInput labelWidth={labelWidth} name="banks" id="outlined-banks" />}
          >
            {banklist.split('\n').map(bank => {
              // (BIDV) Ngan hang .....
              // Split by ), lay first ele = (BIDV va tiep tuc slice tu vi tri 1 tro di
              const keyValue = bank.split(')')[0].slice(1);
              return (
                <MenuItem key={keyValue} value={keyValue}>
                  {bank}
                </MenuItem>
              );
            })}
          </Field>
        </FormControl>
        <Field
          fullWidth
          size="large"
          component={RFTextField}
          name="bankBranch"
          label="Chi nhánh ngân hàng"
          type="text"
          variant="outlined"
          margin="normal"
        />
      </div>
    </Paper>
  );
};

BankAccount.propTypes = {};

export default BankAccount;
