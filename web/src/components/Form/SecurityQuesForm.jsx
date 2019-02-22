import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { MenuItem, FormControl, InputLabel, FormHelperText, Icon } from '@material-ui/core';
import { Field, Form } from 'react-final-form';
import createDecorator from 'final-form-focus';
import { toast } from 'react-toastify';
import RFTextField from '../../utils/common/form/RFTextField';
import Paper from '../../utils/common/Paper';
import SelectList from './Fields/SelectList';
import FormButton from '../../utils/common/form/FormButton';

const focusOnError = createDecorator();

const styles = theme => ({
  root: {
    margin: 'auto',
    maxWidth: '935px',
    marginTop: '50px',
    display: 'flex',
    alignItems: 'baseline',
  },
  rootPaper: {
    border: '1px solid #c6c6c9',
    marginTop: '2%',
  },
  button: {
    marginTop: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    paddingLeft: theme.spacing.unit * 3,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 400,
  },
});

const questions = [
  { questionId: 123, question: 'Người yêu của bạn tên gì?' },
  { questionId: 456, question: 'Con vật bạn yêu thích nhất?' },
  { questionId: 789, question: 'Nghề nghiệp của bố bạn?' },
];

const listQuestions = questions.map(({ questionId, question }) => (
  <MenuItem key={questionId} value={questionId}>
    {question}
  </MenuItem>
));

function getSteps() {
  return ['Câu hỏi 1', 'Câu hỏi 2', 'Câu hỏi 3'];
}

class SecurityQuesForm extends React.Component {
  state = {
    activeStep: 0,
    questionError: false,
    answerError: false,
    quesAnsPair: [],
  };

  equivalentQuestion = (questionId, questionList) => questionList.some(ele => questionId === ele.questionId);

  handleNext = values => () => {
    const { activeStep, quesAnsPair } = this.state;
    const questionId = values[`question${activeStep}`];
    const answer = values[`answer${activeStep}`];

    if (this.equivalentQuestion(questionId, quesAnsPair)) {
      toast.warn('Câu hỏi đã được chọn. Vui lòng chọn câu hỏi khác.');
      return;
    }
    if (!questionId) {
      this.setState({ questionError: true });
    } else if (!answer) {
      this.setState({ answerError: true });
    } else {
      const quesAnsArr = [...quesAnsPair, { questionId, answer }];
      this.setState(state => ({
        activeStep: state.activeStep + 1,
        questionError: false,
        answerError: false,
        quesAnsPair: quesAnsArr,
      }));
    }
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

  onSubmit = async values => {
    console.log(values);
    console.log(this.state.quesAnsPair);
  };

  render() {
    const { classes, history } = this.props;
    const steps = getSteps();
    const { activeStep, questionError, answerError } = this.state;

    return (
      <div>
        <div className={classes.root}>
          <Button onClick={() => history.goBack()}>
            <Icon>arrow_back</Icon>
          </Button>
          <Typography variant="h3">Câu hỏi bảo mật</Typography>
        </div>
        <Paper className={classes.rootPaper} background="light">
          <Form onSubmit={this.onSubmit} subscription={{ submitting: true, values: true }} decorators={[focusOnError]}>
            {({ handleSubmit, values, submitting }) => (
              <form onSubmit={handleSubmit} noValidate>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel>
                        {values[`question${index}`] === undefined
                          ? label
                          : `Câu hỏi: ${questions.find(ele => ele.questionId === values[`question${index}`]).question}`}
                      </StepLabel>
                      <StepContent>
                        <FormControl className={classes.formControl}>
                          <InputLabel htmlFor="age-auto-width">Chọn câu hỏi bảo mật</InputLabel>
                          <Field component={SelectList} name={`question${index}`} type="text" fullWidth>
                            {listQuestions}
                          </Field>
                          {questionError && <FormHelperText error>Vui lòng chọn câu hỏi</FormHelperText>}
                          <Field
                            component={RFTextField}
                            margin="normal"
                            label="Câu trả lời của bạn"
                            name={`answer${index}`}
                            type="text"
                            fullWidth
                          />
                          {answerError && <FormHelperText error>Vui lòng nhập câu trả lời</FormHelperText>}
                        </FormControl>

                        <div className={classes.actionsContainer}>
                          <div>
                            <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                              Back
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="secondary"
                              onClick={this.handleNext(values)}
                              className={classes.button}
                            >
                              {activeStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp'}
                            </Button>
                          </div>
                        </div>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
                {activeStep === steps.length && (
                  <Paper square elevation={0} className={classes.resetContainer} background="light">
                    <Typography>
                      Từ nay bạn có thể sử dụng câu hỏi bảo mật để khôi phục lại tài khoản của mình.
                    </Typography>
                    <div>
                      <Button color="secondary" onClick={this.handleReset} className={classes.button} variant="text">
                        Làm lại
                      </Button>
                      <FormButton color="secondary" disabled={submitting} className={classes.button}>
                        Lưu
                      </FormButton>
                    </div>
                  </Paper>
                )}
              </form>
            )}
          </Form>
        </Paper>
      </div>
    );
  }
}

SecurityQuesForm.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(SecurityQuesForm);
