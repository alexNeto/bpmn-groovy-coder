import {
  InputBoxOptions,
  Memento,
  QuickPickOptions,
  TextDocument,
  window
} from "vscode";
import { ErrorsMessage } from "../enum/errors-message.enum";
import { Literals } from "../enum/literals.enum";
import { BPMNMetadataService } from "../services/bpmn-metadata.service";
import { CamundaDeploymentService } from "../services/camunda-api/camunda-deployment.service";
import { CreateRequestBody } from "../services/camunda-api/interfaces/create/create-request-body.interface";
import { CamundaUrlService } from "../services/camunda-url.service";
import { HashService } from "../services/hash.service";
import { HttpService } from "../services/http.service";
import { TextDocumentService } from "../services/text-document.service";

export class DeployCommand {
  private camundaUrlservice: CamundaUrlService;
  private textDocumentService: TextDocumentService;
  private hashService: HashService;
  private bpmnMetadataService: BPMNMetadataService;
  private httpService: HttpService;
  private camundaDeploymentService: CamundaDeploymentService;

  constructor(private context: Memento) {
    this.camundaUrlservice = new CamundaUrlService(this.context);
    this.textDocumentService = new TextDocumentService();
    this.hashService = new HashService();
    this.bpmnMetadataService = new BPMNMetadataService();
    this.httpService = new HttpService();
    this.camundaDeploymentService = new CamundaDeploymentService(
      this.httpService
    );
  }

  public deploy() {
    const items: string[] = this.camundaUrlservice.getValues();
    const options: QuickPickOptions = {
      title: Literals.camundaUrlPlaceholder,
      placeHolder: this.camundaUrlservice.getFirstUrl(),
      ignoreFocusOut: true,
    };
    window.showQuickPick(items, options).then(
      (camundaUrl) => this.camundaUrlHandler(camundaUrl),
      (error) => this.errorHandler(error)
    );
  }

  public deployNewValue() {
    const options: InputBoxOptions = {
      title: Literals.camundaUrlPlaceholder,
      placeHolder: Literals.camundaUrlPlaceholder,
      ignoreFocusOut: true,
    };
    window.showInputBox(options).then(
      (camundaUrl) => this.camundaUrlHandler(camundaUrl!),
      (error) => this.errorHandler(error)
    );
  }

  private camundaUrlHandler(camundaUrl?: string) {
    if (this.isCamundaUrlNotEmpty(camundaUrl)) {
      if (camundaUrl === Literals.newUrl) {
        this.deployNewValue();
      } else if (camundaUrl === Literals.cleanUrlList) {
        this.cleanCamundaUrl();
      } else if (this.isCamundaUrlValid(camundaUrl!)) {
        this.textDocumentService.openActiveTextDocument().then(
          (textDocument: TextDocument) => {
            this.makeDeployment(camundaUrl!, textDocument);
          },
          (error) => this.errorHandler(error)
        );
      }
    } else {
      this.errorHandler(ErrorsMessage.deploymentError);
    }
  }

  private cleanCamundaUrl() {
    this.camundaUrlservice.clean();
    window.showInformationMessage("Camunda url list was deleted succesfull");
  }

  private isCamundaUrlValid(url: string): boolean {
    if (url.match(/(http|https):\/\//) === null) {
      this.errorHandler(ErrorsMessage.missingHttpProtocol);
      return false;
    }

    if (url.lastIndexOf("/") === url.length - 1) {
      this.errorHandler(ErrorsMessage.slashEndingUrl);
      return false;
    }
    return true;
  }

  private isCamundaUrlNotEmpty(camundaUrl?: string): boolean {
    return camundaUrl !== null && camundaUrl !== undefined && camundaUrl !== "";
  }

  private makeDeployment(camundaUrl: string, textDocument: TextDocument) {
    const processId = this.getProcessId(textDocument);
    const deploymentPayload = this.getCreateDeploymentPayload(
      processId,
      textDocument
    );

    this.camundaDeploymentService
      .create(camundaUrl, deploymentPayload)
      .then((data) => this.camundaDeploymentResponseHandler(camundaUrl, data))
      .catch((_) => {
        window.showErrorMessage(ErrorsMessage.requestError);
        throw new Error(ErrorsMessage.requestError);
      });
  }

  private camundaDeploymentResponseHandler(camundaUrl: string, data: any) {
    if (data.name) {
      window.showInformationMessage(`${data.name} was deployed succesfully`);
      this.camundaUrlservice.select(camundaUrl!);
    } else {
      throw new Error();
    }
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
    window.showErrorMessage(`${error}`);
  }
}
