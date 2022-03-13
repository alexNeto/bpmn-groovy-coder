import { Memento } from "vscode";
import { Literals } from "../enum/literals.enum";
import { StorageKeys } from "../enum/storage-keys.enum";
import { LocalStorageService } from "./local-storage.service";

export class CamundaUrlService {
  private localStorage: LocalStorageService;

  constructor(private context: Memento) {
    this.localStorage = new LocalStorageService(this.context);
  }

  public getFirstUrl(): string {
    const first = this.getValues()[0];
    if (first === Literals.newUrl) {
      return first.replace("$(ports-forward-icon)", "");
    }
    return first;
  }

  public getValues(): string[] {
    const list: string[] =
      this.localStorage.getValue(StorageKeys.deploymentUrl) || [];

    this.setInitialValues(list);

    return list;
  }

  private setInitialValues(list: string[]) {
    if (list.indexOf(Literals.newUrl) === -1) {
      list.push(Literals.newUrl);
    }

    if (list.indexOf(Literals.cleanUrlList) === -1) {
      list.push(Literals.cleanUrlList);
    }
  }

  public clean() {
    const newList: string[] = [];
    this.setInitialValues(newList);
    this.localStorage.setValue(StorageKeys.deploymentUrl, newList);
  }

  public select(url: string) {
    const list = this.getValues();
    if (url !== Literals.newUrl && url !== Literals.cleanUrlList) {
      list.splice(list.indexOf(url), 1);
      list.unshift(url);
    }

    this.localStorage.setValue(StorageKeys.deploymentUrl, list);
  }
}
