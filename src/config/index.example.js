module.exports = {
  // Bitmex Websocket "proxy" port
  websocketPort: 1337,

  // Bitmex REST API proxy port
  httpProxyPort: 8000,

  // Bitmex
  testnet: true, // set `true` to connect to the testnet site (testnet.bitmex.com)

  apiKeyID: "changeme",
  apiKeySecret: "changeme",

  // Websocket
  streams: ["instrument", "order", "position"],

  // This prevents memory usage from getting out of control. Tweak to your needs.
  maxTableLen: 10000
};
