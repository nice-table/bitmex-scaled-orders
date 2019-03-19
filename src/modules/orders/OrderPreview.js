import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import ReactTable from "components/ReactTable";
import numeral from "numeral";
import isEqual from "react-fast-compare";
import { FormatPrice } from "modules/ui";

class OrderPreview extends React.Component {
  static propTypes = {
    orders: PropTypes.array.isRequired,
    orderAmount: PropTypes.number
  };

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

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
            Cell: ({ value }) => <FormatPrice price={value} />,
            Footer: () => (
              <div>
                Avg. price:{" "}
                <FormatPrice
                  price={
                    _.sum(orders.map(x => x.price * x.amount)) / orderAmount
                  }
                />
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
