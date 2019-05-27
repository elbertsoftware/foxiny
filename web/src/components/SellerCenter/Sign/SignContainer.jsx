import { compose, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import SignView from './SignView';

const LOGIN_SELLER = gql`
  mutation login($data: LoginUserInput!) {
    login(data: $data) {
      userId
      token
    }
  }
`;

export default compose(
  graphql(LOGIN_SELLER, { name: 'loginSeller' }),
  withRouter,
  withState('activeTabId', 'setActiveTabId', 0),
  withHandlers({}),
)(SignView);
