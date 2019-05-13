import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  InputLabel,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
} from '@material-ui/core';
import { Field } from 'react-final-form';

function RunningModel(props) {
  const { classes } = props;
  const [labelWidth, setLabelWidth] = useState(0);
  const inputLabelRef = React.createRef();
  useEffect(() => {
    setLabelWidth(ReactDOM.findDOMNode(inputLabelRef.current).offsetWidth);
  }, []);
  return (
    <Paper>
      <AppBar className={classes.bar} position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h5">Mô hình vận hành</Typography>
        </Toolbar>
      </AppBar>
      <Grid className={classes.gridContainer} container spacing={16}>
        <Grid item xs={3}>
          <FormControl margin="normal" fullWidth variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabelRef} htmlFor="outlined-mo-hinh">
              Mô hình vận hành
            </InputLabel>
            <Field
              component={Select}
              name="moHinhSelect"
              input={<OutlinedInput labelWidth={labelWidth} name="moHinh" id="outlined-mo-hinh" />}
            >
              <MenuItem value={10}>Hàng lưu kho Foxiny</MenuItem>
              <MenuItem value={20}>Hàng lưu kho nhà bán</MenuItem>
            </Field>
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <FormControl margin="normal" fullWidth variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabelRef} htmlFor="outlined-kho-giao-hang">
              Kho giao hàng
            </InputLabel>
            <Field
              component={Select}
              name="khoSelect"
              input={<OutlinedInput labelWidth={labelWidth} name="kho" id="outlined-kho-giao-hang" />}
            >
              <MenuItem value={10}>TPHCM</MenuItem>
              <MenuItem value={20}>Bình Dương</MenuItem>
              <MenuItem value={30}>Biên Hòa</MenuItem>
            </Field>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl margin="normal" fullWidth variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabelRef} htmlFor="outlined-phuong-thuc">
              Phương thức giao hàng
            </InputLabel>
            <Field
              component={Select}
              name="phuongThucSelect"
              input={<OutlinedInput labelWidth={labelWidth} name="phuongThuc" id="outlined-phu ong-thuc" />}
            >
              <MenuItem value={10}>Foxiny đến lấy hàng</MenuItem>
              <MenuItem value={20}>Nhà bán giao hàng qua kho Foxiny</MenuItem>
            </Field>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}
export default RunningModel;
