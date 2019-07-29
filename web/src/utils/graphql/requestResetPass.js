import gql from 'graphql-tag';

export default gql`
  mutation requestResetPwd($mailOrPhone: String!) {
    requestResetPwd(mailOrPhone: $mailOrPhone) {
      token
      securityQuestions {
        id
        question
      }
    }
  }
`;
