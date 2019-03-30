import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import { ToastContainer } from "react-toastify";
import { FetchProvider } from "@bjornagh/use-fetch";
import { ApiKeyProvider } from "modules/api";
import { AppContainer } from "./AppContainer";
import { ThemeProvider } from "./Theme";
import CssBaseline from "@material-ui/core/CssBaseline";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body, html {
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    color: ${props => props.theme.palette.text.primary};
  }
`;

const fetchCache = new Map();

class App extends Component {
  render() {
    return (
      <ThemeProvider>
        <React.Fragment>
          <GlobalStyle />
          <CssBaseline />
          <FetchProvider cache={fetchCache}>
            <ApiKeyProvider>
              <AppContainer />
            </ApiKeyProvider>
          </FetchProvider>

          <ToastContainer />
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

export default App;
