import styled from "styled-components";
import { space } from "styled-system";

export const Tab = styled.li`
  background: rgba(0, 0, 0, 0.05);
  color: #333;
  padding: 10px;
  border-top: 3px solid transparent;
  transition: background 350ms;
  ${space};

  ${props =>
    props.active &&
    `
    border-top: 3px solid rgb(234, 102, 104);
    background: #333;
    color: #fff;
  `};
`;

export const Tabs = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  list-style: none;
  ${space};
`;
