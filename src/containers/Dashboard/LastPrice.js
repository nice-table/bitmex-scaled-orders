import React from "react";
import PropTypes from "prop-types";
import { DataContext } from "modules/data";

class LastPrice extends React.Component {
  static propTypes = {
    symbol: PropTypes.string.isRequired,
    lastPrice: PropTypes.number,
    children: PropTypes.func.isRequired
  };

  render() {
    return this.props.children({ lastPrice: this.props.lastPrice });
  }
}

export default props => (
  <DataContext.Consumer>
    {data => (
      <LastPrice lastPrice={data.getLastPrice(props.symbol)} {...props} />
    )}
  </DataContext.Consumer>
);
