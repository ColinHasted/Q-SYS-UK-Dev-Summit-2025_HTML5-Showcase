import { inject, Signal } from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';
import { Component } from '@q-sys/qrwc';

export class QrwcStatusComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings
  private readonly _identifyLedBinding;
  private readonly _statusLedBinding;
  private readonly _clockMasterBinding;
  private readonly _clockOffsetBinding;
  private readonly _grandmasterNameBinding;
  private readonly _lanAActiveBinding;
  private readonly _lanAAddressBinding;
  private readonly _lanAModeBinding;
  private readonly _lanASpeedBinding;
  private readonly _lanAStateBinding;
  private readonly _lanBActiveBinding;
  private readonly _lanBAddressBinding;
  private readonly _lanBModeBinding;
  private readonly _lanBSpeedBinding;
  private readonly _lanBStateBinding;
  private readonly _parentPortNameBinding;
  private readonly _processorFan1SpeedBinding;
  private readonly _processorTemperatureBinding;
  private readonly _ptpv1DanteBinding;
  private readonly _statusBinding;
  private readonly _systemFan1SpeedBinding;
  private readonly _systemTemperatureBinding;

  private readonly statusComponent: Signal<Component | null>;

  get identifyLed(): Signal<boolean> {
    return this._identifyLedBinding.bool;
  }

  get statusLed(): Signal<boolean> {
    return this._statusLedBinding.bool;
  }

  get clockMaster(): Signal<boolean> {
    return this._clockMasterBinding.bool;
  }

  get clockOffset(): Signal<string> {
    return this._clockOffsetBinding.string;
  }

  get grandmasterName(): Signal<string> {
    return this._grandmasterNameBinding.string;
  }

  get lanAActive(): Signal<boolean> {
    return this._lanAActiveBinding.bool;
  }

  get lanAAddress(): Signal<string> {
    return this._lanAAddressBinding.string;
  }

  get lanAMode(): Signal<string> {
    return this._lanAModeBinding.string;
  }

  get lanASpeed(): Signal<string> {
    return this._lanASpeedBinding.string;
  }

  get lanAState(): Signal<string> {
    return this._lanAStateBinding.string;
  }

  get lanBActive(): Signal<boolean> {
    return this._lanBActiveBinding.bool;
  }

  get lanBAddress(): Signal<string> {
    return this._lanBAddressBinding.string;
  }

  get lanBMode(): Signal<string> {
    return this._lanBModeBinding.string;
  }

  get lanBSpeed(): Signal<string> {
    return this._lanBSpeedBinding.string;
  }

  get lanBState(): Signal<string> {
    return this._lanBStateBinding.string;
  }

  get parentPortName(): Signal<string> {
    return this._parentPortNameBinding.string;
  }

  get processorFan1Speed(): Signal<number> {
    return this._processorFan1SpeedBinding.value;
  }

  get processorTemperature(): Signal<number> {
    return this._processorTemperatureBinding.value;
  }

  get ptpv1Dante(): Signal<string> {
    return this._ptpv1DanteBinding.string;
  }

  get status(): Signal<string> {
    return this._statusBinding.string;
  }

  get systemFan1Speed(): Signal<number> {
    return this._systemFan1SpeedBinding.value;
  }

  get systemTemperature(): Signal<number> {
    return this._systemTemperatureBinding.value;
  }

  constructor(private componentName: string) {
    // Initialize computed statusComponent via service helper for correct timing
    this.statusComponent = this.qrwc.getComputedComponent(componentName);

    // Update bindings with actual component name
    this._identifyLedBinding = this.qrwc.bindControl(componentName, 'identify.state.trigger', false);
    this._statusLedBinding = this.qrwc.bindControl(componentName, 'status.led', false);
    this._clockMasterBinding = this.qrwc.bindControl(componentName, 'clock.master', false);
    this._clockOffsetBinding = this.qrwc.bindControl(componentName, 'clock.offset', '');
    this._grandmasterNameBinding = this.qrwc.bindControl(componentName, 'grandmaster.name', '');
    this._lanAActiveBinding = this.qrwc.bindControl(componentName, 'lan.a.active', false);
    this._lanAAddressBinding = this.qrwc.bindControl(componentName, 'lan.a.address', '');
    this._lanAModeBinding = this.qrwc.bindControl(componentName, 'lan.a.mode', '');
    this._lanASpeedBinding = this.qrwc.bindControl(componentName, 'lan.a.speed', '');
    this._lanAStateBinding = this.qrwc.bindControl(componentName, 'lan.a.state', '');
    this._lanBActiveBinding = this.qrwc.bindControl(componentName, 'lan.b.active', false);
    this._lanBAddressBinding = this.qrwc.bindControl(componentName, 'lan.b.address', '');
    this._lanBModeBinding = this.qrwc.bindControl(componentName, 'lan.b.mode', '');
    this._lanBSpeedBinding = this.qrwc.bindControl(componentName, 'lan.b.speed', '');
    this._lanBStateBinding = this.qrwc.bindControl(componentName, 'lan.b.state', '');
    this._parentPortNameBinding = this.qrwc.bindControl(componentName, 'parent.port.name', '');
    this._processorFan1SpeedBinding = this.qrwc.bindControl(componentName, 'processor.fan.1.speed', 0);
    this._processorTemperatureBinding = this.qrwc.bindControl(componentName, 'processor.temperature', 0);
    this._ptpv1DanteBinding = this.qrwc.bindControl(componentName, 'ptpv1.dante', '');
    this._statusBinding = this.qrwc.bindControl(componentName, 'status', '');
    this._systemFan1SpeedBinding = this.qrwc.bindControl(componentName, 'system.fan.1.speed', 0);
    this._systemTemperatureBinding = this.qrwc.bindControl(componentName, 'system.temperature', 0);
  }

  Identify(): void {
    this._identifyLedBinding.setValue(true);
  }
}
