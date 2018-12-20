/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
// @flow
import React, { Component } from 'react';
import { Box, Image, Heading, Divider } from 'gestalt';
import { Nav, StyledDivider, StyledLink } from './StylesNavBar';
// eslint-disable-next-line import/no-named-as-default
import SignOutMenu from '../Menu/SignOutMenu';

// eslint-disable-next-line react/prefer-stateless-function
class NavBar extends Component {
  state = {
    openModal: false,
  };

  handleToggle = () => {
    this.setState(prevState => ({
      openModal: !prevState.openModal,
    }));
  };

  render() {
    return (
      <Nav>
        <Box
          className="nav"
          paddingX={6}
          lgPaddingX={12}
          direction="row"
          display="flex"
          alignItems="center"
          justifyContent="around"
          height={90}
        >
          <Box display="flex" alignItems="center" marginLeft={12}>
            <Box width={70} height={70}>
              <Image alt="Foxiny logo" src="/assets/foxiny_logo.png" naturalHeight={1} naturalWidth={1} />
            </Box>
            <Box>
              <StyledDivider />
            </Box>
            <Box marginLeft={1}>
              <Heading size="xs">Foxiny</Heading>
            </Box>
          </Box>
          <Box flex="grow" />
          <Box direction="row" display="flex" alignItems="center">
            <Box padding={2}>
              <StyledLink href="#">Trang chủ</StyledLink>
            </Box>
            <Box padding={2}>
              <StyledLink href="#">
                <span>Sản Phẩm</span>
              </StyledLink>
            </Box>
            <Box padding={2}>
              <StyledLink href="#">
                <span>Thông tin</span>
              </StyledLink>
            </Box>
            <Box padding={2} display="flex">
              <Divider />
              <Box marginLeft={2}>
                <SignOutMenu openModal={this.state.openModal} handleToggleModal={this.handleToggle} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Nav>
    );
  }
}

export default NavBar;
