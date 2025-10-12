import { computed, inject, output, Signal } from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';
import { Component } from '@q-sys/qrwc';

export class QrwcCompressorComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings
  private readonly _bypassBinding;
  private readonly _appliedGainBinding;
  private readonly _attackBinding;
  private readonly _depthBinding;
  private readonly _detectorLevelBinding;
  private readonly _inputGainBinding;
  private readonly _outputGainBinding;
  private readonly _ratioBinding;
  private readonly _releaseBinding;
  private readonly _softKneeBinding;
  private readonly _thresholdLevelBinding;

  // Will be initialized in the constructor to ensure componentName is available
  private readonly compressorComponent: Signal<Component | null>;

  /** The bypass state of the Compressor Component. */
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

  /** The depth of the compressor in dB. */
  get depth(): Signal<number> {
    return this._depthBinding.value;
  }

  get depthPosition(): Signal<number> {
    return this._depthBinding.position;
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

  /** The ratio of input to output level above the threshold. */
  get ratio(): Signal<number> {
    return this._ratioBinding.value;
  }

  get ratioPosition(): Signal<number> {
    return this._ratioBinding.position;
  }

  /** The release time in milliseconds. */
  get release(): Signal<number> {
    return this._releaseBinding.value;
  }

  get releasePosition(): Signal<number> {
    return this._releaseBinding.position;
  }

  /** The soft knee width in dB. */
  get softKnee(): Signal<number> {
    return this._softKneeBinding.value;
  }

  get softKneePosition(): Signal<number> {
    return this._softKneeBinding.position;
  }

  /** The threshold level in dB. */
  get thresholdLevel(): Signal<number> {
    return this._thresholdLevelBinding.value;
  }

  get thresholdLevelPosition(): Signal<number> {
    return this._thresholdLevelBinding.position;
  }

  /**
   * Compressor Component
   * @param componentName - The name of the Compressor Component.
   */
  constructor(private componentName: string) {
    // Initialize computed compressorComponent via service helper for correct timing
    this.compressorComponent = this.qrwc.getComputedComponent(componentName);

    // Update bindings with actual component name
    this._bypassBinding = this.qrwc.bindControl(componentName, 'bypass', false);
    this._appliedGainBinding = this.qrwc.bindControl(componentName, 'applied.gain', 0);
    this._attackBinding = this.qrwc.bindControl(componentName, 'attack', 0,true);
    this._depthBinding = this.qrwc.bindControl(componentName, 'depth', 0);
    this._detectorLevelBinding = this.qrwc.bindControl(componentName, 'detector.level', 0);
    this._inputGainBinding = this.qrwc.bindControl(componentName, 'input.gain', 0);
    this._outputGainBinding = this.qrwc.bindControl(componentName, 'output.gain', 0);
    this._ratioBinding = this.qrwc.bindControl(componentName, 'ratio', 1,true);
    this._releaseBinding = this.qrwc.bindControl(componentName, 'release', 0,true);
    this._softKneeBinding = this.qrwc.bindControl(componentName, 'soft.knee', 0);
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
  SetDepth(value: number): void {
    this._depthBinding.setValue(value);
  }
  SetDepthPosition(value: number): void {
    this._depthBinding.setPosition(value);
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
  setRatio(value: number): void {
    this._ratioBinding.setValue(value);
  }
  setRatioPosition(value: number): void {
    this._ratioBinding.setPosition(value);
  }
  SetRelease(value: number): void {
    this._releaseBinding.setValue(value);
  }
  SetReleasePosition(value: number): void {
    this._releaseBinding.setPosition(value);
  }
  SetSoftKnee(value: number): void {
    this._softKneeBinding.setValue(value);
  }
  SetSoftKneePosition(value: number): void {
    this._softKneeBinding.setPosition(value);
  }
  SetThresholdLevel(value: number): void {
    this._thresholdLevelBinding.setValue(value);
  }
  SetThresholdLevelPosition(value: number): void {
    this._thresholdLevelBinding.setPosition(value);
  }
}
