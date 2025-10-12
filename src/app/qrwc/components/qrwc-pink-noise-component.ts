import { inject, Signal } from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';

export class QrwcPinkNoiseComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings (full control binding objects)
  private readonly _level;
  private readonly _mute;

  /** Pink Noise Component */
  /** @param componentName - The name of the Q-Sys component. */
  constructor(private readonly componentName: string) {
    this._level = this.qrwc.bindControl(this.componentName, 'level', 0);
    this._mute = this.qrwc.bindControl(this.componentName, 'mute', false);
  }

  /** The output level of the pink noise (usually in dB or scale 0-1). */
  get level(): Signal<number> {
    return this._level.value;
  }

  /** The mute state of the pink noise (true = muted). */
  get mute(): Signal<boolean> {
    return this._mute.bool;
  }

  /** Sets the output level of the pink noise generator (-100 to 20). **/
  setLevel(value: number): void {
    this._level.setValue(value);
  }

  /** Sets the mute state of the pink noise (true = muted). */
  setMute(state: boolean): void {
    this._mute.setValue(state);
  }

  /** Toggles the mute state of the pink noise generator. */
  toggleMute(): void {
    this._mute.setValue(!this._mute());
  }
}
