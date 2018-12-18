import React, { Component } from 'react';
import { Box, IconButton, Text, Image } from 'gestalt';
import 'gestalt/dist/gestalt.css';
import styled from 'styled-components';

// All styles for this component are here
const Link = styled.a`
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 400;
  color: #707070;
  :hover {
    color: #ff5733;
  }
`;
const Nav = styled.div`
  background: #f0f0f0;
`;

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
        >
          <Box display="flex" alignItems="center">
            <Box width={70} height={70}>
              <Image alt="Foxiny logo" src="/assets/foxiny_logo.png" naturalHeight={1} naturalWidth={1} />
            </Box>
            | <Text size="lg">Foxiny</Text>
          </Box>
          <Box direction="row" display="flex">
            <Box padding={2}>
              <Link href="#">Trang chu</Link>
            </Box>
            <Box padding={2}>
              <Link href="#">San pham</Link>
            </Box>
            <Box padding={2}>
              <Link href="#">Thong tin</Link>
            </Box>
          </Box>
        </Box>
      </Nav>
    );
  }
}

export default NavBar;
