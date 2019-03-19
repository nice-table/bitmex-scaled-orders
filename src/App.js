import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import { ToastContainer } from "react-toastify";
import { FetchProvider } from "@bjornagh/use-fetch";
import { ApiKeyProvider } from "modules/api";
import { AppContainer } from "./AppContainer";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

const fetchCache = new Map();

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <GlobalStyle />
        <FetchProvider cache={fetchCache}>
          <ApiKeyProvider>
            <AppContainer />
          </ApiKeyProvider>
        </FetchProvider>

        <ToastContainer />
      </React.Fragment>
    );
  }
}

export default App;
