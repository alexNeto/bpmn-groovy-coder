// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, ExtensionContext, window } from "vscode";
import { Actions } from "./main/enum/actions.enum";
import { StorageKeys } from "./main/enum/storage-keys.enum";
import { LocalStorageService } from "./main/services/local-storage.service";

export function activate(context: ExtensionContext) {

  let disposable = commands.registerCommand(Actions.deploy, () => {
    let localStorage = new LocalStorageService(context.workspaceState);

    window
      .showInputBox({
        placeHolder: "Camunda URL",
        value: localStorage.getValue(StorageKeys.deploymentUrl),
      })
      .then(
        (result) => {
          localStorage.setValue(StorageKeys.deploymentUrl, result);
          window.showInformationMessage(
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          );
        },
        (err) => {
          window.showErrorMessage(
            `AAAAAAA${err}AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`
          );
        }
      );
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
