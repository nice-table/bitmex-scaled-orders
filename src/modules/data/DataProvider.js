import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { createSelector } from "reselect";
import sockette from "sockette";
import produce from "immer";
import { websocketPort } from "config";
import queryString from "qs";
import { toast } from "react-toastify";

const intialData = {
  order: {},
  instrument: {},
  position: {}
};

const DataContext = React.createContext({
  currentInstrument: null,
  symbols: [],
  data: intialData,
  getOrders: () => [],
  getAllOrders: () => [],
  getPositions: () => [],
  getAllPositions: () => [],
  orderValueXBT: () => null,
  getSymbols: () => [],
  changeCurrentInstrument: () => null,
  getCurrentInstrument: () => null,
  getLastPrice: () => null
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
    instrumentsSymbols: PropTypes.array.isRequired,
    apiContext: PropTypes.object.isRequired
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
        getCurrentInstrument: this.getCurrentInstrument,
        getLastPrice: this.getLastPrice
      }
    };
  }

  componentDidMount() {
    this.connectToToWebocketApi();
  }

  componentDidUpdate(prevProps, prevState) {
    // API keys have changed, so we have to close and reconnect to websocket API
    if (this.props.apiContext !== prevProps.apiContext) {
      this.reconnectToWebsocket();
    }
  }

  reconnectToWebsocket() {
    this.closeWebsocketConnection();

    // Reset state of data in case we're switching from testnet to prod or vice versa
    this.setState(
      produce(draft => {
        draft.bitmex.data = intialData;
      })
    );

    this.connectToToWebocketApi();
  }

  connectToToWebocketApi() {
    const { instrumentsSymbols, apiContext } = this.props;

    const apikeys = apiContext.getActiveKeys();

    const queries = queryString.stringify({
      symbols: instrumentsSymbols.join(","),
      testnet: apiContext.testnet,
      apiKeyID: apikeys.apiKeyID,
      apiKeySecret: apikeys.apiKeySecret
    });

    this.ws = new sockette(`ws://localhost:${websocketPort}?${queries}`, {
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

        if (message.source === "local") {
          // Reconnect if websocket connection to bitmex terminates
          if (
            message.error === true &&
            message.errorCode === "BITMEX_CLIENT_SOCKET_ERROR"
          ) {
            toast.info(
              "Connection to Bitmex was terminated. Will attempt to reconnect."
            );

            return this.reconnectToWebsocket();
          }

          toast.info(message.message);
        }
      },
      onerror: e => toast.error(e)
    });
  }

  closeWebsocketConnection() {
    this.ws.close();
  }

  componentWillUnmount() {
    this.closeWebsocketConnection();
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

  getLastPrice = symbol => {
    const instrumentTable = _.get(this.state.bitmex.data, [
      "instrument",
      symbol
    ]);

    if (!instrumentTable) {
      return null;
    }

    const instrument = _.last(instrumentTable);
    if (!instrument) {
      return null;
    }

    return instrument.lastPrice;
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
