import React, { useState } from "react";
import styled from "styled-components";
import { useApiContext, useApi, ApiKeyForm } from "modules/api";
import { UISettingsProvider } from "modules/ui";
import { DataProvider } from "modules/data";
import { Header, Modal } from "semantic-ui-react";
import { Helmet } from "react-helmet";
import Dashboard from "containers/Dashboard";
import { Loader } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { toast } from "react-toastify";

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

export function AppContainer() {
  const apiContext = useApiContext();
  const instruments = useApi({
    url: "instrument/active",
    lazy: !apiContext.isValid
  });

  const requestKey = JSON.stringify(apiContext.getActiveKeys());

  const apiKeys = useApi({
    url: "apiKey",
    requestKey: requestKey,
    onSuccess: response => {
      const { apiKeyID } = apiContext.getActiveKeys();
      const key = response.data.find(x => x.id === apiKeyID);

      if (key && key.permissions.includes("order")) {
        apiContext.setKeysValid(true);
      } else {
        toast.error(`Invalid API key: doesn't have 'order' permission`);
      }
    },
    onError: response => {
      toast.error(`Invalid API key: ${response.statusText}`);
      apiContext.setKeysValid(false);
    }
  });

  if (instruments.fetching || apiKeys.fetching) {
    return <Loader active>Loading...</Loader>;
  }

  if (!apiContext.hasApiKeys() || !apiContext.isValid) {
    return <RenderApiKeyForm onKeySubmit={apiKeys.doFetch} />;
  }

  if (instruments.data) {
    return (
      <UISettingsProvider instruments={instruments.data}>
        <React.Fragment>
          <DataProvider
            apiContext={apiContext}
            instruments={instruments.data}
            instrumentsSymbols={[].concat(instruments.data.map(x => x.symbol))}
          >
            <Container>
              <Helmet>
                <title>
                  {apiContext.testnet ? "TESTNET" : "LIVE"} | Bitmex scaled
                  orders
                </title>
              </Helmet>

              <Dashboard instruments={instruments.data} />
            </Container>
          </DataProvider>

          <Settings onKeySubmit={apiKeys.doFetch} />
        </React.Fragment>
      </UISettingsProvider>
    );
  }

  return null;
}

function Settings({ onKeySubmit }) {
  const [isSettingsModalOpen, onSetOpen] = useState(false);

  return (
    <div>
      <SettingsModalToggler
        aria-label="Open settings"
        title="Open settings"
        onClick={() => onSetOpen(true)}
      >
        <Icon name="setting" size="big" />
      </SettingsModalToggler>

      {isSettingsModalOpen && (
        <Modal
          onOpen={() => onSetOpen(true)}
          open={isSettingsModalOpen}
          onClose={() => onSetOpen(false)}
          size="small"
        >
          <Modal.Content>
            <Header as="h2">Settings</Header>
            <ApiKeyForm
              onKeySubmit={onKeySubmit}
              afterSubmit={() => onSetOpen(false)}
            />
          </Modal.Content>
        </Modal>
      )}
    </div>
  );
}

function RenderApiKeyForm({ onKeySubmit }) {
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

      <ApiKeyForm onKeySubmit={onKeySubmit} />
    </div>
  );
}
