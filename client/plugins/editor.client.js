import * as monaco from "monaco-editor";
import {
  CloseAction,
  createConnection,
  ErrorAction,
  MonacoLanguageClient,
  MonacoServices,
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
  const webSocket = new WebSocket("ws://localhost:8081");
  listen({
    webSocket,
    onConnection: (connection) => {
      const languageClient = createLanguageClient(connection);
      const disposable = languageClient.start();
      connection.onClose(function () {
        return disposable.dispose();
      });
      connection.onError(function (error) {
        console.log(error);
      });
    },
  });
}

let _editor = null;

let currentModel = {};
let editorModels = {};

const editorService = {
  initialize(el) {
    if (!_editor) {
      console.log("creating editor");
      const editor = monaco.editor.create(el, {
        model: null,
        language: "python",
        theme: "vs-dark",
        minimap: false,
        fontSize: 14,
        readOnly: !this.canEdit,
        automaticLayout: true,
      });
      MonacoServices.install(monaco);
      connectToMonacoServer();
      _editor = editor;
      editorModels = {};
    }
  },

  setModel(key, text, readOnly) {
    // TODO: save state of current model
    if (
      currentModel.model &&
      currentModel.model === _editor.getModel() &&
      currentModel.key in editorModels
    ) {
      console.log("saving editor state of the current model");
      // editorModels[currentModel.key].state = _editor.saveViewState();
    }

    // create a new model if one does not already exist
    if (!editorModels[key]) {
      console.log("editor model key not found", key);
      editorModels[key] = {
        model: monaco.editor.createModel(text, "python"),
        state: null,
        key,
      };
    }
    console.log("setting editor model");
    _editor.updateOptions({ readOnly });
    _editor.setModel(editorModels[key].model);
    // _editor.restoreViewState(editorModels[key].state);
    _editor.focus();
    currentModel = editorModels[key];
  },

  setCallback(callback) {
    _editor.onDidChangeModelContent(() => {
      callback();
    });
  },

  getValue() {
    return _editor.getValue();
  },
  setReadOnly(readOnly) {
    _editor.updateOptions({ readOnly });
  },
};

export default (ctx, inject) => {
  inject("editor", editorService);
};
