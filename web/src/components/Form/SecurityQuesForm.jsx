import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { Field } from 'react-final-form';
import RFTextField from '../../utils/common/form/RFTextField';
import Paper from '../../utils/common/Paper';

const styles = theme => ({
  root: {},
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 400,
  },
});

function getSteps() {
  return ['Câu hỏi 1', 'Câu hỏi 2', 'Câu hỏi 3'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`;
    case 1:
      return 'An ad group contains one or more ads which target a shared set of keywords.';
    case 2:
      return `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`;
    default:
      return 'Unknown step';
  }
}

class SecurityQuesForm extends React.Component {
  state = {
    activeStep: 0,
    question: '',
  };

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <Paper className={classes.root} padding background="light">
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{`${label}: ${this.state.question}`}</StepLabel>
              <StepContent>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="age-auto-width">Chọn câu hỏi bảo mật</InputLabel>
                  <Select
                    value={this.state.question}
                    onChange={this.handleChange}
                    inputProps={{
                      name: 'question',
                    }}
                  >
                    <MenuItem value={10}>Bạn yêu thích loài động vật nào ?</MenuItem>
                    <MenuItem value={20}>Bạn yêu thích loài động vật nào ?</MenuItem>
                    <MenuItem value={30}>Bạn yêu thích loài động vật nào ?</MenuItem>
                  </Select>
                  <Field
                    component={RFTextField}
                    margin="normal"
                    label="Câu trả lời của bạn"
                    name="answer"
                    type="text"
                    fullWidth
                  />
                </FormControl>

                <div className={classes.actionsContainer}>
                  <div>
                    <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                      Back
                    </Button>
                    <Button variant="contained" color="primary" onClick={this.handleNext} className={classes.button}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer} background="light">
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </Paper>
    );
  }
}

SecurityQuesForm.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(SecurityQuesForm);
