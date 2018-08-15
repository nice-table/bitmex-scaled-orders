import React from "react";
import ReactTable from "components/ReactTable";
import numeral from "numeral";
import { pure } from "recompose";
import { Button, Icon } from "semantic-ui-react";
import { FormatPrice } from "modules/ui";

const canCancel = order =>
  order.ordStatus !== "Canceled" && order.ordStatus !== "Filled";

const execInstLabels = {
  ParticipateDoNotInitiate: "Post-Only",
  ReduceOnly: "Reduce-Only"
};

export const OrdersTable = pure(({ cancelOrder, orders }) => (
  <ReactTable
    data={orders.filter(x => canCancel(x) && x.ordStatus !== "Rejected")}
    minRows={0}
    noDataText="No active orders"
    showPagination={false}
    getTrProps={(state, rowInfo, column) => {
      return {
        style: {
          borderLeft:
            rowInfo.row.side === "Buy"
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
        maxWidth: 110,
        Header: "Symbol",
        accessor: "symbol",
        filterable: true,
        filterMethod: (filter, row) => {
          if (filter.value === "all") {
            return true;
          }

          return row[filter.id] === filter.value;
        },
        // eslint-disable-next-line react/prop-types
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: "100%" }}
            value={filter ? filter.value : "all"}
          >
            <option value="all">All</option>
            {[...new Set(orders.map(x => x.symbol))].map(x => (
              <option value={x} key={x}>
                {x}
              </option>
            ))}
          </select>
        )
      },
      {
        Header: "Quantity",
        width: 100,
        accessor: "orderQty",
        Cell: ({ value }) => numeral(value).format("0,0")
      },
      {
        id: "price",
        Header: "Price",
        width: 100,
        accessor: d => (d.ordType === "Stop" ? d.stopPx : d.price),
        Cell: ({ value, original }) => {
          let prefix = "";

          if (original.ordType === "Stop" && original.side === "Sell") {
            prefix = "<= ";
          }

          if (original.ordType === "Stop" && original.side === "Buy") {
            prefix = ">= ";
          }

          return (
            <React.Fragment>
              {prefix}
              <FormatPrice price={value} symbol={original.symbol} />
            </React.Fragment>
          );
        }
      },
      {
        Header: "Type",
        accessor: "ordType",
        filterable: true,
        filterMethod: (filter, row) => {
          if (filter.value === "all") {
            return true;
          }

          return row[filter.id] === filter.value;
        },
        // eslint-disable-next-line react/prop-types
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: "100%" }}
            value={filter ? filter.value : "all"}
          >
            <option value="all">All</option>
            {[...new Set(orders.map(x => x.ordType))].map(x => (
              <option value={x} key={x}>
                {x}
              </option>
            ))}
          </select>
        ),
        width: 100
      },
      {
        Header: "Status",
        accessor: "ordStatus",
        maxWidth: 100
      },
      {
        Header: "Exec.",
        accessor: "execInst",
        Cell: ({ value }) =>
          execInstLabels[value] ? execInstLabels[value] : value
      },
      {
        sortable: false,
        style: { textAlign: "center" },
        headerStyle: { textAlign: "center" },
        maxWidth: 80,
        Header: ({ data }) =>
          data.length > 0 && (
            <Button
              onClick={() =>
                cancelOrder.doFetch({
                  body: {
                    orderID: data
                      .filter(x => canCancel(x._original))
                      .map(x => x._original.orderID)
                  }
                })
              }
              size="mini"
              aria-label="Cancel all orders"
              title="Cancel all orders"
              disabled={cancelOrder.fetching}
              negative
            >
              <Icon name="cancel" />
            </Button>
          ),
        Cell: ({ original }) =>
          canCancel(original) && (
            <Button
              size="mini"
              disabled={cancelOrder.fetching}
              onClick={() =>
                cancelOrder.doFetch({
                  body: {
                    orderID: [original.orderID]
                  }
                })
              }
              negative
            >
              Cancel
            </Button>
          )
      }
    ]}
  />
));
