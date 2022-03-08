import { TextDocument, TextEditor, window, workspace } from "vscode";

export class TextDocumentService {
  constructor() {}

  public getActiveTextEditor(): TextEditor {
    return window.activeTextEditor!;
  }

  public openActiveTextDocument(): Thenable<TextDocument> {
    return this.openTextDocument(this.getActiveTextEditor());
  }

  public openTextDocument(textEditor: TextEditor): Thenable<TextDocument> {
    return workspace.openTextDocument(textEditor.document.uri);
  }
}
