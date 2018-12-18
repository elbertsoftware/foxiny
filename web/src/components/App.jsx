// @flow
import React, { Component } from 'react';
import NavBar from './nav/NavBar/NavBar';
import Banner from './Banner/Banner';

import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Banner />
      </div>
    );
  }
}

export default App;
