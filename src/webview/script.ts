declare function acquireVsCodeApi(): any;

document.addEventListener("DOMContentLoaded", () => {
    const vscode = acquireVsCodeApi(); 
    const button = document.getElementById("clickMe");
    if (button) {
        button.addEventListener("click", () => {
            button.innerText = "HAHAHAHAHHAHA";
            setTimeout(() => {
                button.innerText = "Click Me";
            }, 2000);
            vscode.postMessage({ command: "showAlert", text: "Hello from AutoTerm!" });
        });
    }
});
