import React from "react";
import _ from "lodash";

const STORAGE_KEY = "bmex-api-context";

const ApiContext = React.createContext({
  testnet: true,
  productionApiKeyID: null,
  productionApiKeySecret: null,
  testnetApiKeyID: null,
  testnetApiKeySecret: null,
  setApiKeys: () => null,
  hasApiKeys: () => false
});

class ApiKeyProvider extends React.Component {
  constructor(props) {
    super(props);

    const storageData = global.localStorage.getItem(STORAGE_KEY)
      ? JSON.parse(global.localStorage.getItem(STORAGE_KEY))
      : {};

    this.state = {
      testnet: storageData.testnet || false,
      productionApiKeyID: storageData.productionApiKeyID,
      productionApiKeySecret: storageData.productionApiKeySecret,
      testnetApiKeyID: storageData.testnetApiKeyID,
      testnetApiKeySecret: storageData.testnetApiKeySecret,
      setApiKeys: this.setApiKeys,
      hasApiKeys: this.hasApiKeys,
      getActiveKeys: this.getActiveKeys
    };
  }

  setApiKeys = ({
    testnet,
    productionApiKeyID,
    productionApiKeySecret,
    testnetApiKeyID,
    testnetApiKeySecret
  }) => {
    global.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        testnet,
        productionApiKeyID,
        productionApiKeySecret,
        testnetApiKeyID,
        testnetApiKeySecret
      })
    );
    this.setState({
      testnet,
      productionApiKeyID,
      productionApiKeySecret,
      testnetApiKeyID,
      testnetApiKeySecret
    });
  };

  hasApiKeys = () => {
    const keys = this.getActiveKeys();

    return !_.isEmpty(keys.apiKeyID) && !_.isEmpty(keys.apiKeySecret);
  };

  getActiveKeys = () => {
    if (this.state.testnet === true) {
      return {
        apiKeyID: this.state.testnetApiKeyID,
        apiKeySecret: this.state.testnetApiKeySecret
      };
    }

    return {
      apiKeyID: this.state.productionApiKeyID,
      apiKeySecret: this.state.productionApiKeySecret
    };
  };

  render() {
    return (
      <ApiContext.Provider value={this.state}>
        {this.props.children}
      </ApiContext.Provider>
    );
  }
}

const ApiContextConsumer = ApiContext.Consumer;

export { ApiKeyProvider, ApiContextConsumer };
