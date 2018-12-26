// @flow
import styled from 'styled-components';

export const StyledLink = styled.a`
  display: block;
  color: #333;
  text-decoration: none;
  position: relative;
  ::after {
    content: '';
    background: #ff5733;
    mix-blend-mode: screen;
    width: calc(100% + 20px);
    height: 0;
    position: absolute;
    bottom: -4px;
    left: -10px;
    transition: all 0.3s cubic-bezier(0.445, 0.05, 0.55, 0.95);
  }
  :hover::after {
    height: calc(100% + 8px);
  }
`;
export const StyledDivider = styled.div`
  overflow: hidden;
  @keyframes rdg-expertise-bar-animation-keyframe {
      0% {
        height: 0;
        width: 0;
      }
      100% {
        width: 2px;
        height: 40px;
      }
    }
    animation: 2s forwards 0s rdg-expertise-bar-animation-keyframe;
    background-color: #707070;
  }
`;
export const Nav = styled.div`
  background: #ffffff;
`;
