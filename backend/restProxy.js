/*
  Proxy for Bitmex's REST API.

  * Returns the necessary CORS headers to web client
  * Appends API key, expires and signature headers to requests
*/
const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const config = require("../src/config");
const httpProxy = require("http-proxy");

const port = config.httpProxyPort;

const app = express();
const proxy = httpProxy.createProxyServer({});

// Create Bitmex API signature
const createBitmexSignature = (req, body, apiKeySecret) => {
  const verb = req.method;
  const expires = new Date().getTime() + 60 * 1000; // 1 min in the future
  const url = req.url;

  const signature = crypto
    .createHmac("sha256", apiKeySecret)
    .update(verb + url + expires + body)
    .digest("hex");

  return { signature, expires };
};

// https://github.com/nodejitsu/node-http-proxy/blob/42e8e1e099c086d818d8f62c8f15ec5a8f1a6624/examples/middleware/bodyDecoder-middleware.js#L38
proxy.on("proxyReq", function(proxyReq, req, res, options) {
  let bodyData = "";
  if (req.body) {
    bodyData = JSON.stringify(req.body);
  }

  if (req.method !== "OPTIONS") {
    const apiContext = {
      apiKeyID: req.headers["bitmex-api-apikeyid"],
      apiKeySecret: req.headers["bitmex-api-apikeysecret"]
    };

    const { signature, expires } = createBitmexSignature(
      req,
      bodyData,
      apiContext.apiKeySecret
    );
    proxyReq.setHeader("api-expires", expires);
    proxyReq.setHeader("api-key", apiContext.apiKeyID);
    proxyReq.setHeader("api-signature", signature);

    // We don't want to send our keys to bitmex, so we remove them from the proxy request
    proxyReq.removeHeader("bitmex-api-apikeyid");
    proxyReq.removeHeader("bitmex-api-apikeysecret");
  }

  proxyReq.setHeader("Content-Type", "application/json");
  proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

  proxyReq.write(bodyData);
});

app.use(bodyParser.json());
app.use(function(req, res) {
  delete req.headers["origin"];
  delete req.headers["referer"];
  delete req.headers["host"];

  const apiContext = {
    testnet: String(req.headers["bitmex-api-testnet"]).toLowerCase() === "true"
  };

  delete req.headers["bitmex-api-testnet"];

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-type, Content-Length,api-expires,api-key,api-signature,bitmex-api-testnet,bitmex-api-apiKeyID,bitmex-api-apiKeySecret"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,POST,PUT,DELETE,OPTIONS"
  );

  const apiURL =
    apiContext.testnet === true
      ? "https://testnet.bitmex.com"
      : "https://www.bitmex.com";
  proxy.web(req, res, { target: apiURL });
});

app.listen(config.httpProxyPort, () =>
  console.log("Started BitMEX proxy on port", port)
);
