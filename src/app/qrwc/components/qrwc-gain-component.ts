import { inject, Signal } from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';

export class QrwcGainComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings
  private readonly _bypassBinding;
  private readonly _gainBinding;
  private readonly _invertBinding;
  private readonly _muteBinding;
  private readonly _stepperHoldOffBinding;
  private readonly _stepperTimeBinding;
  private readonly _stepperValueBinding;

  /**
   * Gain Component
   * @param componentName - The name of the Gain Component.
   */
  constructor(private componentName: string) {
    this._bypassBinding = this.qrwc.bindControl(componentName, 'bypass', false);
    this._gainBinding = this.qrwc.bindControl(componentName, 'gain', 0);
    this._invertBinding = this.qrwc.bindControl(componentName, 'invert', false);
    this._muteBinding = this.qrwc.bindControl(componentName, 'mute', false);
    this._stepperHoldOffBinding = this.qrwc.bindControl(componentName, 'stepper.hold.off', 0);
    this._stepperTimeBinding = this.qrwc.bindControl(componentName, 'stepper.time', 0);
    this._stepperValueBinding = this.qrwc.bindControl(componentName, 'stepper.value', 0);
    this._stepperIncreaseBinding = this.qrwc.bindControl(componentName, 'stepper.increase', false);
    this._stepperDecreaseBinding = this.qrwc.bindControl(componentName, 'stepper.decrease', false);
  }

  /** The bypass state of the Gain Component. */
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

  /** The position of the gain control. This is a value between 0 and 1. */
  get position(): Signal<number> {
    return this._gainBinding.position;
  }

  /** When clicking and holding the Increase or Decrease buttons, this is the amount of time it takes before the gain value starts to ramp. */
  get stepperHoldOff(): Signal<number> {
    return this._stepperHoldOffBinding.value;
  }

  /** When clicking and holding the Increase or Decrease buttons, this is the amount of time it takes to ramp from the minimum gain value to the maximum gain value */
  get stepperTime(): Signal<number> {
    return this._stepperTimeBinding.value;
  }

  /** If Mode is set to 'Discrete', this meter indicates the level of gain. */
  get stepperValue(): Signal<number> {
    return this._stepperValueBinding.value;
  }

  // Stepper control bindings
  private readonly _stepperIncreaseBinding;
  private readonly _stepperDecreaseBinding;

  /**
   * Click to increase the gain. Click and hold to continuously increase the gain according to the Hold Off and Time controls.
   * Note: These controls are only active when Enable Ramp Controls are set to Yes.
   * @param state - The new state of the Increase button (true = pressed, false = released).
   */
  Increase(state: boolean): void {
    this._stepperIncreaseBinding.setValue(state);
  }

  /**
   * Click to decrease the gain. Click and hold to continuously decrease the gain according to the Hold Off and Time controls.
   * Note: These controls are only active when Enable Ramp Controls are set to Yes.
   * @param state - The new state of the Decrease button (true = pressed, false = released).
   */
  Decrease(state: boolean): void {
    this._stepperDecreaseBinding.setValue(state);
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
   * Bypasses the Gain Component for all channels.
   * @param state - The new state of the Bypass button (true = bypassed, false = not bypassed).
   */
  SetBypass(state: boolean): void {
    this._bypassBinding.setValue(state);
  }

  /**
   * Toggle the Bypass button.
   */
  ToggleBypass(): void {
    this._bypassBinding.setValue(!this._bypassBinding());
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
    this._invertBinding.setValue(!this._invertBinding());
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
    this._muteBinding.setValue(!this._muteBinding());
  }

  /**
   * When clicking and holding the Increase or Decrease buttons, this is the amount of time it takes before the gain value starts to ramp.
   * Note: These controls are only active when Enable Ramp Controls are set to Yes.
   * @param value - The new stepper hold off time in seconds (0.00 to 60.00s)
   */
  SetStepperHoldoff(seconds: number): void {
    this._stepperHoldOffBinding.setValue(seconds);
  }

  /**
   * When clicking and holding the Increase or Decrease buttons, this is the amount of time it takes to ramp from the minimum gain value to the maximum gain value.
   * Note: These controls are only active when Enable Ramp Controls are set to Yes.
   * @param seconds - The new stepper rame time in seconds (0.00 to 60.00s)
   */
  SetStepperTime(seconds: number): void {
    this._stepperTimeBinding.setValue(seconds);
  }

  /**
   * If Mode is set to 'Discrete', this meter indicates the level of gain.
   * Note: These controls are only active when Enable Ramp Controls are set to Yes.
   * @param value - The new stepper value.
   */
  SetStepperValue(value: number): void {
    this._stepperValueBinding.setValue(value);
  }
}
