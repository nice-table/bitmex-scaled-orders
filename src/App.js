import React, { Component } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { injectGlobal } from "styled-components";
import Dashboard from "containers/Dashboard";
import { ToastContainer } from "react-toastify";
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
      <Container>
        <Helmet>
          <title>{testnet ? "TESTNET" : "LIVE"} | Bitmex scaled orders</title>
        </Helmet>
        <Dashboard />
        <ToastContainer autoClose={3000} />
      </Container>
    );
  }
}

export default App;
