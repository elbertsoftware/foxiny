import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Icon from '@material-ui/core/Icon';

import { Root, Header, Nav, Content, presets } from './Layout';
import NavContentEx from './components/NavContentEx';
import NavHeaderEx from './components/NavHeaderEx';
import HeaderEx from './components/HeaderEx';

// add presets.create{}() to config props in Root to change the behavior, looking and layout
// <Root config={presets.createCozyLayout()}> ...
const LayoutSellerCenter = ({ children }) => {
  return (
    <Root config={presets.createDefaultLayout()} style={{ minHeight: '100vh' }}>
      <CssBaseline />
      <Header
        menuIcon={{
          inactive: <Icon>menu_rounded</Icon>,
          active: <Icon>chevron_left</Icon>,
        }}
      >
        {({ screen, collapsed }) => <HeaderEx screen={screen} collapsed={collapsed} />}
      </Header>
      <Nav
        collapsedIcon={{
          inactive: <Icon>chevron_left</Icon>,
          active: <Icon>chevron_right</Icon>,
        }}
        header={({ collapsed }) => <NavHeaderEx collapsed={collapsed} />}
      >
        <NavContentEx />
      </Nav>
      <Content>{children}</Content>
    </Root>
  );
};

export default LayoutSellerCenter;
