import { commands, ExtensionContext } from "vscode";
import { DeployCommand } from "./main/commands/deploy.command";
import { Actions } from "./main/enum/actions.enum";

export function activate(context: ExtensionContext) {
  const deployCommand = new DeployCommand(context.workspaceState);

  let disposable = commands.registerCommand(
    Actions.deploy,
    deployCommand.deploy
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
