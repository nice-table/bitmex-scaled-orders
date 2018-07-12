import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { createSelector } from "reselect";
import sockette from "sockette";
import produce from "immer";
import { websocketPort } from "config";

const DataContext = React.createContext({
  currentInstrument: null,
  symbols: [],
  data: {
    order: {},
    instrument: {},
    position: {}
  },
  getOrders: () => [],
  getAllOrders: () => [],
  getPositions: () => [],
  getAllPositions: () => [],
  orderValueXBT: () => null,
  getSymbols: () => [],
  changeCurrentInstrument: () => null,
  getCurrentInstrument: () => null
});

/* Memoize orders and positions to avoid unnecessary renders */
const ordersSelector = createSelector(
  state => state.bitmex.data.order,
  orders => Object.keys(orders).reduce((acc, x) => acc.concat(orders[x]), [])
);

const positionsSelector = createSelector(
  state => state.bitmex.data.position,
  positions =>
    Object.keys(positions).reduce((acc, x) => acc.concat(positions[x]), [])
);

class DataProvider extends React.Component {
  static propTypes = {
    instrumentsSymbols: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    const { instrumentsSymbols } = props;

    this.state = {
      bitmex: {
        currentInstrument: _.first(instrumentsSymbols),
        symbols: instrumentsSymbols,
        data: {
          order: {},
          instrument: {},
          position: {}
        },
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
    const { instrumentsSymbols } = this.props;
    const symbolsQuery = `symbols=${instrumentsSymbols.join(",")}`;

    this.ws = new sockette(`ws://localhost:${websocketPort}?${symbolsQuery}`, {
      onmessage: e => {
        const message = JSON.parse(e.data);

        if (message.source === "bitmex" && message.data) {
          this.setState(
            produce(draft => {
              if (draft.bitmex.data[message.tableName]) {
                // Update existing entry
                draft.bitmex.data[message.tableName][message.symbol] =
                  message.data;
              } else {
                // No previous data. Create new table data
                draft.bitmex.data[message.tableName] = {
                  [message.symbol]: message.data
                };
              }
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
    return this.props.instrumentsSymbols;
  };

  // Gets table of the currently active instrument
  getTable(tableName) {
    const symbol = this.getCurrentInstrument();

    return _.get(this.state.bitmex.data, [tableName, symbol]);
  }

  getOrders = () => {
    if (this.getTable("order")) {
      return this.getTable("order");
    }

    return [];
  };

  getAllOrders = () => {
    return ordersSelector(this.state);
  };

  getPositions = () => {
    if (this.getTable("position")) {
      return this.getTable("position");
    }

    return [];
  };

  getAllPositions = () => {
    return positionsSelector(this.state);
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
