/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { MenuItem, FormControl, InputLabel, FormHelperText } from '@material-ui/core';
import { Field, Form } from 'react-final-form';
import createDecorator from 'final-form-focus';
import { toast } from 'react-toastify';
import { graphql, compose } from 'react-apollo';
import RFTextField from '../../utils/common/form/RFTextField';
import Paper from '../../utils/common/Paper';
import SelectList from './Fields/SelectList';
import FormButton from '../../utils/common/form/FormButton';
import getSecurityQuestions from '../../graphql/getSecurityQuestions';
import createSecurityQuestion from '../../graphql/createUpdateSecurityQues';
import Loading from '../App/Loading';
import { required } from '../../utils/common/form/validation';

const focusOnError = createDecorator();

const styles = theme => ({
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

  equivalentQuestion = (questionId, questionList, index) => {
    return questionList.some((ele, i) => index !== i && ele.questionId === questionId);
  };

  handleNext = values => () => {
    const { activeStep, quesAnsPair } = this.state;
    const questionId = values[`question${activeStep}`];
    const answer = values[`answer${activeStep}`];

    if (this.equivalentQuestion(questionId, quesAnsPair, activeStep)) {
      toast.warn('Câu hỏi đã được chọn. Vui lòng chọn câu hỏi khác.');
      return;
    }
    if (!questionId) {
      this.setState({ questionError: true });
    } else if (!answer) {
      this.setState({ answerError: true });
    } else {
      const quesAnsArr = [...quesAnsPair];
      quesAnsArr[activeStep] = { questionId, answer };
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

  onSubmit = async () => {
    try {
      const {
        data: {
          upsertSecurityInfo: { id, recoverable },
        },
      } = await this.props.createSecurityQuestion({
        variables: {
          securityInfo: this.state.quesAnsPair,
        },
      });
      if (recoverable) {
        toast.success('Câu trả lời của bạn đã được cập nhật thành công.');
        this.props.history.goBack();
      } else {
        toast.error('Có lỗi xảy ra.');
      }
    } catch (error) {
      toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra !');
    }
  };

  render() {
    const { classes, loading, securityQuestions } = this.props;
    const steps = getSteps();
    const { activeStep, questionError, answerError } = this.state;

    if (loading) return <Loading />;
    const listQuestions = securityQuestions.map(({ id, question }) => (
      <MenuItem key={id} value={id}>
        {question}
      </MenuItem>
    ));
    return (
      <Paper className={classes.rootPaper} background="light">
        <Form
          onSubmit={this.onSubmit}
          subscription={{ submitting: true, values: true }}
          decorators={[focusOnError]}
          validate={values =>
            required(['question0', 'question1', 'question2', 'answer0', 'answer1', 'answer2'], values)
          }
        >
          {({ handleSubmit, values, submitting }) => (
            <form onSubmit={handleSubmit} noValidate>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>
                      {values[`question${index}`] === undefined
                        ? label
                        : `Câu hỏi: ${securityQuestions.find(ele => ele.id === values[`question${index}`]).question}`}
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
    );
  }
}

SecurityQuesForm.propTypes = {
  classes: PropTypes.object,
};

export default compose(
  graphql(getSecurityQuestions, {
    props: ({ data: { loading, securityQuestions } }) => ({
      loading,
      securityQuestions,
    }),
  }),
  graphql(createSecurityQuestion, { name: 'createSecurityQuestion' }),
  withStyles(styles),
)(SecurityQuesForm);
