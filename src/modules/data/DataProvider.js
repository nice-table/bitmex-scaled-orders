import React from "react";
import _ from "lodash";
import sockette from "sockette";
import produce from "immer";
import { websocketPort } from "config";

const DataContext = React.createContext({ instrument: "XBTUSD", data: {} });

class DataProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bitmex: {
        instrument: "XBTUSD",
        data: {},
        getOrders: this.getOrders,
        getPositions: this.getPositions,
        orderValueXBT: this.orderValueXBT
      }
    };
  }

  componentDidMount() {
    this.ws = new sockette(`ws://localhost:${websocketPort}`, {
      onmessage: e => {
        const message = JSON.parse(e.data);

        if (message.source === "bitmex" && message.data) {
          this.setState(
            produce(draft => {
              draft.bitmex.data[`${message.symbol}:${message.tableName}`] =
                message.data;
            })
          );
        }
      }
    });
  }

  componentWillUnmount() {
    this.ws.close();
  }

  getCurrentInstrument() {
    return this.state.bitmex.instrument;
  }

  getTable(tableName) {
    const instrument = this.getCurrentInstrument();

    return this.state.bitmex.data[`${instrument}:${tableName}`];
  }

  getOrders = () => {
    if (this.getTable("order")) {
      return this.getTable("order");
    }

    return [];
  };

  getPositions = () => {
    if (this.getTable("position")) {
      return this.getTable("position");
    }

    return [];
  };

  orderValueXBT = amountUSD => {
    if (this.getTable("instrument")) {
      const instrument = _.last(this.getTable("instrument"));

      if (!instrument) {
        return null;
      }

      return amountUSD / instrument.lastPrice;
    }

    return null;
  };

  render() {
    return (
      <DataContext.Provider value={this.state.bitmex}>
        {this.props.children}
      </DataContext.Provider>
    );
  }
}

export { DataProvider, DataContext };
