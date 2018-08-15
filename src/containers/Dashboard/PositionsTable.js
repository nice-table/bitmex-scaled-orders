import React from "react";
import styled from "styled-components";
import ReactTable from "components/ReactTable";
import numeral from "numeral";
import { pure } from "recompose";
import { FormatPrice } from "modules/ui";

const PositionStatus = styled.span`
  ${props => props.pnl > 0 && "color: green"};
  ${props => props.pnl < 0 && "color: red"};
`;

const satoshiToBTC = satoshi => satoshi / 10 ** 8;

export const PositionsTable = pure(({ positions }) => (
  <ReactTable
    data={positions.filter(x => x.isOpen)}
    minRows={0}
    noDataText="No open positions"
    showPagination={false}
    getTrProps={(state, rowInfo, column) => {
      return {
        style: {
          borderLeft:
            rowInfo.row.currentQty > 0
              ? "5px solid #52b370"
              : "5px solid #e8704f"
        }
      };
    }}
    columns={[
      {
        Header: "Buy / Sell",
        accessor: "side",
        show: false
      },
      {
        Header: "Symbol",
        accessor: "symbol"
      },
      {
        Header: "Position size",
        accessor: "currentQty",
        Cell: ({ value }) => numeral(value).format("0,0")
      },
      {
        Header: "Entry price",
        accessor: "avgEntryPrice",
        Cell: ({ value, original }) => (
          <FormatPrice price={value} symbol={original.symbol} />
        )
      },
      {
        Header: "Liq. price",
        accessor: "liquidationPrice",
        Cell: ({ value, original }) => (
          <FormatPrice price={value} symbol={original.symbol} />
        )
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
));
