import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import ReactTable from "components/ReactTable";
import numeral from "numeral";

class OrderPreview extends React.Component {
  static propTypes = {
    orders: PropTypes.array.isRequired,
    orderAmount: PropTypes.number
  };

  render() {
    const { orders, orderAmount } = this.props;
    return (
      <ReactTable
        data={orders}
        minRows={0}
        showPagination={false}
        pageSize={orders.length}
        columns={[
          {
            Header: "Price",
            accessor: "price",
            Cell: ({ value }) => numeral(value).format("0,0"),
            Footer: () => (
              <div>
                Avg. price:{" "}
                {numeral(
                  _.sum(orders.map(x => x.price * x.amount)) / orderAmount
                ).format("0,0")}
              </div>
            )
          },
          {
            Header: "Amount",
            accessor: "amount",
            Cell: ({ value }) => numeral(value).format("0,0")
          }
        ]}
      />
    );
  }
}

export { OrderPreview };
