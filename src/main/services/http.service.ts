import fetch from "node-fetch";

export class HttpService {
  constructor() {}

  public post(url: string, payload: any): Promise<any> {
    return fetch(url, {
      method: "POST",
      body: payload,
    }).then((response) => response.json());
  }
}
