import React from "react";
import styled from "styled-components";
import { useApiContext, useApi, ApiKeyForm } from "modules/api";
import { UISettingsProvider } from "modules/ui";
import { DataProvider } from "modules/data";
import { Header } from "components/Header";
import { Dialog } from "components/Dialog";
import { Helmet } from "react-helmet";
import Dashboard from "containers/Dashboard";
import CircularProgress from "@material-ui/core/CircularProgress";
import { toast } from "react-toastify";
import SettingsIcon from "@material-ui/icons/Settings";
import { useThemeContext } from "./Theme";
import ColorsIcon from "@material-ui/icons/InvertColors";

const Container = styled.div`
  padding: 20px;
`;

const AppSettingButton = styled.button`
  background: none;
  border: 0;
  cursor: pointer;
  color: ${props => props.theme.palette.text.primary};
`;

const AppSettingsContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

export function AppContainer() {
  const { toggleDarkLightTheme } = useThemeContext();

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
    onError: error => {
      toast.error(`${error.message}. Try restarting the application`);
      apiContext.setKeysValid(false);
    }
  });

  if (instruments.fetching || apiKeys.fetching) {
    return (
      <div
        style={{
          position: "absolute",
          width: "100px",
          left: "50%",
          top: "50%",
          marginLeft: "0px"
        }}
      >
        <CircularProgress color="secondary" /> Loading...
      </div>
    );
  }

  if (!apiContext.hasApiKeys() || !apiContext.isValid) {
    return (
      <Container>
        <RenderApiKeyForm onKeySubmit={apiKeys.doFetch} />
      </Container>
    );
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

          <Settings
            toggleDarkLightTheme={toggleDarkLightTheme}
            onKeySubmit={apiKeys.doFetch}
          />
        </React.Fragment>
      </UISettingsProvider>
    );
  }

  return null;
}

function Settings({ onKeySubmit, toggleDarkLightTheme }) {
  return (
    <AppSettingsContainer>
      <AppSettingButton
        title="Toggle light/dark theme"
        onClick={toggleDarkLightTheme}
      >
        <ColorsIcon />
      </AppSettingButton>

      <Dialog
        title="Settings"
        content={({ closeModal }) => (
          <ApiKeyForm onKeySubmit={onKeySubmit} afterSubmit={closeModal} />
        )}
      >
        {({ openModal }) => (
          <AppSettingButton title="Open settings" onClick={openModal}>
            <SettingsIcon />
          </AppSettingButton>
        )}
      </Dialog>
    </AppSettingsContainer>
  );
}

function RenderApiKeyForm({ onKeySubmit }) {
  return (
    <div style={{ maxWidth: "450px", margin: "20px auto" }}>
      <Header as="h2" variant="h4">
        Login
      </Header>
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
