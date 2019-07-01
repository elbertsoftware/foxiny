import React from 'react';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const SelectInput = ({
  input: { name, value, onChange, ...restInput },
  meta,
  label,
  formControlProps,
  showError,
  ...rest
}) => {
  return (
    <FormControl
      {...formControlProps}
      error={showError}
      style={{
        height: 30,
        minWidth: '100%',
      }}
      margin="normal"
      variant="outlined"
    >
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        {...rest}
        name={name}
        onChange={onChange}
        inputProps={restInput}
        value={value}
        input={<OutlinedInput labelWidth={0} name="whatever" id={name} />}
      />
      {meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};

export default SelectInput;
