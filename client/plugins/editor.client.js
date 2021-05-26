import * as monaco from "monaco-editor";
import {
  CloseAction,
  createConnection,
  ErrorAction,
  MonacoLanguageClient,
  MonacoServices
} from "monaco-languageclient";
import { listen } from "vscode-ws-jsonrpc";

monaco.languages.register({
  id: "python",
  extensions: [".py"],
  aliases: ["python"],
  mimetypes: ["application/text"]
});

function createLanguageClient(connection) {
  return new MonacoLanguageClient({
    name: "Monaco language client",
    clientOptions: {
      documentSelector: ["python"],
      errorHandler: {
        error: () => ErrorAction.Continue,
        closed: () => CloseAction.DoNotRestart
      }
    },
    connectionProvider: {
      get: (errorHandler, closeHandler) => {
        return Promise.resolve(
          createConnection(connection, errorHandler, closeHandler)
        );
      }
    }
  });
}

function connectToMonacoServer() {
  const webSocket = new WebSocket("ws://localhost:8000");
  listen({
    webSocket: webSocket,
    onConnection: connection => {
      var languageClient = createLanguageClient(connection);
      var disposable = languageClient.start();
      connection.onClose(function() {
        return disposable.dispose();
      });
      connection.onError(function(error) {
        console.log(error);
      });
    }
  });
}

const editorService = {
  _editor: null,

  currentModel: {},
  data: {},

  initialize(el) {
    if (!this._editor) {
      const editor = monaco.editor.create(el, {
        model: null,
        language: "python",
        theme: "vs-dark",
        minimap: false,
        fontSize: 14,
        readOnly: !this.canEdit,
        automaticLayout: true
      });
      MonacoServices.install(monaco);
      connectToMonacoServer();
      this._editor = editor;
      console.log(editor);
    }
    this.data = {};
  },

  setModel(key, text, readOnly) {
    // TODO: save state of current model
    if (
      this.currentModel.model &&
      this.currentModel.model === this._editor.getModel() &&
      this.currentModel.key in this.data
    ) {
      this.data[this.currentModel.key].state = this._editor.saveViewState();
    }

    // cretae a new model if one does not already exist
    if (!this.data[key]) {
      this.data[key] = {
        model: monaco.editor.createModel(text, "python"),
        state: null,
        key: key
      };
    }

    this._editor.updateOptions({ readOnly });
    this._editor.setModel(this.data[key].model);
    this._editor.restoreViewState(this.data[key].state);
    this._editor.focus();
    this.currentModel = this.data[key];
  },

  setCallback(callback) {
    this._editor.onDidChangeModelContent(() => {
      callback();
    });
  },

  getValue() {
    return this._editor.getValue();
  },
  setReadOnly(readOnly) {
    this._editor.updateOptions({ readOnly });
  }
};

export default async (ctx, inject) => {
  inject("editor", editorService);
};
