import { Howl } from "howler";
import { SOUNDS } from "../assets/assetsNames/audio";

const VOLUMES = {
  //
};

class SoundControl {
  private sounds: { [key: string]: Howl };
  private isMutedFromIcon = false;

  public constructor() {
    this.sounds = {};
  }

  public loadSounds(): void {
    SOUNDS.forEach(({ name, path }) => {
      this.sounds[name] = new Howl({
        src: path,
        volume: VOLUMES[name as keyof typeof VOLUMES] ?? 1,
        loop: name === "background",
      });
    });
  }

  private mute(): void {
    this.isMutedFromIcon = true;
    for (const [key, value] of Object.entries(this.sounds)) {
      value.volume(0);
    }
  }

  private unmute(): void {
    this.isMutedFromIcon = false;
    for (const [key, value] of Object.entries(this.sounds)) {
      value.volume(1);
    }
  }

  private focusChange(outOfFocus: boolean): void {
    if (this.isMutedFromIcon) return;
    for (const [key, value] of Object.entries(this.sounds)) {
      value.volume(outOfFocus ? 0 : VOLUMES[key as keyof typeof VOLUMES] ?? 1);
    }
  }
}

const SoundController = new SoundControl();
export default SoundController;
