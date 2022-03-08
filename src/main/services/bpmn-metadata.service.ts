import { TextDocument } from "vscode";

export class BPMNMetadataService {
  constructor() {}

  public getProcessId(fileContent: string): string {
    return this.clean(fileContent.match(/process id=\"\w+\"/)!.toString());
  }

  public getFilePath(textDocument: TextDocument): string {
    return textDocument.uri.fsPath;
  }

  public getFileName(textDocument: TextDocument): string {
    return this.getFilePath(textDocument).split("/").pop()!;
  }

  private clean(text: string): string {
    return text.replace('process id="', "").replace('"', "");
  }
}
