import { Memento, TextDocument, window } from "vscode";
import { StorageKeys } from "../enum/storage-keys.enum";
import { BPMNMetadataService } from "../services/bpmn-metadata.service";
import { CamundaDeploymentService } from "../services/camunda-api/camunda-deployment.service";
import { CreateRequestBody } from "../services/camunda-api/interfaces/create/create-request-body.interface";
import { HashService } from "../services/hash.service";
import { HttpService } from "../services/http.service";
import { LocalStorageService } from "../services/local-storage.service";
import { TextDocumentService } from "../services/text-document.service";

export class DeployCommand {
  private localStorage: LocalStorageService;
  private textDocumentService: TextDocumentService;
  private hashService: HashService;
  private bpmnMetadataService: BPMNMetadataService;
  private httpService: HttpService;
  private camundaDeploymentService: CamundaDeploymentService;

  constructor(private context: Memento) {
    this.localStorage = new LocalStorageService(context);
    this.textDocumentService = new TextDocumentService();
    this.hashService = new HashService();
    this.bpmnMetadataService = new BPMNMetadataService();
    this.httpService = new HttpService();
    this.camundaDeploymentService = new CamundaDeploymentService(
      this.httpService
    );
  }

  public deploy() {
    window
      .showInputBox({
        placeHolder: "Camunda URL",
        value: this.localStorage.getValue(StorageKeys.deploymentUrl),
      })
      .then(this.camundaUrlHandler, this.errorHandler);
  }

  private camundaUrlHandler(camundaUrl?: string) {
    this.textDocumentService
      .openActiveTextDocument()
      .then((textDocument: TextDocument) => {
        this.makeDeployment(camundaUrl!, textDocument);
      }, this.errorHandler);
    this.localStorage.setValue(StorageKeys.deploymentUrl, camundaUrl);
  }

  private makeDeployment(camundaUrl: string, textDocument: TextDocument) {
    const processId = this.getProcessId(textDocument);
    const deploymentPayload = this.getCreateDeploymentPayload(
      processId,
      textDocument
    );

    this.camundaDeploymentService.create(camundaUrl, deploymentPayload);
  }

  private getProcessId(textDocument: TextDocument): string {
    return this.bpmnMetadataService.getProcessId(textDocument.getText());
  }
  private getCreateDeploymentPayload(
    processId: string,
    textDocument: TextDocument
  ): CreateRequestBody {
    return {
      deploymentName: this.hashService.withHash(processId || "new deploy"),
      bpmnFiles: [
        {
          fileName: this.bpmnMetadataService.getFileName(textDocument),
          fileContent: textDocument.getText(),
        },
      ],
    };
  }

  private errorHandler(error: any) {
    window.showErrorMessage(`Error ${error}`);
  }
}
