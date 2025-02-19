import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand("autoterm.openWebview", () => {
        const panel = vscode.window.createWebviewPanel(
            "autoterm",
            "AutoTerm",
            vscode.ViewColumn.One,
            { enableScripts: true } 
        );

        const scriptUri = panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, "dist", "script.js"))
        );

        const styleUri = panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, "src", "webview", "styles.css"))
        );

        panel.webview.html = getWebviewContent(context);

        panel.webview.onDidReceiveMessage(
            (message) => {
                if (message.command === "saveTerminals") {
                  if(message.data.length === 0)  vscode.window.showErrorMessage("CAN'T HAVE 0 TERMINALS!")
                  else vscode.window.showInformationMessage(`Saved ${message.data.length} ${((message.data.length)===1) ?'terminal!' :  'terminals!'} `);
                    console.log("Received Terminals Data:", message.data);
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

function getWebviewContent(context: vscode.ExtensionContext): string {
    const html_to_send = fs.readFileSync(
        path.join(context.extensionPath, "src", "webview", "index.html"),
        "utf8"
    );
    return html_to_send;
}
