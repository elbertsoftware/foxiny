import React from 'react';
import Glider from 'glider-js';
import 'glider-js/glider.min.css';
import { Box, Image } from 'gestalt';

class Banner extends React.Component {
  constructor(props) {
    super(props);
    this.myGlider = React.createRef();
  }

  componentDidMount() {
    new Glider(this.myGlider.current, {
      slidesToShow: 1,
      dots: '.dots',
      draggable: true,
      arrows: {
        prev: '.glider-prev',
        next: '.glider-next',
      },
    });
  }

  componentWillUnmount() {
    Glider(this.myGlider.current).destroy();
  }

  render() {
    return (
      <div className="glider-contain">
        <div className="glider" ref={this.myGlider} style={{ height: '500px' }}>
          <div>
            <Box height={500} alignItems="center">
              <Image
                alt="banner image"
                src="/assets/images/banner-image-demo.jpg"
                naturalHeigth={1}
                naturalWidth={1}
                fit="cover"
              />
            </Box>
          </div>
          <div>
            <Box height={500} alignItems="center">
              <Image
                alt="banner image"
                src="/assets/images/banner-image-demo.jpg"
                naturalHeigth={1}
                naturalWidth={1}
                fit="cover"
              />
            </Box>
          </div>
          <div>
            <Box height={500} alignItems="center">
              <Image
                alt="banner image"
                src="/assets/images/banner-image-demo.jpg"
                naturalHeigth={1}
                naturalWidth={1}
                fit="cover"
              />
            </Box>
          </div>
          <div>
            <Box height={500} alignItems="center">
              <Image
                alt="banner image"
                src="/assets/images/banner-image-demo.jpg"
                naturalHeigth={1}
                naturalWidth={1}
                fit="cover"
              />
            </Box>
          </div>
        </div>

        <button aria-label="Previous" className="glider-prev">
          «
        </button>
        <button aria-label="Next" className="glider-next">
          »
        </button>
        <div className="dots" />
      </div>
    );
  }
}

export default Banner;
