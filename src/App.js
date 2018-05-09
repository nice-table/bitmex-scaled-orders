import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { injectGlobal } from "styled-components";
import Dashboard from "containers/Dashboard";
import { ToastContainer } from "react-toastify";
import { testnet } from "config";

injectGlobal`
  * {
    box-sizing: border-box;
  }
`;

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>{testnet ? "TESTNET" : "LIVE"} | Bitmex scaled orders</title>
        </Helmet>
        <Dashboard />
        <ToastContainer autoClose={3000} />
      </React.Fragment>
    );
  }
}

export default App;
