/**
 * QRWC Control Binding - Simple & Complete
 *
 * Single-class solution for binding Angular components to Q-SYS QRWC controls.
 *
 * @example
 * import { QrwcControlBinding } from '../qrwc';
 *
 * // Create binding
 * const gain = new QrwcControlBinding(qrwc, 'MyGain', 'gain', true);
 *
 * // Access any property via lazy computeds
 * gain.value()      // -12.5
 * gain.position()   // 0.73
 * gain.legend()     // "-12.5 dB"
 * gain.bool()       // false
 * gain.string()     // "-12.5"
 * gain.min()        // -100
 * gain.max()        // 20
 * gain.state()      // full state
 * gain.connected()  // true
 *
 * // Update control
 * gain.setValue(-6)           // set value
 * gain.setPosition(0.75)      // set position (0-1) with log scaling
 */

export { QrwcControlBinding } from './qrwc-control-binding';

// Export component wrappers
export { QrwcMeterComponent } from './components/qrwc-meter-component';
export { QrwcLimiterComponent } from './components/qrwc-limiter-component';
export { QrwcCompressorComponent } from './components/qrwc-compressor-component';
export { QrwcGateComponent } from './components/qrwc-gate-component';
