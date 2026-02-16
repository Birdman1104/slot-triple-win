import { lego } from "@armathai/lego";
import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import { getGameViewGridConfig } from "../configs/gridConfigs/gameViewGC";
import { dockLeftShadowConfig, dockRightShadowConfig, leafConfig } from "../configs/spritesConfig";
import { GameModelEvents } from "../events/ModelEvents";
import type { SlotMachineModel } from "../models/SlotMachineModel";
import { makeSprite } from "../utils/Utils";
import { DockView } from "./DockView";
import { SlotMachineView } from "./SlotMachineView";

export class GameView extends PixiGrid {
  private slotMachine: SlotMachineView | null = null;
  private dock!: DockView;

  constructor() {
    super();

    lego.event.on(GameModelEvents.SlotMachineUpdate, this.onSlotMachineUpdate, this);
  }

  public destroy(): void {
    lego.event.off(GameModelEvents.SlotMachineUpdate, this.onSlotMachineUpdate, this);
    super.destroy();
  }

  public getGridConfig(): ICellConfig {
    return getGameViewGridConfig();
  }

  public rebuild(): void {
    super.rebuild(this.getGridConfig());
  }

  private onSlotMachineUpdate(slotMachine: SlotMachineModel | null): void {
    if (slotMachine) {
      this.dock = new DockView();
      this.setChild("dock", this.dock);

      // They are sticked to the corners of the screen, with their own scaling logic
      const leftShadow = makeSprite(dockLeftShadowConfig());
      this.setChild("left_shadow", leftShadow);
      const rightShadow = makeSprite(dockRightShadowConfig());
      this.setChild("right_shadow", rightShadow);
      const leaf = makeSprite(leafConfig());
      this.setChild("leaf", leaf);

      this.slotMachine = new SlotMachineView(slotMachine);
      this.setChild("slot_machine", this.slotMachine);

      this.rebuild();
    } else {
      this.destroySlotMachine();
    }
  }

  private destroySlotMachine(): void {
    this.slotMachine?.destroy();
  }
}
