import {
  computed,
  effect,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';

/**
 * Enum representing different graphic equalizer configurations.
 */
export enum GraphicEqBands {
  Six = 6,
  Eleven = 11,
  Sixteen = 16,
  ThirtyOne = 31,
  SixtyOne = 61,
}

export interface FrequencyResponse {
  Frequency: number;
  Magnitude: number;
  Phase: number;
}

export interface GEQBand {
  _bypassBinding: any;
  _gainBinding: any;
  Title: string;
  Frequency: number;
  Bypass: Signal<boolean>;
  Gain: Signal<number>;
  Legend: Signal<string>;
}

interface GraphicEqBandConfig {
  bands: number[];
  bandwidth: number;
}

/**
 * Format the frequency to add a "k" suffix for values 1000 and above.
 * @param frequency - The frequency to format.
 * @returns The formatted frequency as a string.
 */
function formatFrequency(frequency: number): string {
  if (frequency >= 1000) {
    const formatted = (frequency / 1000).toFixed(2);
    return parseFloat(formatted).toString() + 'k';
  } else {
    return frequency.toString();
  }
}

export class QrwcGraphicEqualizerComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings
  private readonly _bypassBinding;
  private readonly _gainBinding;
  private readonly _invertBinding;
  private readonly _muteBinding;

  /** The bypass state of the Graphic EQ Component. */
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

  readonly Bands: GEQBand[];
  readonly ActiveEQBands: WritableSignal<GEQBand[]> = signal([]);
  readonly Bandwidth: number;

  readonly graphicEqConfig: Record<GraphicEqBands, GraphicEqBandConfig> = {
    [GraphicEqBands.Six]: {
      bands: [16, 63, 250, 1000, 4000, 16000],
      bandwidth: 12/6,
    },
    [GraphicEqBands.Eleven]: {
      bands: [16, 31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000],
      // bandwidth: 1,
      bandwidth: 12/11,
    },
    [GraphicEqBands.Sixteen]: {
      bands: [
        16, 25, 40, 63, 100, 160, 250, 400, 630, 1000, 1600, 2500, 4000, 6300,
        10000, 16000,
      ],
      //bandwidth: 2 / 3,
      bandwidth: 12 / 16,
    },
    [GraphicEqBands.ThirtyOne]: {
      bands: [
        16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400,
        500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300,
        8000, 10000, 12500, 16000,
      ],
      //bandwidth: 1 / 3,
      bandwidth : 12 / 31
       //q: 4.3170631917, Q changed to more accurately reflect the Q-sys filter
    },
    [GraphicEqBands.SixtyOne]: {
      bands: [
        16, 18, 20, 22.4, 25, 28, 31.5, 35.5, 40, 45, 50, 56, 63, 71, 80, 90,
        100, 112, 125, 140, 160, 180, 200, 224, 250, 280, 315, 355, 400, 450,
        500, 560, 630, 710, 800, 900, 1000, 1120, 1250, 1400, 1600, 1800, 2000,
        2240, 2500, 2800, 3150, 3550, 4000, 4500, 5000, 5600, 6300, 7100, 8000,
        9000, 10000, 11200, 12500, 14000, 16000,
      ],
      //bandwidth: 1 / 6,
      bandwidth: 12 / 61
    },
  };



  constructor(private componentName: string) {
    // Update bindings with actual component name
    this._bypassBinding = this.qrwc.bindControl(componentName, 'bypass', false);
    this._gainBinding = this.qrwc.bindControl(componentName, 'master.gain', 0);
    this._invertBinding = this.qrwc.bindControl(componentName, 'invert', false);
    this._muteBinding = this.qrwc.bindControl(componentName, 'mute', false);

    // Default to 31-band if component not available
    const size = GraphicEqBands.ThirtyOne; // TODO: Detect actual band count from component
    const config = this.graphicEqConfig[size];

    this.Bands = config.bands.map((frequency) => {
      const title = formatFrequency(frequency);
      const bypassBinding = this.qrwc.bindControl(
        this.componentName,
        title + 'Hz.bypass',
        false
      );
      const gainBinding = this.qrwc.bindControl(
        this.componentName,
        title + 'Hz.gain',
        0
      );
      return {
        _bypassBinding: bypassBinding,
        _gainBinding: gainBinding,
        Title: title,
        Frequency: frequency,
        Bypass: bypassBinding.bool,
        Gain: gainBinding.value,
        Legend: gainBinding.legend,
      };
    });


    this.Bandwidth = config.bandwidth;




  }

  public setGain(band: number, value: number): void {
    this.Bands[band]._gainBinding.setValue(value);
  }

  public toggleBypass(band: number): void {
    const currentValue = this.Bands[band].Bypass();
    this.Bands[band]._bypassBinding.setValue(!currentValue);
  }

  public flat() {
    for (let i = 0; i < this.Bands.length; i++) {
      this.setGain(i, 0);
    }
  }


 /**
   * Adjusts the output gain for all channels. The range depends on the Min Gain and Max Gain settings in the Properties.
   * @param dB - The new value of the gain in dB (-100 to 20 dB).
   */
  SetGain(dB: number): void {
    if (dB > -101 && dB < 21)
      this._gainBinding.setValue(dB);
  }

  /**
   * Bypasses the Graphic EQ Component for all channels.
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
}
