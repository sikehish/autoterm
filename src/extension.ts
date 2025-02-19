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
  
      panel.webview.html = getWebviewContent(scriptUri, styleUri);
        panel.webview.onDidReceiveMessage(
        (message) => {
          if (message.command === "showAlert") {
            vscode.window.showInformationMessage(message.text);
          }
        },
        undefined,
        context.subscriptions
      );
    });
    context.subscriptions.push(disposable);
  }
  

export function deactivate() {}

function getWebviewContent(scriptUri: vscode.Uri, styleUri: vscode.Uri): string {
  const html_to_send = fs.readFileSync(
   '/Users/afnan/Developer/autoterm/src/webview/index.html',
    'utf8'
  );
  return html_to_send;
}
