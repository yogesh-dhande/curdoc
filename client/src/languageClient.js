import * as monaco from "monaco-editor";
import {
  CloseAction,
  createConnection,
  ErrorAction,
  MonacoLanguageClient,
} from "monaco-languageclient";
import { listen } from "vscode-ws-jsonrpc";

monaco.languages.register({
  id: "python",
  extensions: [".py"],
  aliases: ["python"],
  mimetypes: ["application/text"],
});

function createLanguageClient(connection) {
  return new MonacoLanguageClient({
    name: "Monaco language client",
    clientOptions: {
      documentSelector: ["python"],
      errorHandler: {
        error: () => ErrorAction.Continue,
        closed: () => CloseAction.DoNotRestart,
      },
    },
    connectionProvider: {
      get: (errorHandler, closeHandler) => {
        return Promise.resolve(
          createConnection(connection, errorHandler, closeHandler)
        );
      },
    },
  });
}

function connectToMonacoServer() {
  const webSocket = new WebSocket("ws://localhost:8000");
  listen({
    webSocket: webSocket,
    onConnection: (connection) => {
      var languageClient = createLanguageClient(connection);
      var disposable = languageClient.start();
      connection.onClose(function() {
        return disposable.dispose();
      });
      connection.onError(function(error) {
        console.log(error);
      });
    },
  });
}

export { connectToMonacoServer };
