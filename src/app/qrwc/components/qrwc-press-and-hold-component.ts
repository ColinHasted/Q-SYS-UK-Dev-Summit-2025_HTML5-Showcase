import { inject, Signal } from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';

export class QrwcPressAndHoldComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings
  private readonly _holdTimeBinding;
  private readonly _inputBinding;

  /**
   * The amount of time, in seconds, that the Input button must be pressed, held, and released that separates firing the Short trigger or Long trigger.
   */
  get holdTime(): Signal<number> {
    return this._holdTimeBinding.value;
  }

  /**
   * Press & Hold Component
   * @param componentName - The name of the Press & Hold Component.
   */
  constructor(private componentName: string) {
    // Update bindings with actual component name
    this._holdTimeBinding = this.qrwc.bindControl(componentName, 'hold.time', 0);
    this._inputBinding = this.qrwc.bindControl(componentName, 'input', false);
  }

  /**
   * The press & hold input button.
   * @param state - The new state of the Input button (true = pressed, false = released).
   */
  Input(state: boolean): void {
    this._inputBinding.setValue(state);
  }

  SetHoldTime(value: number): void {
    this._holdTimeBinding.setValue(value);
  }
}
