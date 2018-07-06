import styled from "styled-components";
import { space } from "styled-system";

export const Tab = styled.li`
  background: rgba(0, 0, 0, 0.05);
  color: #333;
  display: inline-block;
  padding: 10px;
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
  ${space};
`;
