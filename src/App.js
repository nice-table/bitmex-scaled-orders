import React, { Component } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { injectGlobal } from "styled-components";
import { ToastContainer } from "react-toastify";
import { Loader } from "semantic-ui-react";
import Dashboard from "containers/Dashboard";
import { DataProvider, FetchXBTFuturesInstruments } from "modules/data";
import { testnet } from "config";

const Container = styled.div`
  padding: 20px;
`;

injectGlobal`
  * {
    box-sizing: border-box;
  }
`;

class App extends Component {
  render() {
    return (
      <FetchXBTFuturesInstruments>
        {({ fetching, data }) =>
          fetching || !data ? (
            <Loader active>Loading...</Loader>
          ) : (
            <DataProvider
              instrumentsSymbols={["XBTUSD"].concat(data.map(x => x.symbol))}
            >
              <Container>
                <Helmet>
                  <title>
                    {testnet ? "TESTNET" : "LIVE"} | Bitmex scaled orders
                  </title>
                </Helmet>
                <Dashboard />
                <ToastContainer autoClose={3000} />
              </Container>
            </DataProvider>
          )
        }
      </FetchXBTFuturesInstruments>
    );
  }
}

export default App;
