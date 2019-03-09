import React, { Component } from 'react';
import 'glider-js/glider.min.css';
import Glider from 'glider-js';
import { Icon } from '@material-ui/core';

const darkerImage = {
  filter: 'brightness(60%)',
};

const fitImage = { width: '100%', height: '500px', objectFit: 'cover' };

class Slider extends Component {
  componentDidMount() {
    const glider = new Glider(document.querySelector('.glider'), {
      slidesToShow: 1,
      dots: '.dots',
      draggable: true,
      arrows: {
        prev: '.glider-prev',
        next: '.glider-next',
      },
    });
  }

  render() {
    return (
      <div className="glider-contain">
        <div className="glider" style={{ maxHeight: '500px' }}>
          <div style={darkerImage}>
            <img style={fitImage} src="/assets/images/banner-image-demo.jpg" />
          </div>
          <div style={darkerImage}>
            <img style={fitImage} src="/assets/images/banner-image-demo.jpg" />
          </div>
          <div style={darkerImage}>
            <img style={fitImage} src="/assets/images/banner-image-demo.jpg" />
          </div>
          <div style={darkerImage}>
            <img style={fitImage} src="/assets/images/banner-image-demo.jpg" />
          </div>
        </div>

        <button role="button" aria-label="Previous" className="glider-prev">
          <Icon>arrow_back_ios</Icon>
        </button>
        <button role="button" aria-label="Next" className="glider-next">
          <Icon>arrow_forward_ios</Icon>
        </button>
        <div role="tablist" className="dots" />
      </div>
    );
  }
}

export default Slider;
