const WebSocket = require("ws");
const BitMEXClient = require("@nice-table/bitmex-realtime-api");
const config = require("../src/config");

const wss = new WebSocket.Server({ port: config.websocketPort });
console.log("Started webocket server on port", config.websocketPort);

wss.on("connection", function connection(ws, req) {
  /*
    I wasn't able to figure out how to close the connection opened by BitMEXClient
    If connection to this websocket proxy is closed, the BitMEXClient connection
    would still try to publish messages from Bitmex to the closed connection

    Workaround is to set this bool to false when proxy connection closes and check
    this value whether we should relay any messages back to client
  */
  let isAlive = true;

  const urlParsed = require("url").parse(req.url, true);

  const symbols = urlParsed.query.symbols
    ? urlParsed.query.symbols.split(",")
    : [];

  ws.send(JSON.stringify({ source: "local", message: "Connected to proxy" }));

  const client = new BitMEXClient({
    testnet: String(urlParsed.query.testnet).toLowerCase() === "true",
    apiKeyID: urlParsed.query.apiKeyID,
    apiKeySecret: urlParsed.query.apiKeySecret,
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

  symbols.forEach(function(symbol) {
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
