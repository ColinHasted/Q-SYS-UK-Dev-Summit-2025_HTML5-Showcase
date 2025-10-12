import { Signal, signal, effect, computed } from '@angular/core';
import { QrwcAngularService } from './qrwc-angular-service';
import { IQrwcControlState } from './IQrwcControlState';
import { Control } from '@q-sys/qrwc';

/**
 * A complete binding to a Q-SYS control with reactive access to all properties.
 *
 * Single subscription, lazy computed values, fully self-contained.
 * No dependencies on qrwc-angular-service helper methods.
 *
 * @example
 * const gain = new QrwcControlBinding(qrwc, 'MyGain', 'gain', true);
 *
 * // Access any property via lazy computeds
 * gain.value()      // -12.5
 * gain.position()   // 0.73
 * gain.legend()     // "-12.5 dB"
 * gain.string()     // "-12.5"
 * gain.bool()       // false
 * gain.min()        // -100
 * gain.max()        // 20
 * gain.state()      // full IQrwcControlState
 *
 * // Update control
 * gain.setValue(-6)
 * gain.setPosition(0.75) // with automatic log scaling if enabled
 *
 * // Check connection
 * gain.connected()  // true/false
 */
export class QrwcControlBinding {
  private readonly controlSignal = signal<Control | null>(null);
  private readonly stateSignal = signal<IQrwcControlState | null>(null);
  private cleanupFn?: () => void;

  // Lazy computed properties - only calculate when accessed
  readonly connected = computed(() => this.controlSignal() !== null);
  readonly state = computed(() => this.stateSignal());
  readonly value = computed(() => this.stateSignal()?.Value ?? 0);
  readonly position = computed(() => this.stateSignal()?.Position ?? 0);
  readonly string = computed(() => this.stateSignal()?.String ?? '');
  readonly legend = computed(() => this.stateSignal()?.Legend ?? '');
  readonly bool = computed(() => this.stateSignal()?.Bool ?? false);
  readonly min = computed(() => this.stateSignal()?.ValueMin ?? 0);
  readonly max = computed(() => this.stateSignal()?.ValueMax ?? 1);
  readonly values = computed(() => (this.stateSignal()?.Values ?? []) as number[]);

  constructor(
    private qrwc: QrwcAngularService,
    private componentName: string,
    private controlName: string,
    private useLog: boolean = false
  ) {
    this.setupBinding();
  }

  /**
   * Setup the binding with automatic reconnection on component changes
   */
  private setupBinding(): void {
    effect(() => {
      const components = this.qrwc.components();
      const component = components?.[this.componentName];
      const control = component?.controls[this.controlName];

      // Cleanup previous subscription
      this.cleanupFn?.();
      this.cleanupFn = undefined;

      if (!control) {
        this.controlSignal.set(null);
        this.stateSignal.set(null);
        return;
      }

      // Set the control and initial state
      this.controlSignal.set(control);
      this.stateSignal.set(control.state as IQrwcControlState);

      // Subscribe to updates
      const updateHandler = (newState: any) => {
        this.stateSignal.set(newState as IQrwcControlState);
      };

      control.on('update', updateHandler);

      // Store cleanup function
      this.cleanupFn = () => {
        control.removeListener('update', updateHandler);
      };
    });
  }

  /**
   * Set the control value directly
   */
  setValue(value: number | string | boolean): void {
    const control = this.controlSignal();
    if (!control) {
      console.warn(`Cannot setValue: ${this.componentName}.${this.controlName} not connected`);
      return;
    }
    control.update(value);
  }

  /**
   * Set the control via normalized position (0-1)
   * Automatically applies linear or logarithmic scaling based on constructor parameter
   */
  setPosition(position: number): void {
    const control = this.controlSignal();
    const state = this.stateSignal();

    if (!control || !state) {
      console.warn(`Cannot setPosition: ${this.componentName}.${this.controlName} not connected`);
      return;
    }

    if (position < 0 || position > 1) {
      console.error(`Position must be 0-1, got ${position}`);
      return;
    }

    const { ValueMin, ValueMax } = state;

    if (ValueMin == null || ValueMax == null) {
      console.error(`Control ${this.componentName}.${this.controlName} missing ValueMin/ValueMax`);
      return;
    }

    // Calculate value from position using linear or logarithmic scaling
    const value = this.useLog
      ? ValueMin * Math.pow(ValueMax / ValueMin, position)
      : ValueMin + position * (ValueMax - ValueMin);

    control.update(value);
  }

  /**
   * Trigger the control (sets to true, waits 100ms, then sets to false)
   * Useful for momentary buttons/triggers
   */
  trigger(): void {
    this.setValue(true);
    setTimeout(() => {
      this.setValue(false);
    }, 100);
  }

  /**
   * Cleanup subscriptions (usually not needed as effect handles it)
   */
  destroy(): void {
    this.cleanupFn?.();
  }
}


