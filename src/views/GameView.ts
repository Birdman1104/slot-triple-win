import { lego } from "@armathai/lego";
import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import { getGameViewGridConfig } from "../configs/gridConfigs/gameViewGC";
import { GameModelEvents } from "../events/ModelEvents";
import type { SlotMachineModel } from "../models/SlotMachineModel";
import { SlotMachine } from "./SlotMachineView";

export class GameView extends PixiGrid {
  private slotMachine: SlotMachine | null = null;

  constructor() {
    super();

    lego.event.on(GameModelEvents.SlotMachineUpdate, this.onSlotMachineUpdate, this);
    this.build();
  }

  public getGridConfig(): ICellConfig {
    return getGameViewGridConfig();
  }

  public rebuild(): void {
    super.rebuild(this.getGridConfig());
  }

  private build() {
    //
  }

  private onSlotMachineUpdate(slotMachine: SlotMachineModel | null): void {
    slotMachine ? this.buildSlotMachine(slotMachine) : this.destroySlotMachine();
  }

  private buildSlotMachine(slotMachine: SlotMachineModel): void {
    this.slotMachine = new SlotMachine(slotMachine);
    this.setChild("slot_machine", this.slotMachine);
  }

  private destroySlotMachine(): void {
    this.slotMachine?.destroy();
  }
}
