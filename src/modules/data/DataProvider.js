import React from "react";
import _ from "lodash";
import sockette from "sockette";
import produce from "immer";
import { websocketPort, symbols } from "config";

const DataContext = React.createContext({
  currentInstrument: _.first(symbols),
  symbols: symbols,
  data: {}
});

class DataProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bitmex: {
        currentInstrument: _.first(symbols),
        symbols: symbols,
        data: {},
        getOrders: this.getOrders,
        getAllOrders: this.getAllOrders,
        getPositions: this.getPositions,
        getAllPositions: this.getAllPositions,
        orderValueXBT: this.orderValueXBT,
        getSymbols: this.getSymbols,
        changeCurrentInstrument: this.changeCurrentInstrument,
        getCurrentInstrument: this.getCurrentInstrument
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

  changeCurrentInstrument = newCurrentInstrument => {
    this.setState(
      produce(draft => {
        draft.bitmex.currentInstrument = newCurrentInstrument;
      })
    );
  };

  getCurrentInstrument = () => {
    return this.state.bitmex.currentInstrument;
  };

  getSymbols = () => {
    return this.state.bitmex.symbols;
  };

  // Gets table of the currently active instrument
  getTable(tableName) {
    const symbol = this.getCurrentInstrument();

    return this.state.bitmex.data[`${symbol}:${tableName}`];
  }

  getOrders = () => {
    if (this.getTable("order")) {
      return this.getTable("order");
    }

    return [];
  };

  getAllOrders = () => {
    return Object.keys(this.state.bitmex.data)
      .filter(x => x.endsWith("order"))
      .reduce((acc, x) => acc.concat(this.state.bitmex.data[x]), []);
  };

  getPositions = () => {
    if (this.getTable("position")) {
      return this.getTable("position");
    }

    return [];
  };

  getAllPositions = () => {
    return Object.keys(this.state.bitmex.data)
      .filter(x => x.endsWith("position"))
      .reduce((acc, x) => acc.concat(this.state.bitmex.data[x]), []);
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
