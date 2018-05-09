import React from "react";
import styled from "styled-components";
import ReactTable from "components/ReactTable";
import numeral from "numeral";

const PositionStatus = styled.span`
  ${props => props.pnl > 0 && "color: green"};
  ${props => props.pnl < 0 && "color: red"};
`;

const satoshiToBTC = satoshi => satoshi / 10 ** 8;

export const PositionsTable = ({ positions }) => (
  <ReactTable
    data={positions}
    minRows={0}
    showPagination={false}
    columns={[
      {
        Header: "Position size",
        accessor: "currentQty",
        Cell: ({ value }) => numeral(value).format("0,0")
      },
      {
        Header: "Entry price",
        accessor: "avgEntryPrice",
        Cell: ({ value }) => numeral(value).format("0,0")
      },
      {
        Header: "Unrealised PNL",
        accessor: "unrealisedPnl",
        Cell: ({ value }) => (
          <PositionStatus pnl={value}>{satoshiToBTC(value)}</PositionStatus>
        )
      },
      {
        Header: "Realised PNL",
        accessor: "realisedPnl",
        Cell: ({ value }) => (
          <PositionStatus pnl={value}>{satoshiToBTC(value)}</PositionStatus>
        )
      }
    ]}
  />
);
