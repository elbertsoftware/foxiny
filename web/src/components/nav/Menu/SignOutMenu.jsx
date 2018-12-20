/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable arrow-parens */
/* eslint-disable react/prop-types */
// @flow
import React from 'react';
import { Box, Text, Button, Flyout, Divider } from 'gestalt';
import { StyledLink } from '../NavBar/StylesNavBar';
import RegisterModal from '../../modals/RegisterModal';

class SignOutMenu extends React.Component {
  state = {
    isOpen: false,
  };

  hoverOn = () => {
    this.setState({
      isOpen: true,
    });
  };

  hoverOff = () => {
    this.setState({
      isOpen: false,
    });
  };

  handleDissmiss = () => {
    this.setState({
      isOpen: false,
    });
  };

  render() {
    const { openModal, handleToggleModal } = this.props;
    return (
      <Box>
        <div
          style={{ display: 'inline-block' }}
          ref={c => {
            this.anchor = c;
          }}
        >
          <StyledLink onMouseEnter={this.hoverOn}>
            <span>Tài khoản</span>
          </StyledLink>
        </div>
        {this.state.isOpen && (
          // eslint-disable-next-line react/no-this-in-sfc
          <div style={{ zIndex: '1' }} onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff}>
            <Flyout anchor={this.anchor} idealDirection="down" onDismiss={this.handleDissmiss} size={500}>
              <Box
                padding={3}
                width={500}
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
              >
                <Box paddingX={2} width={250}>
                  <Button color="gray" text="Login" />
                </Box>
                <Box margin={3}>
                  <Text bold align="center">
                    New customer?{' '}
                    <Text inline>
                      <a onClick={handleToggleModal} href="#">
                        Start here
                      </a>
                    </Text>
                  </Text>
                </Box>
                <Divider />
                <Box display="flex" alignItems="start" column={12} marginTop={3} marginStart={3}>
                  <Box column={6}>
                    <Text bold>Your orders</Text>
                    <Box paddingY={3}>
                      <Text>Create a list</Text>
                    </Box>
                  </Box>
                  <Divider />
                  <Box column={6}>
                    <Text bold>Your account</Text>
                    <Box paddingY={3}>
                      <Text>Your profile</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Flyout>
          </div>
        )}
        {openModal && <RegisterModal handleToggleModal={this.handleToggleModal} />}
      </Box>
    );
  }
}
export default SignOutMenu;
