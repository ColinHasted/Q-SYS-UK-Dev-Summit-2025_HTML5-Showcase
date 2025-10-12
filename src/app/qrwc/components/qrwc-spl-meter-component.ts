import { computed, effect, inject, signal, Signal } from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';

export class QrwcSplMeterComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings
  private readonly _capturedLevelBinding;
  private readonly _captureBinding;
  private readonly _calibrateBinding;
  private readonly _resetMaxLevelBinding;
  private readonly _infiniteMaxHoldBinding;
  private readonly _levelBinding;
  private readonly _maxHoldTimeBinding;
  private readonly _maxLevelBinding;
  private readonly _referenceLevelBinding;
  private readonly _timeWeightingBinding;

  get capturedLevel(): Signal<number> {
    return this._capturedLevelBinding.value;
  }

  get infiniteMaxHold(): Signal<boolean> {
    return this._infiniteMaxHoldBinding.bool;
  }

  get level(): Signal<number> {
    return this._levelBinding.value;
  }

  get maxHoldTime(): Signal<number> {
    return this._maxHoldTimeBinding.value;
  }

  get maxLevel(): Signal<number> {
    return this._maxLevelBinding.value;
  }

  get referenceLevel(): Signal<number> {
    return this._referenceLevelBinding.value;
  }

  get timeWeighting(): Signal<number> {
    return this._timeWeightingBinding.value;
  }

  // Computed values for display
  public readonly splBarWidth = computed(() => {
    const currentLevel = this.level();
    const minLevel = 30;
    const maxLevel = 130;
    const percentage = ((currentLevel - minLevel) / (maxLevel - minLevel)) * 100;
    return Math.max(0, Math.min(100, percentage));
  });

  public readonly timeWeightingDisplay = computed(() => {
    const time = this.timeWeighting();
    if (time <= 125) return 'Fast';
    if (time <= 1000) return 'Slow';
    return `${time}ms`;
  });

  public readonly maxHoldTimeDisplay = computed(() => {
    const time = this.maxHoldTime();
    if (this.infiniteMaxHold()) return '∞';
    return `${time.toFixed(2)}s`;
  });

  // SPL Meter component reference
  splMeter = computed(() => {
    const components = this.qrwc.components();
    return components && components[this.componentName] ? components[this.componentName] : null;
  });

  constructor(private componentName: string) {
    // Update bindings with actual component name
    this._capturedLevelBinding = this.qrwc.bindControl(componentName, 'captured.level', 0);
    this._captureBinding = this.qrwc.bindControl(componentName, 'capture', false);
    this._calibrateBinding = this.qrwc.bindControl(componentName, 'calibrate', false);
    this._resetMaxLevelBinding = this.qrwc.bindControl(componentName, 'reset.max.level', false);
    this._infiniteMaxHoldBinding = this.qrwc.bindControl(componentName, 'infinite.max.hold', false);
    this._levelBinding = this.qrwc.bindControl(componentName, 'level', 0);
    this._maxHoldTimeBinding = this.qrwc.bindControl(componentName, 'max.hold.time', 0);
    this._maxLevelBinding = this.qrwc.bindControl(componentName, 'max.level', 0);
    this._referenceLevelBinding = this.qrwc.bindControl(componentName, 'reference.level', 94);
    this._timeWeightingBinding = this.qrwc.bindControl(componentName, 'time', 125);
  }

  // Helper methods for control interactions
  public Calibrate(): void {
    this._calibrateBinding.trigger();
  }

  public setCapture(value: boolean): void {
    this._captureBinding.setValue(value);
  }

  public setInfiniteMaxHold(value: boolean): void {
    this._infiniteMaxHoldBinding.setValue(value);
  }

  public toggleInfiniteMaxHold(): void {
    this._infiniteMaxHoldBinding.setValue(!this.infiniteMaxHold());
  }

  public setMaxHoldTime(value: number): void {
    this._maxHoldTimeBinding.setValue(value);
  }

  public setReferenceLevel(value: number): void {
    this._referenceLevelBinding.setValue(value);
  }

  public ResetMaxLevel(): void {
    this._resetMaxLevelBinding.trigger();
  }

  public setTimeWeighting(value: number): void {
    this._timeWeightingBinding.setValue(value);
  }
}
