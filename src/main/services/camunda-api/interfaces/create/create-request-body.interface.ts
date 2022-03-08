export interface CreateRequestBody {
  deploymentName: string;
  enableDuplicateFiltering?: any;
  deployChangedOnly?: any;
  deploymentSource?: any;
  deploymentActivationTime?: any;
  tenantId?: any;
  bpmnFiles: BPMNFile[];
}

export interface BPMNFile {
  fileName: string;
  fileContent: string;
}
