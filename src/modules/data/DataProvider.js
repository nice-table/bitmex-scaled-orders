import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { createSelector } from "reselect";
import sockette from "sockette";
import produce from "immer";
import { websocketPort } from "config";
import queryString from "qs";
import { toast } from "react-toastify";
import { UISettingsContext } from "modules/ui";
import isEqual from "react-fast-compare";

const intialData = {
  order: {},
  instrument: {},
  position: {}
};

const DataContext = React.createContext({
  instruments: [],
  data: intialData,
  getAllOrders: () => [],
  getAllPositions: () => [],
  orderValueXBT: () => null,
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
    currentInstrument: PropTypes.string.isRequired,
    selectedInstruments: PropTypes.array.isRequired,
    instruments: PropTypes.array.isRequired,
    apiContext: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      bitmex: {
        data: {
          order: {},
          instrument: {},
          position: {}
        },
        getOrders: this.getOrders,
        getAllOrders: this.getAllOrders,
        getAllPositions: this.getAllPositions,
        orderValueXBT: this.orderValueXBT,
        getInstrumentData: this.getInstrumentData,
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
      return this.reconnectToWebsocket();
    }

    if (
      !isEqual(this.props.selectedInstruments, prevProps.selectedInstruments)
    ) {
      return this.reconnectToWebsocket();
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
    const { selectedInstruments, apiContext } = this.props;

    const apikeys = apiContext.getActiveKeys();

    const queries = queryString.stringify({
      symbols: selectedInstruments.join(","),
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

  getInstrumentData = () => {
    return this.props.instruments.find(
      x => x.symbol === this.getCurrentInstrument()
    );
  };

  getCurrentInstrument = () => {
    return this.props.currentInstrument;
  };

  // Gets table of the currently active instrument
  getTable(tableName) {
    const symbol = this.getCurrentInstrument();

    return _.get(this.state.bitmex.data, [tableName, symbol]);
  }

  getAllOrders = () => {
    return ordersSelector(this.state);
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

  orderValueXBT = (price, amountUSD) => {
    if (this.getTable("instrument")) {
      const instrument = _.last(this.getTable("instrument"));

      if (!instrument) {
        return null;
      }

      let value = 0;

      if (instrument.multiplier > 0) {
        value = Math.abs(instrument.multiplier * price);
      } else {
        value = Math.abs(instrument.multiplier / price);
      }

      const valueSatoshis = _.round(amountUSD * value);

      // Convert from satoshis to BTC
      return valueSatoshis / 10 ** 8;
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

const DataProviderWrapper = props => (
  <UISettingsContext.Consumer>
    {data => (
      <DataProvider
        currentInstrument={data.currentInstrument}
        selectedInstruments={data.selectedInstruments}
        {...props}
      />
    )}
  </UISettingsContext.Consumer>
);

export { DataProviderWrapper as DataProvider, DataContext };
