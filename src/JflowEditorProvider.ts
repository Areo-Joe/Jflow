import * as vscode from "vscode"
import JflowScript from "./JflowWebview/JflowScript"

type WebviewMessage = {
    action: "update nodes",
    nodes: object
} | {
    action: "update edges",
    edges: object
} | {
    action: "remove node" | "remove edge",
    id: string
}

export class JflowEditorProvider implements vscode.CustomTextEditorProvider {
    // register a new custom editor
    public static register(context: vscode.ExtensionContext) {
        let provider = new JflowEditorProvider(context);
        let providerRegistration = vscode.window.registerCustomEditorProvider(
            JflowEditorProvider.viewType,
            provider,
            { supportsMultipleEditorsPerDocument: true });
        return providerRegistration;
    }

    // same as in package.json
    private static readonly viewType = "jflow.view";

    public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {
        let debugPanel = vscode.window.createOutputChannel("Jflow Debug");
        debugPanel.show();

        // where react and other scripts that control the webview comes in
        let html = getHtml();

        webviewPanel.webview.options = {
            enableScripts: true,
        }

        let lastRemove: null | Thenable<any> = null;

        // receive message from webview
        webviewPanel.webview.onDidReceiveMessage((e: WebviewMessage) => {
            if (e.action === "update nodes") {
                let parsedDocument = JSON.parse(document.getText());
                if (JSON.stringify(parsedDocument.nodes) === JSON.stringify(e.nodes)) {
                    return;
                }
                parsedDocument.nodes = e.nodes;

                let edit = new vscode.WorkspaceEdit();
                edit.replace(
                    document.uri,
                    new vscode.Range(0, 0, document.lineCount, 0),
                    JSON.stringify(parsedDocument, null, 4)
                );
                vscode.workspace.applyEdit(edit);
            } else if (e.action === "update edges") {
                let parsedDocument = JSON.parse(document.getText());
                parsedDocument.edges = e.edges;

                let edit = new vscode.WorkspaceEdit();
                edit.replace(
                    document.uri,
                    new vscode.Range(0, 0, document.lineCount, 0),
                    JSON.stringify(parsedDocument, null, 4)
                );
                vscode.workspace.applyEdit(edit);
            } else if (e.action === "remove edge" || e.action === "remove node") {
                let removeIt = () => {
                    let parsedDocument = JSON.parse(document.getText());
                    let targets = e.action === "remove edge" ? parsedDocument.edges : parsedDocument.nodes;

                    let index = targets.findIndex((t: { id: string }) => t.id === e.id);
                    targets.splice(index, 1);

                    let edit = new vscode.WorkspaceEdit();
                    edit.replace(
                        document.uri,
                        new vscode.Range(0, 0, document.lineCount, 0),
                        JSON.stringify(parsedDocument, null, 4)
                    );
                    lastRemove = vscode.workspace.applyEdit(edit);
                }
                if (lastRemove) {
                    lastRemove.then(() => {
                        removeIt();
                    });
                    return;
                } else {
                    removeIt();
                }
            }
        })

        webviewPanel.onDidChangeViewState(e => {
            if (e.webviewPanel.visible) {
                updateWebview();
            }
        })

        // whenever document changes, notify the webview to sync UI with document
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                updateWebview();
            }
        });

        // make sure to dispose the listener when our editor is closed.
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        webviewPanel.webview.html = html;

        updateWebview();

        function updateWebview() {
            let text = document.getText();
            if (checkValidJSON(text)) {
                webviewPanel.webview.postMessage({
                    text,
                    error: false
                });
            } else {
                webviewPanel.webview.postMessage({
                    text: "{}",
                    error: true
                });
            }
        }
        function checkValidJSON(str: string) {
            let ret = true;
            try {
                JSON.parse(str);
            } catch (e) {
                ret = false;
            }
            return ret;
        }
    }

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }
}

function getHtml() {
    return `
    <!DOCTYPE html>
    <html>
        <body>
            <div id="app">
            </div>
            <script>
                ${JflowScript}
            </script>
            <style>
                html, body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }
                #app {
                    overflow: hidden;
                }
            </style>
        </body>
    </html>
    `
}