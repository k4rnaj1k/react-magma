import * as React from 'react';
import { ButtonCore } from 'react-magma-core';
const styled = require('styled-components').default;
import { magma } from '../../theme/magma';

enum ButtonType {
  solid, //default
  outline,
  link
}

enum ButtonColor {
  primary, //default
  secondary,
  success,
  danger
}

enum ButtonShape {
  fill, //default
  leftCap,
  rightCap,
  round
}

enum ButtonSize {
  large,
  medium, //default
  small
}

export interface ButtonProps {
  allCaps?: boolean;
  autoFocus?: boolean;
  children?: React.ReactChild | React.ReactChild[];
  text?: string;
  handleClick: () => void;
  color?: ButtonColor;
  disabled?: boolean;
  inverse?: boolean;
  shape?: ButtonShape;
  size?: ButtonSize;
  type?: ButtonType;
}

export const StyledButton = styled.button`
  border-radius: ${props => {
    switch (props.shape) {
      case 'leftCap':
        return '5px 0 0 5px';
      case 'rightCap':
        return '0 5px 5px 0';
      default:
        return '5px';
    }
  }};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  display: inline-block;
  font-family: ${magma.bodyFont};
  line-height: 1.46666667;
  margin: 5px;
  min-width: 5.625em;
  overflow: hidden;
  position: relative;
  text-align: center;
  text-transform: ${props => (!props.allCaps ? 'none' : 'uppercase')};
  vertical-align: middle;
  touch-action: manipulation;
  white-space: nowrap;

  &:not(:disabled) {
    &:after,
    &:before {
      background: ${magma.colors.neutral08};
      content: '';
      opacity: 0;
      position: absolute;
    }

    &:after {
      border-radius: 50%;
      height: 32px;
      left: 50%;
      padding: 50%;
      top: 18px;
      transform: translate(-50%, -50%) scale(1);
      transition: opacity 1s, transform 0.5s;
      width: 32px;
    }

    &:before {
      background: ${props => {
        // Button color, type, inverse
        if (
          (props.type !== 'solid' && !props.inverse) ||
          (props.type === 'solid' && props.inverse)
        ) {
          switch (props.color) {
            case 'secondary':
              return magma.colors.neutral02;
            case 'success':
              return magma.colors.success01;
            case 'danger':
              return magma.colors.danger;
            default:
              return magma.colors.primary;
          }
        }
        if (
          props.type === 'solid' &&
          !props.inverse &&
          props.color === 'secondary'
        ) {
          return magma.colors.neutral02;
        }
        return magma.colors.neutral08;
      }};

      height: 200%;
      left: 0;
      top: -50%;
      transition: 0.2s;
      width: 200%;
    }

    &:active {
      &:after {
        opacity: 0.4;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0s;
      }
    }

    &:hover,
    &:focus {
      &:before {
        opacity: 0.1;
      }
    }
  }

  &:focus {
    outline: 2px dotted ${magma.colors.pop03};
    outline-offset: 3px;
  }

  font-size: ${props => {
    // Button size
    switch (props.size) {
      case 'large':
        return '1.125rem';
      case 'small':
        return '.750rem';
      default:
        return '.875rem';
    }
  }};
  font-weight: ${props => (props.size === 'large' ? 500 : 600)};
  height: ${props => {
    // Button size
    switch (props.size) {
      case 'large':
        return '45px';
      case 'small':
        return '29px';
      default:
        return '37px';
    }
  }};
  padding: ${props => {
    // Button size
    switch (props.size) {
      case 'large':
        return '0 20px';
      case 'small':
        return '0 10px';
      default:
        return '0 15px';
    }
  }};

  background: ${props => {
    // Button color, type, inverse
    if (props.type !== 'solid') {
      return 'none';
    }
    if (props.disabled) {
      return magma.colors.neutral06;
    }
    if (props.inverse) {
      return magma.colors.neutral08;
    }
    switch (props.color) {
      case 'secondary':
        return magma.colors.neutral08;
      case 'success':
        return magma.colors.success01;
      case 'danger':
        return magma.colors.danger;
      default:
        return magma.colors.primary;
    }
  }};
  border: ${props =>
    props.type === 'outline' ||
    (props.type === 'solid' && props.color === 'secondary' && !props.inverse)
      ? '2px solid'
      : '0'};
  border-color: ${props => {
    // Button color, type, inverse
    if (props.disabled) {
      return magma.colors.neutral06;
    }
    if (props.inverse) {
      return magma.colors.neutral08;
    }
    if (props.color === 'secondary') {
      return magma.colors.neutral05;
    }
    if (props.type === 'solid') {
      switch (props.color) {
        case 'success':
          return magma.colors.success01;
        case 'danger':
          return magma.colors.danger;
        default:
          return magma.colors.primary;
      }
    }
  }};
  color: ${props => {
    // Button color, type, inverse
    if (props.disabled) {
      return magma.colors.neutral04;
    }
    if (
      (!props.inverse && props.type === 'solid') ||
      (props.inverse && props.type !== 'solid')
    ) {
      if (props.color === 'secondary' && !props.inverse) {
        return magma.colors.neutral02;
      }
      return magma.colors.neutral08;
    }
    switch (props.color) {
      case 'secondary':
        return magma.colors.neutral02;
      case 'success':
        return magma.colors.success01;
      case 'danger':
        return magma.colors.danger;
      default:
        return magma.colors.primary;
    }
  }};
`;

export const Button: React.FunctionComponent<ButtonProps> = (
  props: ButtonProps
): JSX.Element => (
  <ButtonCore handleClick={props.handleClick}>
    {({ handleClick }) => {
      const {
        autoFocus,
        children,
        disabled,
        inverse,
        allCaps,
        color,
        shape,
        size,
        type
      } = props;

      return (
        <StyledButton
          allCaps={allCaps}
          autoFocus={autoFocus}
          onClick={handleClick}
          color={color ? color : 'primary'}
          disabled={disabled}
          inverse={inverse}
          shape={shape ? shape : 'fill'}
          size={size ? size : 'medium'}
          type={type ? type : 'solid'}
        >
          {children}
        </StyledButton>
      );
    }}
  </ButtonCore>
);

export default Button;
