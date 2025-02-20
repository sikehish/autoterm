import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand("autoterm.openWebview", () => {
        const panel = vscode.window.createWebviewPanel(
            "autoterm",
            "AutoTerm | Configure Project",
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getWebviewContent(context);

        panel.webview.onDidReceiveMessage(
            (message) => {
                if (message.command === "getWorkspaceFolders") {
                    const workspaceFolders = vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath) || [];
                    
                    panel.webview.postMessage({
                        command: "workspaceFolders",
                        workspaceFolders: workspaceFolders
                    });
                }
                else if (message.command === "showError") {
                    vscode.window.showErrorMessage(message.message);
                }
                else if (message.command === "saveConfig") {
                    const { projectPath, enableLogging, envs, defaultEnv } = message.data;
                    if (envs.length === 0) {
                        vscode.window.showErrorMessage("At least one environment is required.");
                        return;
                    }

                    const configData = {
                        projectPath,
                        enableLogging,
                        environments: envs,
                        defaultEnvironment: defaultEnv,
                    };

                    console.log("Configuration Saved:", configData);
                    vscode.window.showInformationMessage("Configuration saved successfully!");
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
    let html = fs.readFileSync(
        path.join(context.extensionPath, "src", "webview", "index.html"),
        "utf8"
    );
    return html;
}
