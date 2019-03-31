import styled from "styled-components";
import { space } from "styled-system";

export const PlainButton = styled.button`
  border: 0;
  outline: 0;
  background: 0;
  color: ${props => props.theme.palette.text.primary};
  cursor: pointer;
  ${space};
`;
