import { computed, inject, Signal } from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';
import { Component } from '@q-sys/qrwc';

export class QrwcGateComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings
  private readonly _appliedGainBinding;
  private readonly _attackBinding;
  private readonly _bypassBinding;
  private readonly _depthBinding;
  private readonly _detectorLevelBinding;
  private readonly _holdTimeBinding;
  private readonly _inputGainBinding;
  private readonly _openBinding;
  private readonly _outputGainBinding;
  private readonly _releaseBinding;
  private readonly _thresholdLevelBinding;

  // Will be initialized in the constructor to ensure componentName is available
  private readonly gateComponent: Signal<Component | null>;

  /**
   * Gate Component
   * @param componentName - The name of the Gate Component.
   */
  constructor(private componentName: string) {
    // Initialize computed gateComponent via service helper for correct timing
    this.gateComponent = this.qrwc.getComputedComponent(componentName);

    this._appliedGainBinding = this.qrwc.bindControl(componentName, 'applied.gain', 0);
    this._attackBinding = this.qrwc.bindControl(componentName, 'attack', 0,true);
    this._bypassBinding = this.qrwc.bindControl(componentName, 'bypass', false);
    this._depthBinding = this.qrwc.bindControl(componentName, 'depth', 0);
    this._detectorLevelBinding = this.qrwc.bindControl(componentName, 'detector.level', 0);
    this._holdTimeBinding = this.qrwc.bindControl(componentName, 'hold.time', 0,true);
    this._inputGainBinding = this.qrwc.bindControl(componentName, 'input.gain', 0);
    this._openBinding = this.qrwc.bindControl(componentName, 'open', false);
    this._outputGainBinding = this.qrwc.bindControl(componentName, 'output.gain', 0);
    this._releaseBinding = this.qrwc.bindControl(componentName, 'release', 0,true);
    this._thresholdLevelBinding = this.qrwc.bindControl(componentName, 'threshold.level', 0);
  }

  /** The bypass state of the Gate Component. */
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

  /** The attack time position. */
  get attackPosition(): Signal<number> {
    return this._attackBinding.position;
  }

  /** The depth of the gate in dB. */
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

  /** The hold time in milliseconds. */
  get holdTime(): Signal<number> {
    return this._holdTimeBinding.value;
  }

  get holdTimePosition(): Signal<number> {
    return this._holdTimeBinding.position;
  }

  /** The input gain in dB. */
  get inputGain(): Signal<number> {
    return this._inputGainBinding.value;
  }

  get inputGainPosition(): Signal<number> {
    return this._inputGainBinding.position;
  }

  /** The open state of the gate. */
  get open(): Signal<boolean> {
    return this._openBinding.bool;
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

  /** The threshold level position. */
  get thresholdLevelPosition(): Signal<number> {
    return this._thresholdLevelBinding.position;
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
  SetHoldTime(value: number): void {
    this._holdTimeBinding.setValue(value);
  }
  SetHoldTimePosition(value: number): void {
    this._holdTimeBinding.setPosition(value);
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
