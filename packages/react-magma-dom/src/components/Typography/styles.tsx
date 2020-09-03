import { css } from '@emotion/core';

import { TypographyColor, TypographyVariant } from '../Typography';

export function getBodyFontFamily(props) {
  switch (props.variant) {
    case TypographyVariant.expressive:
      return props.theme.bodyExpressiveFont;
    case TypographyVariant.narrative:
      return props.theme.bodyNarrativeFont;
    default:
      return props.theme.bodyFont;
  }
}

export const colorStyles = props => css`
color: ${
  props.isInverse
    ? props.theme.colors.neutral08
    : props.variant === 'expressive'
    ? props.theme.colors.foundation02
    : props.theme.colors.neutral01
};

${props.color === TypographyColor.danger &&
  !props.isInverse &&
  css`
    color: ${props.theme.colors.danger};
  `}

${props.color === TypographyColor.success &&
  !props.isInverse &&
  css`
    color: ${props.theme.colors.success01};
  `}

${props.color === TypographyColor.subdued &&
  !props.isInverse &&
  css`
    color: ${props.theme.colors.neutral03};
  `}

${props.color === TypographyColor.subdued &&
  props.isInverse &&
  css`
    color: ${props.theme.colors.focusInverse};
  `}`;
