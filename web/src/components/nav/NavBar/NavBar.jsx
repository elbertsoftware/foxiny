// @flow
import React, { Component } from 'react';
import { Box, Image, Heading } from 'gestalt';
import 'gestalt/dist/gestalt.css';
import { Nav, StyledDivider, StyledLink } from './StylesNavBar';

// eslint-disable-next-line react/prefer-stateless-function
class NavBar extends Component {
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
          <Box display="flex" alignItems="center">
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
          <Box direction="row" display="flex">
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
          </Box>
        </Box>
      </Nav>
    );
  }
}

export default NavBar;
