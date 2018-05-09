import React from "react";
import ReactTable from "components/ReactTable";
import numeral from "numeral";
import { Button, Icon } from "semantic-ui-react";

const canCancel = order =>
  order.ordStatus !== "Canceled" && order.ordStatus !== "Filled";

export const OrdersTable = ({ cancelOrder, orders }) => (
  <ReactTable
    data={orders.filter(canCancel)}
    minRows={0}
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
        Header: "Symbol",
        accessor: "symbol"
      },
      {
        Header: "Quantity",
        accessor: "orderQty",
        Cell: ({ value }) => numeral(value).format("0,0")
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => numeral(value).format("0,0")
      },
      {
        Header: "Type",
        accessor: "ordType"
      },
      {
        Header: "Status",
        accessor: "ordStatus"
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
);
