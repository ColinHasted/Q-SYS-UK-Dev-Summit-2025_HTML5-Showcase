import {
  computed,
  effect,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';

export enum FilterType {
  Parametric = 1,
  LowShelf = 2,
  HighShelf = 3,
}

export interface FrequencyResponse {
  Frequency: number;
  Magnitude: number;
  Phase: number;
}

export interface EQBand {
  // Internal bindings (stored but not meant for external access)
  _bypassBinding: any;
  _frequencyBinding: any;
  _gainBinding: any;
  _bandwidthBinding: any;
  _qBinding: any;
  _typeBinding: any;

  // Public signal properties
  Bypass: Signal<boolean>;
  Frequency: Signal<number>;
  FrequencyPosition: Signal<number>;
  Gain: Signal<number>;
  Bandwidth: Signal<number>;
  BandwidthPosition: Signal<number>;
  Q: Signal<number>;
  QPosition: Signal<number>;
  Type: Signal<FilterType>;
}

export class QrwcParametricEqualizerComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings
  private readonly _bypassBinding;
  private readonly _gainBinding;
  private readonly _invertBinding;
  private readonly _muteBinding;

  /** The bypass state of the Parametric EQ Component. */
  get bypass(): Signal<boolean> {
    return this._bypassBinding.bool;
  }

  /** The output gain for all channels in dB (-100 to 20 dB). */
  get gain(): Signal<number> {
    return this._gainBinding.value;
  }

  /** The polarity of the output signal for all channels. */
  get invert(): Signal<boolean> {
    return this._invertBinding.bool;
  }

  /** The output mute for all channels. */
  get mute(): Signal<boolean> {
    return this._muteBinding.bool;
  }

  public readonly EQBands: EQBand[] = [];

  public readonly bands: number;
  public readonly ActiveEQBands: WritableSignal<EQBand[]> = signal([]);
  private debounceTimeout: any;

  constructor(private componentName: string) {
    // Update bindings with actual component name
    this._bypassBinding = this.qrwc.bindControl(componentName, 'bypass', false);
    this._gainBinding = this.qrwc.bindControl(componentName, 'master.gain', 0);
    this._invertBinding = this.qrwc.bindControl(componentName, 'invert', false);
    this._muteBinding = this.qrwc.bindControl(componentName, 'mute', false);

    // Default to 7 bands if component not available
    this.bands = 7; // TODO: Detect actual band count from component

    this.initialiseSignals();

    // Effect runs after EQBands are initialized
    effect(() => {
      // Check if array is populated before accessing
      if (!this.EQBands[0]?.Frequency() ) return;

      for (let i = 0; i < this.bands; i++) {
        this.EQBands[i].Frequency();
        this.EQBands[i].Gain();
        this.EQBands[i].Bandwidth();
        this.EQBands[i].Q();
        this.EQBands[i].Type();
        this.EQBands[i].Bypass();
      }
      this.ActiveEQBands.set(this.EQBands.filter((band) => !band.Bypass()));
    });
  }

  private initialiseSignals() {
    for (let i = 1; i <= this.bands; i++) {
      const bypassBinding = this.qrwc.bindControl(
        this.componentName,
        'bypass.' + i,
        false
      );
      const frequencyBinding = this.qrwc.bindControl(
        this.componentName,
        'frequency.' + i,
        1000,
        true
      );
      const gainBinding = this.qrwc.bindControl(
        this.componentName,
        'gain.' + i,
        0
      );
      const bandwidthBinding = this.qrwc.bindControl(
        this.componentName,
        'bandwidth.' + i,
        1,
        true
      );
      const qBinding = this.qrwc.bindControl(
        this.componentName,
        'q.factor.' + i,
        1
      );
      const typeBinding = this.qrwc.bindControl(
        this.componentName,
        'type.' + i,
        FilterType.Parametric
      );

      this.EQBands[i - 1] = {
        _bypassBinding: bypassBinding,
        _frequencyBinding: frequencyBinding,
        _gainBinding: gainBinding,
        _bandwidthBinding: bandwidthBinding,
        _qBinding: qBinding,
        _typeBinding: typeBinding,

        Bypass: bypassBinding.bool,
        Frequency: frequencyBinding.value,
        FrequencyPosition: frequencyBinding.position,
        Gain: gainBinding.value,
        Bandwidth: bandwidthBinding.value,
        BandwidthPosition: bandwidthBinding.position,
        Q: qBinding.value,
        QPosition: qBinding.position,
        Type: typeBinding.value as Signal<FilterType>,
      };
    }
  }

  public toggleBypass(band: number): void {
    const currentValue = this.EQBands[band].Bypass();
    this.EQBands[band]._bypassBinding.setValue(!currentValue);
  }

  public setFilterType(band: number, type: FilterType): void {
    this.EQBands[band]._typeBinding.setValue(type);
  }

  public setGain(band: number, value: number): void {
    this.EQBands[band]._gainBinding.setValue(value);
  }

  public setFrequency(band: number, value: number): void {
    this.EQBands[band]._frequencyBinding.setValue(value);
  }

  public setFrequencyPosition(band: number, value: number): void {
    this.EQBands[band]._frequencyBinding.setPosition(value);
  }

  public setBandwidth(band: number, value: number): void {
    this.EQBands[band]._bandwidthBinding.setValue(value);
  }

  public setBandwidthPosition(band: number, value: number): void {
    this.EQBands[band]._bandwidthBinding.setPosition(value);
  }

  public setQ(band: number, value: number): void {
    this.EQBands[band]._qBinding.setValue(value);
  }

  public setQPosition(band: number, value: number): void {
    this.EQBands[band]._qBinding.setPosition(value);
  }

  /**
   * Adjusts the output gain for all channels. The range depends on the Min Gain and Max Gain settings in the Properties.
   * @param dB - The new value of the gain in dB (-100 to 20 dB).
   */
  SetGain(dB: number): void {
    if (dB > -101 && dB < 21) this._gainBinding.setValue(dB);
  }

  /**
   * Bypasses the Parametric EQ Component for all channels.
   * @param state - The new state of the Bypass button (true = bypassed, false = not bypassed).
   */
  SetBypass(state: boolean): void {
    this._bypassBinding.setValue(state);
  }

  /**
   * Toggle the Bypass button.
   */
  ToggleBypass(): void {
    this.SetBypass(!this.bypass());
  }

  /**
   * Inverts the polarity of the output signal for all channels.
   * @param state - The new state of the Invert button (true = inverted, false = not inverted).
   */
  SetInvert(state: boolean): void {
    this._invertBinding.setValue(state);
  }

  /**
   * Toggle the Invert button.
   */
  ToggleInvert(): void {
    this.SetInvert(!this.invert());
  }

  /**
   * Mutes the output for the all channels.
   * @param state - The new state of the Mute button (true = muted, false = not muted).
   */
  SetMute(state: boolean): void {
    this._muteBinding.setValue(state);
  }

  /**
   * Toggle the Mute button.
   */
  ToggleMute(): void {
    this.SetMute(!this.mute());
  }

  public dispose() {
    // Clear the debounce timeout when the component is destroyed
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
  }
}
