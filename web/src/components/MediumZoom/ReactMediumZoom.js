import React from 'react';
import PropTypes from 'prop-types';
import mediumZoom from 'medium-zoom';

const ReactMediumZoom = props => {
  const { container, onOpen, onClosed, ...imgProps } = props;
  const imgRef = React.useRef(null);
  let zoom = null;
  React.useEffect(() => {
    zoom = mediumZoom(imgRef.current, {
      margin: 24,
      scrollOffset: 0,
      container,
    });
  }, []);
  return (
    <figure style={{ margin: 0, zIndex: 1000 }}>
      <img ref={imgRef} {...imgProps} />;
    </figure>
  );
};

ReactMediumZoom.propTypes = {
  container: PropTypes.string,
  onOpen: PropTypes.func,
  onClosed: PropTypes.func,
};

export default ReactMediumZoom;
