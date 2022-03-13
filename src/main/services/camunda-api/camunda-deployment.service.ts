import { CamundaApi } from "../../enum/camunda-api.enum";
import { MimeType } from "../../enum/mime-type.enum";
import { HttpService } from "../http.service";
import { CreateRequestBody } from "./interfaces/create/create-request-body.interface";

const FORM_DATA = require("form-data");

export class CamundaDeploymentService {
  constructor(private httpService: HttpService) {}

  public create(url: string, createRequest: CreateRequestBody): Promise<any> {
    const form = new FORM_DATA();

    form.append("deployment-name", createRequest.deploymentName);

    createRequest.bpmnFiles.forEach((i) => {
      form.append(i.fileName, i.fileContent, {
        filename: i.fileName,
        contentType: MimeType.textXml,
      });
    });

    if (createRequest.enableDuplicateFiltering) {
      form.append(
        "enable-duplicate-filtering",
        createRequest.enableDuplicateFiltering
      );
    }

    if (createRequest.deployChangedOnly) {
      form.append("deploy-changed-only", createRequest.deployChangedOnly);
    }

    if (createRequest.deploymentSource) {
      form.append("deployment-source", createRequest.deploymentSource);
    }

    if (createRequest.deploymentActivationTime) {
      form.append(
        "deployment-activation-time",
        createRequest.deploymentActivationTime
      );
    }

    if (createRequest.tenantId) {
      form.append("tenant-id", createRequest.tenantId);
    }

    return this.httpService.post(`${url}/${CamundaApi.createDeployment}`, form);
  }
}
