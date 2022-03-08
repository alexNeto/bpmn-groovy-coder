
export class HashService {
  constructor() {}

  public getNewHash(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  public withHash(text: string): string {
    return `${text} - ${this.getNewHash()}`;
  }
}
