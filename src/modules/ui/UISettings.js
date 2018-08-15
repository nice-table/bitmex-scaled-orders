import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import produce from "immer";
import store from "store2";

const storage = store.namespace("ui");

const initialState = {
  currentInstrument: "XBTUSD",
  selectedInstruments: ["XBTUSD"],
  getSelectedInstruments: () => [],
  setCurrentInstrument: function() {},
  setSelectedInstruments: function() {},
  getCurrentInstrumentData: function() {},
  getInstruments: () => []
};

const UISettingsContext = React.createContext(initialState);

class UISettingsProvider extends React.Component {
  static propTypes = {
    instruments: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    let currentInstrument =
      storage.get("currentInstrument") || initialState.currentInstrument;
    let selectedInstruments =
      storage.get("selectedInstruments") || initialState.selectedInstruments;

    // Check if selected instruments are among valid/active instruments
    selectedInstruments = selectedInstruments.filter(x =>
      props.instruments.some(y => y.symbol === x)
    );

    // Check if previously active order instrument is among selected instruments
    // Pick first one if not
    if (!selectedInstruments.some(x => x === currentInstrument)) {
      currentInstrument = _.first(selectedInstruments);
    }

    storage.set("currentInstrument", currentInstrument);
    storage.set("selectedInstruments", selectedInstruments);

    this.state = {
      ...initialState,
      currentInstrument, // Currently selected instrument for order form
      selectedInstruments, // Instruments user has selected to view in tabs above order form
      getInstruments: this.getInstruments, // All currently active Bitmex instruments
      setCurrentInstrument: this.setCurrentInstrument,
      setSelectedInstruments: this.setSelectedInstruments,
      getCurrentInstrumentData: this.getCurrentInstrumentData,
      getSelectedInstruments: this.getSelectedInstruments
    };
  }

  getInstruments = () => this.props.instruments;

  // Returns user's currently selected instruments ordered by rootSymbol and expiration date
  getSelectedInstruments = () => {
    const instruments = this.props.instruments;

    return _.orderBy(this.state.selectedInstruments, x => [
      instruments.find(y => y.symbol === x).rootSymbol,
      instruments.find(y => y.symbol === x).expiry
    ]);
  };

  setCurrentInstrument = newCurrentInstrument => {
    storage.set("currentInstrument", newCurrentInstrument);
    this.setState(
      produce(draft => {
        draft.currentInstrument = newCurrentInstrument;
      })
    );
  };

  setSelectedInstruments = instruments => {
    storage.set("selectedInstruments", instruments);
    this.setState(
      produce(draft => {
        draft.selectedInstruments = instruments;
      })
    );

    if (!instruments.some(x => x === this.state.currentInstrument)) {
      this.setCurrentInstrument(_.first(instruments));
    }
  };

  getCurrentInstrumentData = () =>
    this.props.instruments.find(x => x.symbol === this.state.currentInstrument);

  render() {
    return (
      <UISettingsContext.Provider value={this.state}>
        {this.props.children}
      </UISettingsContext.Provider>
    );
  }
}

export { UISettingsProvider, UISettingsContext };
