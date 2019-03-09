import React, { Component } from 'react';
import NavBar from './NavBar/NavBar';
import Slider from './NavBar/Slider';

class Homepage extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Slider />
      </React.Fragment>
    );
  }
}
export default Homepage;
