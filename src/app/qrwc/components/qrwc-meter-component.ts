import { computed, inject, Signal } from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';
import { Component } from '@q-sys/qrwc';

export class QrwcMeterComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings for shared controls
  private readonly _holdTimeBinding;
  private readonly _infiniteHoldBinding;
  private readonly _responseTimeBinding;
  private readonly _selectBinding;

  // Private bindings for per-channel controls
  private readonly _meterBindings: any[] = [];
  private readonly _peakBindings: any[] = [];
  private readonly _peakMaxBindings: any[] = [];
  private readonly _rmsBindings: any[] = [];
  private readonly _rmsMaxBindings: any[] = [];

  // Will be initialized in the constructor to ensure componentName is available
  private readonly meterComponent: Signal<Component | null>;

  /** The hold time in seconds (Float) */
  get holdTime(): Signal<number> {
    return this._holdTimeBinding.value;
  }

  /** Whether infinite hold is enabled (Boolean) */
  get infiniteHold(): Signal<boolean> {
    return this._infiniteHoldBinding.bool;
  }

  /** The response time in seconds (Float) */
  get responseTime(): Signal<number> {
    return this._responseTimeBinding.value;
  }

  /** The Peak/RMS Select (Enum) */
  get select(): Signal<string> {
    return this._selectBinding.string;
  }

  /**
   * Get the meter level for a specific channel (Left Meter in dBFS)
   * @param channel - Channel number (1-based)
   */
  getMeter(channel: number): Signal<number> {
    if (channel < 1 || channel > this.channelCount) {
      throw new Error(`Channel ${channel} out of range (1-${this.channelCount})`);
    }
    return this._meterBindings[channel - 1].value;
  }

  /**
   * Get the peak level for a specific channel (Peak Level in dBFS)
   * @param channel - Channel number (1-based)
   */
  getPeak(channel: number): Signal<number> {
    if (channel < 1 || channel > this.channelCount) {
      throw new Error(`Channel ${channel} out of range (1-${this.channelCount})`);
    }
    return this._peakBindings[channel - 1].value;
  }

  /**
   * Get the peak max level for a specific channel (Peak Max in dBFS)
   * @param channel - Channel number (1-based)
   */
  getPeakMax(channel: number): Signal<number> {
    if (channel < 1 || channel > this.channelCount) {
      throw new Error(`Channel ${channel} out of range (1-${this.channelCount})`);
    }
    return this._peakMaxBindings[channel - 1].value;
  }

  /**
   * Get the RMS level for a specific channel (RMS Level in dBFS)
   * @param channel - Channel number (1-based)
   */
  getRms(channel: number): Signal<number> {
    if (channel < 1 || channel > this.channelCount) {
      throw new Error(`Channel ${channel} out of range (1-${this.channelCount})`);
    }
    return this._rmsBindings[channel - 1].value;
  }

  /**
   * Get the RMS max level for a specific channel (RMS Max in dBFS)
   * @param channel - Channel number (1-based)
   */
  getRmsMax(channel: number): Signal<number> {
    if (channel < 1 || channel > this.channelCount) {
      throw new Error(`Channel ${channel} out of range (1-${this.channelCount})`);
    }
    return this._rmsMaxBindings[channel - 1].value;
  }

  /**
   * Get all meter levels as an array of signals
   */
  get meters(): Signal<number>[] {
    return this._meterBindings.map(b => b.value);
  }

  /**
   * Get all peak levels as an array of signals
   */
  get peaks(): Signal<number>[] {
    return this._peakBindings.map(b => b.value);
  }

  /**
   * Get all peak max levels as an array of signals
   */
  get peakMaxes(): Signal<number>[] {
    return this._peakMaxBindings.map(b => b.value);
  }

  /**
   * Get all RMS levels as an array of signals
   */
  get rmsLevels(): Signal<number>[] {
    return this._rmsBindings.map(b => b.value);
  }

  /**
   * Get all RMS max levels as an array of signals
   */
  get rmsMaxes(): Signal<number>[] {
    return this._rmsMaxBindings.map(b => b.value);
  }

  /**
   * Meter Component
   * @param componentName - The name of the Meter Component.
   * @param channelCount - The number of channels (1-256).
   */
  constructor(private componentName: string, private channelCount: number = 2) {
    if (channelCount < 1 || channelCount > 256) {
      throw new Error(`Channel count must be between 1 and 256, got ${channelCount}`);
    }

    // Initialize computed meterComponent via service helper for correct timing
    this.meterComponent = this.qrwc.getComputedComponent(componentName);

    // Bind shared controls
    this._holdTimeBinding = this.qrwc.bindControl(componentName, 'hold.time', 0);
    this._infiniteHoldBinding = this.qrwc.bindControl(componentName, 'infinite.hold', false);
    this._responseTimeBinding = this.qrwc.bindControl(componentName, 'response.time', 0);
    this._selectBinding = this.qrwc.bindControl(componentName, 'select', '');

    // Bind per-channel controls
    for (let i = 1; i <= channelCount; i++) {
      this._meterBindings.push(
        this.qrwc.bindControl(componentName, `meter.${i}`, 0)
      );
      this._peakBindings.push(
        this.qrwc.bindControl(componentName, `peak.${i}`, 0)
      );
      this._peakMaxBindings.push(
        this.qrwc.bindControl(componentName, `peak.max.${i}`, 0)
      );
      this._rmsBindings.push(
        this.qrwc.bindControl(componentName, `rms.${i}`, 0)
      );
      this._rmsMaxBindings.push(
        this.qrwc.bindControl(componentName, `rms.max.${i}`, 0)
      );
    }
  }

  // Setter methods for shared controls

  /**
   * Set the hold time
   * @param value - Hold time in seconds
   */
  setHoldTime(value: number): void {
    this._holdTimeBinding.setValue(value);
  }

  /**
   * Set the hold time using normalized position (0-1)
   * @param position - Normalized position (0-1)
   */
  setHoldTimePosition(position: number): void {
    this._holdTimeBinding.setPosition(position);
  }

  /**
   * Set infinite hold on/off
   * @param value - True to enable infinite hold
   */
  setInfiniteHold(value: boolean): void {
    this._infiniteHoldBinding.setValue(value);
  }

  /**
   * Toggle infinite hold
   */
  toggleInfiniteHold(): void {
    this.setInfiniteHold(!this.infiniteHold());
  }

  /**
   * Set the response time
   * @param value - Response time in seconds
   */
  setResponseTime(value: number): void {
    this._responseTimeBinding.setValue(value);
  }

  /**
   * Set the response time using normalized position (0-1)
   * @param position - Normalized position (0-1)
   */
  setResponseTimePosition(position: number): void {
    this._responseTimeBinding.setPosition(position);
  }

  /**
   * Set the Peak/RMS select
   * @param value - The select value (typically enum string)
   */
  setSelect(value: string | number): void {
    this._selectBinding.setValue(value);
  }
}
