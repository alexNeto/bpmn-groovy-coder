import { commands, ExtensionContext, TextDocument, window } from "vscode";
import { Actions } from "./main/enum/actions.enum";
import { StorageKeys } from "./main/enum/storage-keys.enum";
import { BPMNMetadataService } from "./main/services/bpmn-metadata.service";
import { CamundaDeploymentService } from "./main/services/camunda-api/camunda-deployment.service";
import { CreateRequestBody } from "./main/services/camunda-api/interfaces/create/create-request-body.interface";
import { HashService } from "./main/services/hash.service";
import { HttpService } from "./main/services/http.service";
import { LocalStorageService } from "./main/services/local-storage.service";
import { TextDocumentService } from "./main/services/text-document.service";

export function activate(context: ExtensionContext) {
  const textDocumentService = new TextDocumentService();
  const hashService = new HashService();
  const bpmnMetadataService = new BPMNMetadataService();
  const localStorage = new LocalStorageService(context.workspaceState);
  const httpService = new HttpService();
  const camundaDeploymentService = new CamundaDeploymentService(httpService);

  let disposable = commands.registerCommand(Actions.deploy, () => {
    window
      .showInputBox({
        placeHolder: "Camunda URL",
        value: localStorage.getValue(StorageKeys.deploymentUrl),
      })
      .then(
        (camundaUrl) => {
          textDocumentService.openActiveTextDocument().then(
            (textDocument: TextDocument) => {
              const text = bpmnMetadataService.getProcessId(
                textDocument.getText()
              );

              const createRequest: CreateRequestBody = {
                deploymentName: hashService.withHash(text || "new deploy"),
                bpmnFiles: [
                  {
                    fileName: bpmnMetadataService.getFileName(textDocument),
                    fileContent: textDocument.getText(),
                  },
                ],
              };
              camundaDeploymentService.create(camundaUrl!, createRequest);
            },
            (error: any) => {
              console.error(error);
              debugger;
            }
          );
          localStorage.setValue(StorageKeys.deploymentUrl, camundaUrl);
        },
        (err) => {
          window.showErrorMessage(`Error ${err}`);
        }
      );
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
