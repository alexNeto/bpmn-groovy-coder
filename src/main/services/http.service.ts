import fetch from "node-fetch";
import { window } from "vscode";

export class HttpService {
  constructor() {}

  public post(url: string, payload: any) {
    fetch(url, {
      method: "POST",
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.name) {
          window.showInformationMessage(
            `${data.name} was deployed succesfully`
          );
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        console.error(err);
        window.showErrorMessage(`Error! Check if the URL is correct`);
      });
  }
}
