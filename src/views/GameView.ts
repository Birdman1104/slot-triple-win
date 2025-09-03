import { lego } from "@armathai/lego";
import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import { createApp } from "vue";
import { getGameViewGridConfig } from "../configs/gridConfigs/gameViewGC";
import { GameModelEvents } from "../events/ModelEvents";
import type { SlotMachineModel } from "../models/SlotMachineModel";
import UI from "../ui/components/menu/UI.vue";
import { delayRunnable } from "../utils/Utils";
import { SlotMachineView } from "./SlotMachineView";

export class GameView extends PixiGrid {
  private slotMachine: SlotMachineView | null = null;

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
    if (slotMachine) {
      this.buildSlotMachine(slotMachine);

      delayRunnable(0.01, () => {
        const uiRoot = document.createElement("div");
        document.body.appendChild(uiRoot);
        createApp(UI).mount(uiRoot);
      });
    } else {
      this.destroySlotMachine();
    }
  }

  private buildSlotMachine(slotMachine: SlotMachineModel): void {
    this.slotMachine = new SlotMachineView(slotMachine);
    this.setChild("slot_machine", this.slotMachine);
    this.rebuild();
  }

  private destroySlotMachine(): void {
    this.slotMachine?.destroy();
  }
}
