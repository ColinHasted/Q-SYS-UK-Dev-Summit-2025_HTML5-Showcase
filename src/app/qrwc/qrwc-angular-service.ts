import {
  Injectable,
  OnDestroy,
  signal,
  Signal,
  effect,
  computed,
} from '@angular/core';
import { Qrwc, Component, Control, IControlState } from '@q-sys/qrwc';

@Injectable({
  providedIn: 'root',
})
export class QrwcAngularService implements OnDestroy {
  /** QRWC library instance */
  private qrwc?: Qrwc;
  /** Reconnection delay if QRWC is disconnected or fails */
  private readonly reconnectDelay = 5000;
  /** Last-used IP address for reconnect attempts */
  private lastIpAddress?: string;
  /** Last-used polling interval for reconnect attempts */
  private lastPollingInterval?: number;
  /** Promise for an in-flight connect attempt to prevent concurrent connects */
  private connectPromise: Promise<Qrwc> | null = null;
  /** Number of reconnect attempts (used for exponential backoff) */
  private reconnectAttempts = 0;
  /** Signal indicating if QRWC is initialized and connected */
  public readonly initialized = signal(false);
  /** Signal storing the current QRWC components records */
  public readonly components = signal<Record<string, Component<string> | undefined>>({});

  constructor() {
  }

  /**
   * Connect to QRWC and return the created instance. Guards concurrent connects.
   */
  public async connect(ipAddress: string, pollingInterval = 350): Promise<Qrwc> {
    if (this.qrwc) return this.qrwc;
    if (this.connectPromise) return this.connectPromise;

    // store the connection parameters so reconnects can reuse them
    this.lastIpAddress = ipAddress;
    this.lastPollingInterval = pollingInterval;

    this.connectPromise = (async () => {
      console.log('Connecting to QRWC...');
      try {
        const socket = new WebSocket(`ws://${ipAddress}/qrc-public-api/v0`);

        const qrwc = await Qrwc.createQrwc({
          socket,
          pollingInterval
        });

        console.log('QRWC instance created successfully:');
        console.log('QRWC Components:', Object.keys(qrwc.components));


        qrwc.on('disconnected', (reason: string) => {
          console.log('QRWC disconnected, attempting to reconnect...', reason);
          this.initialized.set(false);
          this.qrwc = undefined;
          // schedule a reconnect with backoff using stored connection params
          setTimeout(() => void this.tryReconnect(), this.nextReconnectDelay());
        });

        this.components.set(qrwc.components);

        qrwc.on('update', (component, control, state) => {
       /*  console.log(
            `[Global] ${component.name}.${control.name} updated:`,
            state
          );*/
        });

        qrwc.on('error', (error: Error) => {
          console.error('QRWC error:', error);
        });

        this.qrwc = qrwc;
        this.initialized.set(true);
        this.reconnectAttempts = 0;

        return qrwc;
      } finally {
        this.connectPromise = null;
      }
    })();

    return this.connectPromise;
  }

  /** Disconnect and cleanup */
  public disconnect(): void {
    this.qrwc?.close();
    this.qrwc = undefined;
    this.initialized.set(false);
    this.components.set({});
    this.connectPromise = null;
  }

