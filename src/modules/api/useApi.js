import { useFetch } from "@bjornagh/use-fetch";
import { useApiContext } from "./ApiKeyProvider";
import { httpProxyPort } from "config";

export function useApi({ url, init = {}, ...rest }) {
  const apiContext = useApiContext();

  const apiRoot = "/api/v1/";
  const finalUrl = `http://localhost:${httpProxyPort}${apiRoot}${encodeURI(
    url
  )}`;

  init.headers = {
    "content-type": "application/json",
    accept: "application/json",
    "bitmex-api-testnet": apiContext.testnet,
    "bitmex-api-apiKeyID": apiContext.getActiveKeys().apiKeyID,
    "bitmex-api-apiKeySecret": apiContext.getActiveKeys().apiKeySecret,
    ...init.headers
  };

  // todo: do default error handler

  return useFetch({
    url: finalUrl,
    init,
    ...rest
  });
}
