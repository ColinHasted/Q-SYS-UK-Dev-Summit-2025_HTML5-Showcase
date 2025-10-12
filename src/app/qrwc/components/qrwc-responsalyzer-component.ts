import { computed, effect, inject, signal, Signal } from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';
/**
 * The RTA bandwidths in octaves.
 */
export enum RtaBandwidth {
  /** Octave bands */
  Octave = 11,
  /** 1/3 Octave bands */
  Octave3 = 31,
  /** 1/6 Octave bands*/
  Octave6 = 61,
  /** 1/12 Octave bands */
  Octave12 = 121,
  /** 1/24 Octave bands*/
  Octave24 = 241,
}

export class QrwcResponsalyzerComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings for settable controls
  private readonly _delayBinding;
  private readonly _gainBinding;
  private readonly _rtaAveragingTimeBinding;
  private readonly _responseAveragingTimeBinding;
  private readonly _measurementGainBinding;
  private readonly _measurementGainBypassBinding;
  private readonly _referenceDelayAutoSetBinding;
  private readonly _frequenciesBinding;
  private readonly _magnitudeBinding;
  private readonly _phaseBinding;
  private readonly _responseBinding;
  private readonly _coherenceBinding;
  private readonly _impulseBinding;
  private readonly _impulseLongBinding;
  private readonly _impulseLengthBinding;

  public readonly magnitude: Signal<number[]>;
  public readonly phase: Signal<number[]>;
  public readonly response: Signal<number[]>;
  public readonly coherence: Signal<number[]>;
  public readonly impulse: Signal<number[]>;
  public readonly impulseLong: Signal<number[]>;
  public readonly impulseLength: Signal<number>;

  public readonly frequencies: Signal<number[]>;

  get measurementGain(): Signal<number> {
    return this._measurementGainBinding.value;
  }

  get measurementGainBypass(): Signal<boolean> {
    return this._measurementGainBypassBinding.bool;
  }
  public responsalyzer = computed(() => {
    const components = this.qrwc.components();
    return components && components[this.componentName]
      ? components[this.componentName]
      : null;
  });

  get delay(): Signal<number> {
    return this._delayBinding.value;
  }

  get gain(): Signal<number> {
    return this._gainBinding.value;
  }

  get rtaAveragingTime(): Signal<number> {
    return this._rtaAveragingTimeBinding.value;
  }

  get responseAveragingTime(): Signal<number> {
    return this._responseAveragingTimeBinding.value;
  }

  constructor(private componentName: string, private bandwidth: RtaBandwidth) {
    // Update bindings with actual component name
    this._delayBinding = this.qrwc.bindControl(componentName, 'reference.delay', 0);
    this._gainBinding = this.qrwc.bindControl(componentName, 'measurement.gain', 0);
    this._rtaAveragingTimeBinding = this.qrwc.bindControl(componentName, 'analyzer.averaging.time.constant', 0);
    this._responseAveragingTimeBinding = this.qrwc.bindControl(componentName, 'response.averaging.time.constant', 0);
    this._measurementGainBinding = this.qrwc.bindControl(componentName, 'measurement.gain', 0);
    this._measurementGainBypassBinding = this.qrwc.bindControl(componentName, 'measurement.gain.bypass', false);
    this._referenceDelayAutoSetBinding = this.qrwc.bindControl(componentName, 'reference.delay.auto.set', false);
    
    this._frequenciesBinding = this.qrwc.bindControl(componentName, 'frequency', [] as number[]);
    this._magnitudeBinding = this.qrwc.bindControl(componentName, 'magnitude', [] as number[]);
    this._phaseBinding = this.qrwc.bindControl(componentName, 'phase', [] as number[]);
    this._responseBinding = this.qrwc.bindControl(componentName, 'response', [] as number[]);
    this._coherenceBinding = this.qrwc.bindControl(componentName, 'coherence', [] as number[]);
    this._impulseBinding = this.qrwc.bindControl(componentName, 'impulse', [] as number[]);
    this._impulseLongBinding = this.qrwc.bindControl(componentName, 'impulse.long', [] as number[]);
    this._impulseLengthBinding = this.qrwc.bindControl(componentName, 'impulse.length', 0);

    this.frequencies = this._frequenciesBinding.values;
    this.magnitude = this._magnitudeBinding.values;
    this.phase = this._phaseBinding.values;
    this.response = this._responseBinding.values;
    this.coherence = this._coherenceBinding.values;
    this.impulse = this._impulseBinding.values;
    this.impulseLong = this._impulseLongBinding.values;
    this.impulseLength = this._impulseLengthBinding.value;
  }

  /**
   * Calculates the frequencies for a given range and number of points.
   * @param startFreq The starting frequency.
   * @param endFreq The end frequency.
   * @param numPoints The number of points.
   * @returns An array of frequencies.
   */
  private calculateFrequencies(
    startFreq: number,
    endFreq: number,
    bandwidth: RtaBandwidth
  ): number[] {
    const frequencies: number[] = [];
    const factor = Math.log10(endFreq / startFreq) / (bandwidth - 1);

    for (let i = 0; i < bandwidth; i++) {
      const freq = Math.round(startFreq * Math.pow(10, i * factor));
      frequencies.push(freq);
    }

    return frequencies;
  }

  public setDelay(delayMs: number) {
    this._delayBinding.setValue(delayMs);
  }

  public autoSetDelay() {
    this._referenceDelayAutoSetBinding.trigger();
  }

  public setRTAResponseTime(timeMs: number) {
    this._rtaAveragingTimeBinding.setValue(timeMs);
  }

  public setResponseAveragingTime(timeMs: number) {
    this._responseAveragingTimeBinding.setValue(timeMs);
  }

  public setGain(gainDb: number) {
    this._gainBinding.setValue(gainDb);
  }

  public toggleMeasurementGainBypass() {
    this._measurementGainBypassBinding.setValue(!this.measurementGainBypass());
  }
}
