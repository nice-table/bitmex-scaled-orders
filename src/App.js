import React, { Component } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { injectGlobal } from "styled-components";
import { ToastContainer } from "react-toastify";
import { Loader } from "semantic-ui-react";
import Dashboard from "containers/Dashboard";
import { DataProvider, FetchInstruments } from "modules/data";
import { ApiKeyProvider, ApiContextConsumer, ApiKeyForm } from "modules/api";
import { UISettingsProvider } from "modules/ui";
import { Header, Modal } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";

const Container = styled.div`
  padding: 20px;
`;

const SettingsModalToggler = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: 0;
  cursor: pointer;
`;

injectGlobal`
  * {
    box-sizing: border-box;
  }
`;

class App extends Component {
  state = {
    isSettingsModalOpen: false
  };

  onSetOpen = isOpen => this.setState({ isSettingsModalOpen: isOpen });

  render() {
    return (
      <ApiKeyProvider>
        <ApiContextConsumer>
          {data =>
            data.hasApiKeys() ? this.renderApp() : this.renderApiKeyForm()
          }
        </ApiContextConsumer>
      </ApiKeyProvider>
    );
  }

  renderApp() {
    return (
      <FetchInstruments>
        {({ fetching, data }) =>
          fetching || !data ? (
            <Loader active>Loading...</Loader>
          ) : (
            <UISettingsProvider instruments={data}>
              <ApiContextConsumer>
                {apiContext => (
                  <React.Fragment>
                    <DataProvider
                      apiContext={apiContext}
                      instruments={data}
                      instrumentsSymbols={[].concat(data.map(x => x.symbol))}
                    >
                      <Container>
                        <Helmet>
                          <title>
                            {apiContext.testnet ? "TESTNET" : "LIVE"} | Bitmex
                            scaled orders
                          </title>
                        </Helmet>

                        <Dashboard instruments={data} />

                        <ToastContainer autoClose={3000} />
                      </Container>
                    </DataProvider>

                    <SettingsModalToggler
                      aria-label="Open settings"
                      title="Open settings"
                      onClick={() => this.onSetOpen(true)}
                    >
                      <Icon name="setting" size="big" />
                    </SettingsModalToggler>

                    <Modal
                      onOpen={() => this.onSetOpen(true)}
                      open={this.state.isSettingsModalOpen}
                      onClose={() => this.onSetOpen(false)}
                      size="small"
                    >
                      <Modal.Content>
                        <Header as="h2">Settings</Header>
                        <ApiKeyForm afterSubmit={() => this.onSetOpen(false)} />
                      </Modal.Content>
                    </Modal>
                  </React.Fragment>
                )}
              </ApiContextConsumer>
            </UISettingsProvider>
          )
        }
      </FetchInstruments>
    );
  }

  renderApiKeyForm() {
    return (
      <div style={{ maxWidth: "450px", margin: "20px auto" }}>
        <Header as="h2">Login</Header>
        <p>
          Logon Bitmex and create an API key with order permissions{" "}
          <a
            href="https://www.bitmex.com/app/apiKeys"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.bitmex.com/app/apiKeys
          </a>{" "}
        </p>

        <p>The app uses these keys to place orders.</p>

        <ApiKeyForm />
      </div>
    );
  }
}

export default App;
