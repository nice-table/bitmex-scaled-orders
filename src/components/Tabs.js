import styled from "styled-components";
import { space } from "styled-system";

export const Tab = styled.li`
  background-color: ${props => props.theme.palette.primary.main};
  color: ${props => props.theme.palette.primary.contrastText};
  padding: 10px;
  border-top: 3px solid transparent;
  transition: background 350ms;
  ${space};

  ${props =>
    props.active &&
    `
    border-top: 3px solid rgb(234, 102, 104);
    background-color: ${props => props.theme.palette.secondary.light};
    color: ${props => props.theme.palette.secondary.contrastText};
  `};
`;

export const Tabs = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  list-style: none;
  ${space};
`;