  private nextReconnectDelay(): number {
    const max = 30_000; // cap
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts), max);
    this.reconnectAttempts++;
    return delay;
  }

  private async tryReconnect(): Promise<void> {
    try {
      if (!this.lastIpAddress) {
        console.warn('No previous IP address stored — aborting reconnect.');
        return;
      }

      await this.connect(this.lastIpAddress, this.lastPollingInterval ?? 350);
    } catch (err) {
      // schedule another attempt
      setTimeout(() => void this.tryReconnect(), this.nextReconnectDelay());
    }
  }

  ngOnDestroy(): void {
    // make sure we clean up the connection when the service is destroyed
    this.disconnect();
  }

  /** returns a computed signal for a component */
  getComputedComponent(componentName: string) {
    return computed(() => {
      const components = this.components();
      return components && components[componentName]
        ? components[componentName]
        : null;
    });
  }
  

  /**
   * Create a callable control binding with automatic type inference.
   *
   * The binding itself is callable and returns the type inferred from the default value.
   *
   * @param componentName - Name of the Q-SYS component
   * @param controlName - Name of the control
   * @param defaultValue - Default value to return when disconnected (also infers return type)
   * @param useLog - Whether to use logarithmic scaling for position (default: false)
   *
   * @example
   * // Type inferred as boolean from default value
   * const mute = this.qrwc.bindControl('MyGain', 'mute', false);
   * mute() // returns boolean
   *
   * // Type inferred as number from default value
   * const gain = this.qrwc.bindControl('MyGain', 'gain', 0, true);
   * gain() // returns number
   *
   * // Type inferred as number[] from default value
   * const spectrum = this.qrwc.bindControl('MyEQ', 'magnitude', []);
   * spectrum() // returns number[]
   *
   * // Type inferred as string from default value
   * const label = this.qrwc.bindControl('MyComponent', 'name', '');
   * label() // returns string
   *
   * // Access other properties
   * gain.legend()   // "-12.5 dB"
   * gain.position() // 0.73
   * gain.bool()     // false
   *
   * // Update
   * gain.setValue(-6)
   * gain.setPosition(0.75)
   */
  bindControl<T extends number | boolean | string | number[]>(
    componentName: string,
    controlName: string,
    defaultValue: T,
    useLog: boolean = false
  ) {
    const controlSignal = signal<Control | null>(null);
    const stateSignal = signal<IControlState | null>(null);
    let cleanupFn: (() => void) | undefined;

    // Lazy computed properties
    const connected = computed(() => controlSignal() !== null);
    const state = computed(() => stateSignal());
    const value = computed(() => stateSignal()?.Value ?? 0);
    const position = computed(() => stateSignal()?.Position ?? 0);
    const string = computed(() => stateSignal()?.String ?? '');
    const legend = computed(() => stateSignal()?.Legend ?? '');
    const bool = computed(() => stateSignal()?.Bool ?? false);
    const min = computed(() => stateSignal()?.ValueMin ?? 0);
    const max = computed(() => stateSignal()?.ValueMax ?? 1);
    const values = computed(() => (stateSignal()?.Values ?? []) as number[]);

    // Setup binding
    effect(() => {
      const components = this.components();
      const component = components?.[componentName];
      const control = component?.controls[controlName];

      // Cleanup previous subscription
      cleanupFn?.();
      cleanupFn = undefined;

      if (!control) {
        controlSignal.set(null);
        stateSignal.set(null);
        return;
      }

      // Set the control and initial state
      controlSignal.set(control);
      stateSignal.set(control.state);

      // Subscribe to updates
      const updateHandler = (newState: IControlState) => {
        stateSignal.set(newState);
      };

      control.on('update', updateHandler);

      // Store cleanup function
      cleanupFn = () => {
        control.removeListener('update', updateHandler);
      };
    });

    // Create computed signal that returns the appropriate type based on defaultValue
    const defaultSignal = computed(() => {
      const state = stateSignal();
      if (!state) return defaultValue;

      // Infer which property to return based on defaultValue type
      if (typeof defaultValue === 'boolean') {
        return state.Bool as T;
      } else if (typeof defaultValue === 'string') {
        return state.String as T;
      } else if (Array.isArray(defaultValue)) {
        return (state.Values ?? []) as T;
      } else {
        return state.Value as T;
      }
    });

    // Create binding as Signal<T> with additional properties
    const binding = defaultSignal as Signal<T> & {
      value: Signal<number>;
      position: Signal<number>;
      string: Signal<string>;
      legend: Signal<string>;
      bool: Signal<boolean>;
      min: Signal<number>;
      max: Signal<number>;
      values: Signal<number[]>;
      state: Signal<IControlState | null>;
      connected: Signal<boolean>;
      setValue: (v: number | string | boolean) => void;
      setPosition: (position: number) => void;
      trigger: () => void;
      destroy: () => void;
    };

    // Attach all properties to the callable function
    Object.defineProperties(binding, {
      value: { get: () => value, enumerable: true },
      position: { get: () => position, enumerable: true },
      string: { get: () => string, enumerable: true },
      legend: { get: () => legend, enumerable: true },
      bool: { get: () => bool, enumerable: true },
      min: { get: () => min, enumerable: true },
      max: { get: () => max, enumerable: true },
      values: { get: () => values, enumerable: true },
      state: { get: () => state, enumerable: true },
      connected: { get: () => connected, enumerable: true },
      setValue: {
        value: (v: number | string | boolean) => {
          const control = controlSignal();
          if (!control) {
            console.warn(`Cannot setValue: ${componentName}.${controlName} not connected`);
            return;
          }
          control.update(v);
        },
        enumerable: true,
      },
      setPosition: {
        value: (position: number) => {
          const control = controlSignal();
          const state = stateSignal();

          if (!control || !state) {
            console.warn(`Cannot setPosition: ${componentName}.${controlName} not connected`);
            return;
          }

          if (position < 0 || position > 1) {
            console.error(`Position must be 0-1, got ${position}`);
            return;
          }

          const { ValueMin, ValueMax } = state;

          if (ValueMin == null || ValueMax == null) {
            console.error(`Control ${componentName}.${controlName} missing ValueMin/ValueMax`);
            return;
          }

          const valueToSet = useLog
            ? ValueMin * Math.pow(ValueMax / ValueMin, position)
            : ValueMin + position * (ValueMax - ValueMin);

          control.update(valueToSet);
        },
        enumerable: true,
      },
      trigger: {
        value: () => {
          const control = controlSignal();
          if (!control) {
            console.warn(`Cannot trigger: ${componentName}.${controlName} not connected`);
            return;
          }
          control.update(true);
          setTimeout(() => {
            control.update(false);
          }, 100);
        },
        enumerable: true,
      },
      destroy: {
        value: () => {
          cleanupFn?.();
        },
        enumerable: true,
      },
    });
    return binding;
  }
}
