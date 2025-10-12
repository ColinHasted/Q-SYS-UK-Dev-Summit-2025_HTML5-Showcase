import { computed, inject, input, output, Signal } from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';
import { Component } from '@q-sys/qrwc';

export class QrwcLimiterComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings
  private readonly _bypassBinding;
  private readonly _appliedGainBinding;
  private readonly _attackBinding;
  private readonly _detectorLevelBinding;
  private readonly _inputGainBinding;
  private readonly _outputGainBinding;
  private readonly _releaseBinding;
  private readonly _thresholdLevelBinding;

  // Will be initialized in the constructor to ensure componentName is available
  private readonly limiterComponent: Signal<Component | null>;

  /** The bypass state of the Limiter Component. */
  get bypass(): Signal<boolean> {
    return this._bypassBinding.bool;
  }

  /** The applied gain reduction in dB. */
  get appliedGain(): Signal<number> {
    return this._appliedGainBinding.value;
  }

  /** The attack time in milliseconds. */
  get attack(): Signal<number> {
    return this._attackBinding.value;
  }

  get attackPosition(): Signal<number> {
    return this._attackBinding.position;
  }

  /** The level of the detector in dB. */
  get detectorLevel(): Signal<number> {
    return this._detectorLevelBinding.value;
  }

  /** The input gain in dB. */
  get inputGain(): Signal<number> {
    return this._inputGainBinding.value;
  }

  get inputGainPosition(): Signal<number> {
    return this._inputGainBinding.position;
  }

  /** The output gain in dB. */
  get outputGain(): Signal<number> {
    return this._outputGainBinding.value;
  }

  get outputGainPosition(): Signal<number> {
    return this._outputGainBinding.position;
  }

  /** The release time in milliseconds. */
  get release(): Signal<number> {
    return this._releaseBinding.value;
  }

  get releasePosition(): Signal<number> {
    return this._releaseBinding.position;
  }

  /** The threshold level in dB. */
  get thresholdLevel(): Signal<number> {
    return this._thresholdLevelBinding.value;
  }

  get thresholdLevelPosition(): Signal<number> {
    return this._thresholdLevelBinding.position;
  }

  /**
   * Limiter Component
   * @param componentName - The name of the Limiter Component.
   */
  constructor(private componentName: string) {
    // Initialize computed limiterComponent via service helper for correct timing
    this.limiterComponent = this.qrwc.getComputedComponent(componentName);

    // Update bindings with actual component name
    this._bypassBinding = this.qrwc.bindControl(componentName, 'bypass', false);
    this._appliedGainBinding = this.qrwc.bindControl(componentName, 'applied.gain', 0);
    this._attackBinding = this.qrwc.bindControl(componentName, 'attack', 0,true);
    this._detectorLevelBinding = this.qrwc.bindControl(componentName, 'detector.level', 0);
    this._inputGainBinding = this.qrwc.bindControl(componentName, 'input.gain', 0);
    this._outputGainBinding = this.qrwc.bindControl(componentName, 'output.gain', 0);
    this._releaseBinding = this.qrwc.bindControl(componentName, 'release', 0,true);
    this._thresholdLevelBinding = this.qrwc.bindControl(componentName, 'threshold.level', 0);
  }

  SetAttack(value: number): void {
    this._attackBinding.setValue(value);
  }
  SetAttackPosition(value: number): void {
    this._attackBinding.setPosition(value);
  }
  SetBypass(value: boolean): void {
    this._bypassBinding.setValue(value);
  }
  SetInputGain(value: number): void {
    this._inputGainBinding.setValue(value);
  }
  SetInputGainPosition(value: number): void {
    this._inputGainBinding.setPosition(value);
  }
  SetOutputGain(value: number): void {
    this._outputGainBinding.setValue(value);
  }
  SetOutputGainPosition(value: number): void {
    this._outputGainBinding.setPosition(value);
  }
  SetRelease(value: number): void {
    this._releaseBinding.setValue(value);
  }
  SetReleasePosition(value: number): void {
    this._releaseBinding.setPosition(value);
  }
  SetThresholdLevel(value: number): void {
    this._thresholdLevelBinding.setValue(value);
  }
  SetThresholdLevelPosition(value: number): void {
    this._thresholdLevelBinding.setPosition(value);
  }
}
