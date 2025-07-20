import { lego } from "@armathai/lego";

export const getUUID = (() => {
  let i = 0;
  return () => `${++i}`;
})();

export class ObservableModel {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected __name__: string;
  protected id: string;

  public constructor(name: string) {
    this.__name__ = name;
    this.id = getUUID();
  }

  public get uuid(): string {
    return this.id;
  }

  protected setCustomID(id: string): void {
    this.id = id;
  }

  protected makeObservable(...props: string[]): void {
    lego.observe.makeObservable(this, ...props);
  }

  protected createObservable(property: string, value: any): void {
    lego.observe.createObservable(this, property, value);
  }

  protected removeObservable(...properties: string[]): void {
    lego.observe.removeObservable(this, ...properties);
  }

  protected initialize(...args: any[]): void {
    void args;
  }

  public destroy(): void {
    //
  }
}
