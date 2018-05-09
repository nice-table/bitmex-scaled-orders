import styled from "styled-components";
import { space } from "styled-system";

export const FieldError = styled.div.attrs({ my: 1 })`
  color: #e30000;
  ${space};
`;

export const LabelText = styled.span`
  font-weight: 700;
  padding-bottom: 10px;
  display: block;
  color: #444;
`;
