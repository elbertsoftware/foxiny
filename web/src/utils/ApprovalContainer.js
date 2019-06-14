/* eslint-disable react/jsx-filename-extension */
import React, { useState, useContext } from 'react';
import { Paper, IconButton, Icon, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { green, red } from '@material-ui/core/colors';
import { Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import SetValueFunction from './context/SetValueFunc';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: '24px 16px 8px',
    margin: 8,
  },
  absoluteContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 200,
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  textField: {
    transform: 'translate(8px,-8px)',
    marginRight: 8,
  },
  message: {
    display: 'flex',
    borderRadius: 20,
    padding: '4px 16px',
    backgroundColor: red[300],
    justifyContent: 'space-between',
  },
  textMessage: {
    color: theme.palette.background.light,
  },
  button: {
    padding: 4,
  },
  edit: {
    padding: 2,
  },
  sucess: {
    backgroundColor: green[50],
  },
  fail: {
    backgroundColor: red[50],
  },
  showingLabel: {
    display: 'flex',
    borderRadius: 20,
    padding: '0px 4px',
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 200,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accepted: {
    backgroundColor: green[500],
  },
  rejected: {
    backgroundColor: red[500],
  },
}));

const ApprovalContainer = ({ review, name, children, ...props }) => {
  const classes = useStyles();
  const { setValue } = useContext(SetValueFunction);
  const [fieldValue, setFieldValue] = useState(undefined);
  const [elevation, setElevation] = useState(0);
  const [isSaved, setIsSave] = useState(false);
  // const [isRejected, setIsRejected] = useState(false);
  const [isAccepted, setIsAccepted] = useState(undefined);
  const saveContent = () => {
    setIsSave(true);
  };
  const rootContainer = classNames({
    [classes.root]: true,
    [classes.sucess]: isAccepted,
    [classes.fail]: !isAccepted && isAccepted !== undefined,
  });
  const showingLabel = classNames({
    [classes.showingLabel]: true,
    [classes.accepted]: isAccepted,
  });
  React.useEffect(() => {
    if (isAccepted) {
      setValue(`reviewValues.${name}`, null);
    }
  }, [isAccepted]);
  if (!review) return children;
  return (
    <Paper
      className={rootContainer}
      onMouseEnter={() => setElevation(8)}
      onMouseLeave={() => setElevation(0)}
      elevation={elevation}
    >
      {elevation === 8 ? (
        <div className={`${classes.absoluteContainer} ${classes.flex}`}>
          <IconButton onClick={() => setIsAccepted(true)} className={classes.button}>
            <Icon>check_circle</Icon>
          </IconButton>
          <IconButton onClick={() => setIsAccepted(false)} className={classes.button}>
            <Icon>report</Icon>
          </IconButton>
        </div>
      ) : (
        <React.Fragment>
          {isAccepted && (
            <div className={showingLabel}>
              <Icon className={classes.textMessage}>done</Icon>
              <Typography className={classes.textMessage}>OK</Typography>
            </div>
          )}
        </React.Fragment>
      )}
      {children}
      {isAccepted === false && (
        <React.Fragment>
          {!isSaved ? (
            <div className={classes.flex}>
              <Field
                component={TextField}
                className={classes.textField}
                name={`reviewValues.${name}`}
                placeholder="Ghi chú"
                autoFocus
                type="text"
              >
                {fieldState => {
                  setFieldValue(fieldState.input.value);
                  return (
                    <Field
                      component={TextField}
                      className={classes.textField}
                      name={`reviewValues.${name}`}
                      placeholder="Ghi chú"
                      type="text"
                    />
                  );
                }}
              </Field>
              <IconButton className={classes.button} onClick={saveContent} variant="contained">
                <Icon>save</Icon>
              </IconButton>
            </div>
          ) : (
            <div className={classes.message}>
              <Typography className={classes.textMessage} color="initial" variant="subtitle2">
                {fieldValue}
              </Typography>
              <IconButton onClick={() => setIsSave(false)} className={classes.edit}>
                <Icon>edit</Icon>
              </IconButton>
            </div>
          )}
        </React.Fragment>
      )}
    </Paper>
  );
};

export default ApprovalContainer;
