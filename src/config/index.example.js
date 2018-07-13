module.exports = {
  // Bitmex Websocket "proxy" port
  websocketPort: 1337,

  // Bitmex REST API proxy port
  httpProxyPort: 8000,

  // Websocket streams. Should not change these
  streams: ["instrument", "order", "position"],

  // This prevents memory usage from getting out of control. Tweak to your needs.
  maxTableLen: 10000
};
