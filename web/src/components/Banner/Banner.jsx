// @flow
/* eslint-disable react/button-has-type */
import React from 'react';
import Glider from 'glider-js';
import 'glider-js/glider.min.css';
import { Box, Heading, Text, Button } from 'gestalt';
import { divStyle } from './StylesBanner';

class Banner extends React.Component {
  constructor(props) {
    super(props);
    this.myGlider = React.createRef();
  }

  componentDidMount() {
    // eslint-disable-next-line no-new
    new Glider(this.myGlider.current, {
      slidesToShow: 1,
      dots: '.dots',
      draggable: true,
      arrows: {
        prev: '.glider-prev',
        next: '.glider-next',
      },
      slidesToScroll: 'auto',
      duration: 0.8,
    });
  }

  componentWillUnmount() {
    Glider(this.myGlider.current).destroy();
  }

  render() {
    return (
      <div className="glider-contain">
        <div className="glider" ref={this.myGlider} style={{ height: '500px' }}>
          <div style={divStyle}>
            <Box height={500} display="flex" direction="column" justifyContent="center" alignItems="start">
              <Box display="flex" marginStart={12} paddingX={12} width="50%">
                <Heading color="white" bold size="md">
                  WELCOME TO &nbsp;
                </Heading>
                <Heading bold size="md" color="orange">
                  FOXINY
                </Heading>
              </Box>
              <Box marginStart={12} paddingX={12} margin={6}>
                <Text color="white" leading="tall">
                  We care your needs and focus on your experience.
                </Text>
                <Text color="white" leading="tall">
                  We are here to help you and make your projects better.
                </Text>
              </Box>
              <Box marginStart={12} paddingX={12} marginTop={1}>
                <Button color="transparent" text="Learn more" />
              </Box>
            </Box>
            <Box column={6} />
          </div>
          <div style={divStyle}>
            <Box height={500} alignItems="center" />
          </div>
          <div style={divStyle}>
            <Box height={500} alignItems="center" />
          </div>
          <div style={divStyle}>
            <Box height={500} alignItems="center" />
          </div>
        </div>
        <button aria-label="Previous" className="glider-prev" />
        <button aria-label="Next" className="glider-next" />
        <div className="dots" />
      </div>
    );
  }
}

export default Banner;
