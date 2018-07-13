import React from "react";
import _ from "lodash";
import { Fetch } from "react-request";
import { httpProxyPort } from "config";
import { toast } from "react-toastify";
import { ApiContextConsumer } from "./ApiKeyProvider";
/*
  Wrapper over react-request that can be used to create request to Bitmex's REST API
*/
const BitmexFetch = ({
  url,
  beforeFetch,
  apiContext,
  afterFetch,
  onError,
  ...props
}) => {
  const apiRoot = "/api/v1/";
  const finalUrl = `http://localhost:${httpProxyPort}${apiRoot}${encodeURI(
    url
  )}`;

  const finalBeforeFetch = options => {
    const init = options.init;
    const verb = init.method;

    if (verb !== "GET") {
      init.body = JSON.stringify(init.body);
    }

    init.headers = {
      "content-type": "application/json",
      accept: "application/json",
      "bitmex-api-testnet": apiContext.testnet,
      "bitmex-api-apiKeyID": apiContext.apiKeyID,
      "bitmex-api-apiKeySecret": apiContext.apiKeySecret
    };

    if (beforeFetch) {
      beforeFetch(options);
    }
  };

  const finalAfterFetch = options => {
    if (afterFetch) {
      afterFetch(options);
    }

    if (options.failed) {
      if (_.isFunction(onError)) {
        onError(options);
      } else {
        let message = _.get(options, "data.error.message", null);
        if (!message) {
          message = `${options.statusText}: ${options.url}`;
        }

        toast.error(message);
      }
    }
  };

  return (
    <Fetch
      url={finalUrl}
      beforeFetch={finalBeforeFetch}
      afterFetch={finalAfterFetch}
      {...props}
    />
  );
};

const BitmexFetchWithApiKeys = props => (
  <ApiContextConsumer>
    {data => (
      <BitmexFetch
        apiContext={{
          testnet: data.testnet,
          apiKeyID: data.getActiveKeys().apiKeyID,
          apiKeySecret: data.getActiveKeys().apiKeySecret
        }}
        {...props}
      />
    )}
  </ApiContextConsumer>
);

export { BitmexFetchWithApiKeys as BitmexFetch };
