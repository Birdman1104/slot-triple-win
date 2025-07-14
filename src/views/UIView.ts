import { Container } from "pixi.js";

export class UIView extends Container {
  constructor() {
    super();
    this.build();
  }

  public rebuild(): void {}

  private build(): void {}
}
