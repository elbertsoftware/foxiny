import React, { Component } from 'react';
import 'glider-js/glider.min.css';
import Glider from 'glider-js';
import { Icon } from '@material-ui/core';

const darkerImage = {
  filter: 'brightness(60%)',
  margin: '0 7.5px',
  overflow: 'hidden',
  borderRadius: 15,
};

const fitImage = { width: '100%', height: '260px', objectFit: 'cover' };

class Slider extends Component {
  componentDidMount() {
    const glider = new Glider(document.querySelector('.glider'), {
      slidesToShow: 4,
      duration: 3,
      draggable: true,
      arrows: {
        prev: '.glider-prev',
        next: '.glider-next',
      },
      rewind: true,
    });
    /* TODO:
    ** Clear Interval whenever user click next/prev button on Glider and set
    back the interval when they no longer interact with Glider.
    */
    this.timer = setInterval(() => {
      glider.scrollItem('next');
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="glider-contain" style={{ opacity: 0.6, margin: '20px 0' }}>
        <div className="glider" style={{ height: '260px' }}>
          <div style={darkerImage}>
            <img style={fitImage} src="https://picsum.photos/981/1024/?image=10" />
          </div>
          <div style={darkerImage}>
            <img style={fitImage} src="https://picsum.photos/981/1024/?image=11" />
          </div>
          <div style={darkerImage}>
            <img style={fitImage} src="https://picsum.photos/981/1024/?image=12" />
          </div>
          <div style={darkerImage}>
            <img style={fitImage} src="https://picsum.photos/981/1024/?image=13" />
          </div>
          <div style={darkerImage}>
            <img style={fitImage} src="https://picsum.photos/981/1024/?image=14" />
          </div>
          <div style={darkerImage}>
            <img style={fitImage} src="https://picsum.photos/981/1024/?image=15" />
          </div>
          <div style={darkerImage}>
            <img style={fitImage} src="https://picsum.photos/981/1024/?image=16" />
          </div>
          <div style={darkerImage}>
            <img style={fitImage} src="https://picsum.photos/981/1024/?image=17" />
          </div>
        </div>

        <button role="button" aria-label="Previous" className="glider-prev">
          <Icon>arrow_back_ios</Icon>
        </button>
        <button role="button" aria-label="Next" className="glider-next">
          <Icon>arrow_forward_ios</Icon>
        </button>
      </div>
    );
  }
}

export default Slider;
