/* eslint-disable react/jsx-filename-extension */
import React, { useRef, useState, useEffect } from 'react';
import './style/swipebutton.css';
import { Icon, Typography } from '@material-ui/core';
import { graphql } from 'react-apollo';
import { RESEND_RETAILER_CONFIMATION } from '../../utils/graphql/retailer';
import useInterval from '../../utils/hooks/useInterval';

const SwipeButton = props => {
  const { setFieldVisible, email, phone, resendConfirmation } = props;
  const [initialMouse, setInitialMouse] = useState(0);
  const [slideMovementTotal, setSlideMovementTotal] = useState(0);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [left, setLeft] = useState(-10);
  const [opacity, setOpacity] = useState(1);
  const [animationLeft, setAnimationLeft] = useState(false);
  const [seconds, setSecond] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const container = useRef(null);
  const sliderRef = useRef(null);
  const buttonBackground = useRef(null);
  const mouseDownAndTouchStart = event => {
    event.preventDefault();
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

    const currentMouse = event.clientX;
    const relativeMouse = currentMouse - initialMouse;

    if (relativeMouse < slideMovementTotal && !isRunning) {
      setOpacity(1);
      setAnimationLeft(true);
      setLeft(-10);
      setFieldVisible(false);
    }
  };
  useInterval(
    () => {
      setSecond(seconds - 1);
      if (seconds === 0) {
        setIsRunning(false);
        setSecond(60);
        setLeft(-10);
        setOpacity(1);
      }
    },
    isRunning ? 1000 : null,
  );
  const resendConfirmCode = async () => {
    console.log(email, phone);
    let flag;
    if (email && phone) {
      // Reuse resend mutation
      // If exists both email and phone, call function twice because resend mutation only accept one argument
      flag = await resendConfirmation({
        variables: {
          emailOrPhone: email,
        },
      });
      flag = false;
      flag = await resendConfirmation({
        variables: {
          emailOrPhone: phone,
        },
      });
    } else {
      flag = await resendConfirmation({
        variables: {
          emailOrPhone: email || phone,
        },
      });
    }
    setIsRunning(true);
  };
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
      if (!isRunning) {
        resendConfirmCode();
        setMouseIsDown(false);
        console.log('End');
      }
      setLeft(slideMovementTotal);
      setFieldVisible(true);
      return;
    }
    setLeft(relativeMouse - 10);
  };
  return (
    <div
      id="container"
      ref={container}
      onMouseMove={mouseMoveTouchmove}
      onMouseUp={mouseUpTouchEnd}
      className="wrapper"
    >
      <div role="presentation" ref={buttonBackground} id="button-background">
        <span style={{ opacity: opacity || 1 }} className="slide-text">
          Trượt sang phải để nhận mã xác thực email/phone
        </span>
        <div
          role="presentation"
          onMouseDown={mouseDownAndTouchStart}
          style={{ left }}
          ref={sliderRef}
          id="slider"
          className={animationLeft ? 'move-x' : `${!isRunning ? undefined : 'unlocked'}`}
        >
          <Icon color="secondary">{!isRunning ? 'lock_open' : 'lock_outline'}</Icon>
          {isRunning && <Typography color="secondary">{seconds}</Typography>}
        </div>
      </div>
    </div>
  );
};

export default graphql(RESEND_RETAILER_CONFIMATION, { name: 'resendConfirmation' })(SwipeButton);
