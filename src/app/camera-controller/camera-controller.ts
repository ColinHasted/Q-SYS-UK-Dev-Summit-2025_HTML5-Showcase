
import { FormsModule } from '@angular/forms';
import { Component, computed, Directive, HostBinding, OnDestroy } from '@angular/core';
import { RackScrewComponent } from '../equipment-rack/rack-screw/rack-screw';
import { TorxScrewComponent } from '../equipment-rack/torx-screw/torx-screw';
import { QrwcPtzCameraComponent,PtzDirection } from '../qrwc/components/qrwc-camera-component';
import { QrwcSnapshotControllerComponent } from '../qrwc/components/qrwc-snapshot-controller-component';

@Component({
  selector: 'app-camera-controller',
  standalone: true,
  imports: [FormsModule, RackScrewComponent, TorxScrewComponent],
  templateUrl: './camera-controller.html',
  styleUrl: './camera-controller.scss',
})
export class CameraControllerComponent implements OnDestroy {
  @HostBinding('attr.data-rack-units') rackUnits = '2';

  PtzDirection = PtzDirection; // Expose enum to template

  readonly PtzCamera: QrwcPtzCameraComponent;
  readonly SnapshotController: QrwcSnapshotControllerComponent;

  // Preset button state tracking
  private presetHoldTimers: Map<number, number> = new Map();
  private readonly HOLD_DURATION_MS = 2500; // 2.5 seconds

  previewImage = computed(() => {
      if (this.PtzCamera.privacyEnabled()) {
        return 'assets/images/camera/camera-privacy-small.webp';
      }
      const preview = this.PtzCamera.preview();
      if (preview && preview.length > 0) {
        return `data:image/jpeg;base64,${preview}`;
      }
      return 'assets/images/camera/camera-offline-small.webp';
    });

  constructor() {
    this.PtzCamera = new QrwcPtzCameraComponent('Camera');
    this.SnapshotController = new QrwcSnapshotControllerComponent(
      'Camera_Presets',
      9
    );
  }

  /**
   * Handle preset button press (mousedown/touchstart)
   * @param presetNumber - Preset number (1-9)
   */
  onPresetPress(presetNumber: number): void {
    if (presetNumber < 1 || presetNumber > 9) {
      console.warn(`Invalid preset number: ${presetNumber}. Must be between 1-9.`);
      return;
    }

    // Clear any existing timer for this preset
    this.clearPresetTimer(presetNumber);

    // Start hold timer for save operation
    const timerId = window.setTimeout(() => {
      this.savePreset(presetNumber);
      this.presetHoldTimers.delete(presetNumber);
    }, this.HOLD_DURATION_MS);

    this.presetHoldTimers.set(presetNumber, timerId);
  }

  /**
   * Handle preset button release (mouseup/touchend)
   * @param presetNumber - Preset number (1-9)
   */
  onPresetRelease(presetNumber: number): void {
    if (presetNumber < 1 || presetNumber > 9) {
      console.warn(`Invalid preset number: ${presetNumber}. Must be between 1-9.`);
      return;
    }

    // Check if timer is still active (short press)
    if (this.presetHoldTimers.has(presetNumber)) {
      this.clearPresetTimer(presetNumber);
      this.recallPreset(presetNumber);
    }
    // If timer is not active, it means hold operation already executed
  }

  /**
   * Recall a camera preset (short press)
   * @param presetNumber - Preset number (1-9)
   */
  private recallPreset(presetNumber: number): void {
    console.log(`Recalling preset ${presetNumber}`);
    // Load preset using snapshot controller (1-based index)
    this.SnapshotController.Load(presetNumber);
  }

  /**
   * Save current camera position to preset (long press/hold)
   * @param presetNumber - Preset number (1-9)
   */
  private savePreset(presetNumber: number): void {
    console.log(`Saving preset ${presetNumber}`);
    // Save current position to preset using snapshot controller (1-based index)
    this.SnapshotController.Save(presetNumber);
  }

  /**
   * Clear the hold timer for a specific preset
   * @param presetNumber - Preset number (1-9)
   */
  private clearPresetTimer(presetNumber: number): void {
    const timerId = this.presetHoldTimers.get(presetNumber);
    if (timerId) {
      clearTimeout(timerId);
      this.presetHoldTimers.delete(presetNumber);
    }
  }

  move(direction: PtzDirection, state: boolean, event: PointerEvent): void {
    this.toggleActiveState(event, state);
    this.PtzCamera.move(direction, state);
  }

    /**
   * Handles the zoom-in action for the camera.
   *
   * @remarks
   * This method controls the camera's zoom-in functionality by sending a digital signal to the control system.
   *
   * @param state The signal name or join number of the digital signal to set.
   * @param event The value to set the digital signal.
   */
  zoomIn(state: boolean, event: PointerEvent) {
    this.toggleActiveState(event, state);
    this.PtzCamera.zoomIn(state);
  }

  /**
   * Handles the zoom-out action for the camera.
   *
   * @remarks
   * This method controls the camera's zoom-out functionality by sending a digital signal to the control system.
   *
   * @param state Indicates whether to start (true) or stop (false) zooming out.
   * @param event The pointer event associated with the zoom-out action.
   */
  zoomOut(state: boolean, event: PointerEvent) {
    this.toggleActiveState(event, state);
    this.PtzCamera.zoomOut(state);
  }

  focusNear(state: boolean, event: PointerEvent) {
    this.toggleActiveState(event, state);
    this.PtzCamera.focusNear(state);
  }

  focusFar(state: boolean, event: PointerEvent) {
    this.toggleActiveState(event, state);
    this.PtzCamera.focusFar(state);
  }

  focusAuto(){
    this.PtzCamera.focusAuto();
  }

    /**
   * Enables the auto-framing feature of the camera.
   *
   * @remarks
   * This method enables the camera's auto-framing functionality, allowing it to automatically adjust its position and zoom to frame the subject.
   *
   * @param state Indicates whether to enable (true) or disable (false) auto-framing.
   * @param event The pointer event associated with the auto-framing action.
   */
  toggleAutoFraming(state: boolean, event: PointerEvent) {
    this.toggleActiveState(event, state);
    if (state) this.PtzCamera.toggleAutoFraming();
  }

  togglePrivacyMode(state: boolean, event: PointerEvent) {
    this.toggleActiveState(event, state);
    if (state) this.PtzCamera.togglePrivacy();
  }


  /**
   * Toggles the 'active' class on the event's target element based on the given state.
   *
   * @remarks
   * This utility method is used to visually indicate an active state on the UI by toggling a CSS class.
   *
   * @param event The pointer event that triggered the action.
   * @param state The desired state to reflect on the target element (true adds the class, false removes it).
   */
  toggleActiveState(event: PointerEvent, state: boolean): void {
    (event.target as HTMLElement).classList.toggle('active', state);
  }

  /**
   * Clean up all timers (called on component destroy)
   */
  ngOnDestroy(): void {
    this.presetHoldTimers.forEach(timerId => clearTimeout(timerId));
    this.presetHoldTimers.clear();
  }
}
