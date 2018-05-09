const WebSocket = require("ws");
const BitMEXClient = require("bitmex-realtime-api");
const config = require("../src/config");

const wss = new WebSocket.Server({ port: config.websocketPort });
console.log("Started webocket server on port", config.websocketPort);

wss.on("connection", function connection(ws) {
  let isAlive = true;

  ws.send(JSON.stringify({ source: "local", message: "Connected to proxy" }));

  const client = new BitMEXClient({
    testnet: config.testnet,
    apiKeyID: config.apiKeyID,
    apiKeySecret: config.apiKeySecret,
    maxTableLen: config.maxTableLen
  });

  ws.on("close", () => {
    isAlive = false;
  });

  client.on("error", function(error) {
    console.log("Caught Websocket error:", error);
  });

  client.on("end", function() {
    console.log(
      "Client closed due to unrecoverable WebSocket error. Please check errors above."
    );
  });

  config.symbols.forEach(function(symbol) {
    config.streams.forEach(function(streamName) {
      client.addStream(symbol, streamName, function(data, symbol, tableName) {
        if (!isAlive) {
          return;
        }

        ws.send(
          JSON.stringify({
            source: "bitmex",
            data,
            symbol,
            tableName
          })
        );
      });
    });
  });
});
