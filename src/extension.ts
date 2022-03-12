import { commands, ExtensionContext } from "vscode";
import { DeployCommand } from "./main/commands/deploy.command";
import { Actions } from "./main/enum/actions.enum";

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand(Actions.deploy, () =>
    new DeployCommand(context.workspaceState).deploy()
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
