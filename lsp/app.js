const rpc = require("vscode-ws-jsonrpc");
const jsonServer = require("vscode-ws-jsonrpc/lib/server");
const lsp = require("vscode-languageserver");
const express = require("express");
const ws = require("ws");

function launch(socket) {
  const reader = new rpc.WebSocketMessageReader(socket);
  const writer = new rpc.WebSocketMessageWriter(socket);
  const socketConnection = jsonServer.createConnection(reader, writer, () =>
    socket.dispose()
  );
  const serverConnection = jsonServer.createServerProcess("JSON", "pyls");
  jsonServer.forward(socketConnection, serverConnection, (message) => {
    if (rpc.isRequestMessage(message)) {
      if (message.method === lsp.InitializeRequest.type.method) {
        const initializeParams = message.params;
        initializeParams.processId = process.pid;
      }
    }
    return message;
  });
}

process.on("uncaughtException", function (err) {
  console.error("Uncaught Exception: ", err.toString());
  if (err.stack) {
    console.error(err.stack);
  }
});

const app = express();
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Example app listening ..`);
});

// create the web socket
const wss = new ws.Server({
  noServer: true,
  perMessageDeflate: false,
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (webSocket) => {
    const socket = {
      send: (content) =>
        webSocket.send(content, (error) => {
          if (error) {
            throw error;
          }
        }),
      onMessage: (cb) => webSocket.on("message", cb),
      onError: (cb) => webSocket.on("error", cb),
      onClose: (cb) => webSocket.on("close", cb),
      dispose: () => webSocket.close(),
    };
    // launch the server when the web socket is opened
    if (webSocket.readyState === webSocket.OPEN) {
      launch(socket);
    } else {
      webSocket.on("open", () => launch(socket));
    }
  });
});
