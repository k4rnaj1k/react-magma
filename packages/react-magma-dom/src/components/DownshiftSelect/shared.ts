import styled from '../../theme/styled';

import { baseInputStyles } from '../BaseInput';
import { Card } from '../Card';

export const SelectContainer = styled.div`
  position: relative;
`;

export const StyledButton = styled.div`
  ${baseInputStyles}

  align-items: center;
  display: flex;
  text-align: left;
`;

export const SelectText = styled.span`
  flex-grow: 1;
  padding-right: 8px;
`;

export const StyledCard = styled(Card)<{ isOpen?: boolean }>`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  left: 4px;
  margin-top: 4px;
  padding: 4px 0 0;
  position: absolute;
  right: 4px;
  z-index: 2;
`;

export const StyledList = styled('ul')<{ isOpen?: boolean }>`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  list-style: none;
  margin: 0 0 4px;
  outline: none;
`;

export const StyledItem = styled('li')<{ isFocused?: boolean }>`
  background: ${props =>
    props.isFocused ? props.theme.colors.neutral06 : 'transparent'};
  border: 2px dotted;
  border-color: ${props =>
    props.isFocused ? props.theme.colors.focus : 'transparent'};
  line-height: 24px;
  margin: 0;
  padding: 8px 16px;
`;

export const SelectedItemsWrapper = styled.span`
  display: flex;
  flex-wrap: wrap;
  padding: 0 4px 0 8px;
`;

export const SelectedItemButton = styled.button`
  background: ${props => props.theme.colors.neutral06};
  border-radius: 4px;
  border: 0;
  box-shadow: 0 0 0;
  font-size: 12px;
  line-height: 16px;
  margin: 2px 4px 2px 0;
  padding: 4px 8px;
  white-space: nowrap;
`;

export const IconWrapper = styled.span`
  padding-left: 4px;
`;
