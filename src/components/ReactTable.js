import ReactTable from "react-table";
import styled from "styled-components";
import "react-table/react-table.css";

export default styled(ReactTable)`
  border: 0 !important;

  .rt-table {
    background-color: transparent;
  }

  .rt-tfoot.rt-tfoot {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: none;
  }

  .rt-thead {
    &.-header.-header {
      box-shadow: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      margin-bottom: 5px;
    }

    .rt-th.rt-th {
      border: 0;
      color: ${props => props.theme.palette.text.primary};
      text-align: left;
      transition: background-color 150ms;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
  }

  .rt-tbody.rt-tbody .rt-tr-group {
    border-bottom: 0;
  }

  .rt-tr {
    border-bottom: 1px solid transparent;
  }
`;
