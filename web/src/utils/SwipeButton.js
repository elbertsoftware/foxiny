/* eslint-disable react/jsx-filename-extension */
import React, { useRef, useState } from 'react';
import './style/swipebutton.css';
import { Icon } from '@material-ui/core';

export default function SwipeButton(props) {
  const { setFieldVisible, email, phone } = props;
  const [initialMouse, setInitialMouse] = useState(0);
  const [slideMovementTotal, setSlideMovementTotal] = useState(0);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [left, setLeft] = useState(-10);
  const [opacity, setOpacity] = useState(1);
  const [unlockedVisible, setUnlockedVisible] = useState(true);
  const [animationLeft, setAnimationLeft] = useState(false);
  const [seconds, setSecond] = useState(60);
  const sliderRef = useRef(null);
  const buttonBackground = useRef(null);
  const mouseDownAndTouchStart = event => {
    setMouseIsDown(true);
    setAnimationLeft(false);
    setSlideMovementTotal(
      buttonBackground.current.getBoundingClientRect().width - sliderRef.current.getBoundingClientRect().width + 10,
    );
    setInitialMouse(event.clientX);
  };
  const mouseUpTouchEnd = event => {
    if (!mouseIsDown) return;
    setMouseIsDown(false);
    setFieldVisible(false);
    const currentMouse = event.clientX;
    const relativeMouse = currentMouse - initialMouse;

    if (relativeMouse < slideMovementTotal) {
      setOpacity(1);
      setAnimationLeft(true);
      setLeft(-10);
    }
  };
  const startCountDown = () => {};
  const mouseMoveTouchmove = event => {
    if (!mouseIsDown) return;
    const currentMouse = event.clientX;
    const relativeMouse = currentMouse - initialMouse;
    const slidePercent = 1 - relativeMouse / slideMovementTotal;
    setOpacity(slidePercent);
    if (relativeMouse <= 0) {
      setLeft(-10);
      return;
    }
    if (relativeMouse >= slideMovementTotal + 10) {
      if (unlockedVisible) {
        console.log('End');
      }

      setLeft(slideMovementTotal);
      setFieldVisible(true);
      setUnlockedVisible(false);
      return;
    }
    setLeft(relativeMouse - 10);
  };
  const unlockClick = () => {
    setLeft(-10);
    setOpacity(1);
    setUnlockedVisible(true);
  };
  return (
    <div onMouseMove={mouseMoveTouchmove} onMouseUp={mouseUpTouchEnd} className="wrapper">
      <div role="presentation" ref={buttonBackground} id="button-background">
        <span style={{ opacity: opacity || 1 }} className="slide-text">
          Trượt sang phải để nhận mã xác thực email/phone
        </span>
        <div
          role="presentation"
          onClick={unlockClick}
          onMouseDown={mouseDownAndTouchStart}
          style={{ left }}
          ref={sliderRef}
          id="slider"
          className={animationLeft ? 'move-x' : `${unlockedVisible ? undefined : 'unlocked'}`}
        >
          <Icon color="secondary">{unlockedVisible ? 'lock_open' : 'lock_outline'}</Icon>
        </div>
      </div>
    </div>
  );
}
