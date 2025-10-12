import { inject, Signal } from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';

export class QrwcSnapshotControllerComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings
  private readonly _rampTimeBinding;
  private readonly _writeProtectBinding;
  private readonly _loadPreviousBinding;
  private readonly _loadNextBinding;
  private readonly _lastBindings: { [key: number]: any } = {};
  private readonly _matchBindings: { [key: number]: any } = {};
  private readonly _loadBindings: { [key: number]: any } = {};
  private readonly _saveBindings: { [key: number]: any } = {};

  /**
   * The last selected snapshot that was recalled.
   */
  public readonly last: { [key: number]: Signal<boolean> } = {};
  public readonly match: { [key: number]: Signal<boolean> } = {};
  public readonly load: { [key: number]: Signal<number> } = {};

  get rampTime(): Signal<number> {
    return this._rampTimeBinding.value;
  }

  get writeProtect(): Signal<boolean> {
    return this._writeProtectBinding.bool;
  }

  /**
   * Snapshot Controller Component
   * @param componentName - The name of the Snapshot Controller Component.
   * @param snapshotCount - The number of snapshots available.
   */
  constructor(private componentName: string, private snapshotCount: number) {
    // Update bindings with actual component name
    this._rampTimeBinding = this.qrwc.bindControl(componentName, 'ramp.time', 0);
    this._writeProtectBinding = this.qrwc.bindControl(componentName, 'write.protect', false);
    this._loadPreviousBinding = this.qrwc.bindControl(componentName, 'load.previous', false);
    this._loadNextBinding = this.qrwc.bindControl(componentName, 'load.next', false);

    for (let i = 1; i <= this.snapshotCount; i++) {
      this._lastBindings[i] = this.qrwc.bindControl(componentName, 'last.' + i, false);
      this._matchBindings[i] = this.qrwc.bindControl(componentName, 'match.' + i, false);
      this._loadBindings[i] = this.qrwc.bindControl(componentName, 'load.' + i, 0);
      this._saveBindings[i] = this.qrwc.bindControl(componentName, 'save.' + i, false);

      this.last[i] = this._lastBindings[i].bool;
      this.match[i] = this._matchBindings[i].bool;
      this.load[i] = this._loadBindings[i].value;
    }
  }

  Previous(): void {
    this._loadPreviousBinding.trigger();
  }

  Next(): void {
    this._loadNextBinding.trigger();
  }

  Load(index: number): void {
    if(index > 0 && index <= this.snapshotCount)
      this._loadBindings[index].trigger();
  }

  Save(index: number): void {
    if(index > 0 && index <= this.snapshotCount)
      this._saveBindings[index].trigger();
  }

  /** Set the ramp time for the snapshot recall.
   * @param value - The time in seconds to ramp to the new snapshot.
  */
  SetRampTime(value: number): void {
    this._rampTimeBinding.setValue(value);
  }
}
