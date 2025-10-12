import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, computed, HostBinding, OnDestroy } from '@angular/core';
import { RackScrewComponent } from '../equipment-rack/rack-screw/rack-screw';
import { TorxScrewComponent } from '../equipment-rack/torx-screw/torx-screw';
import { QrwcPtzCameraComponent } from '../qrwc/components/qrwc-camera-component';
import { QrwcSnapshotControllerComponent } from '../qrwc/components/qrwc-snapshot-controller-component';

@Component({
  selector: 'app-camera-controller',
  standalone: true,
  imports: [CommonModule, FormsModule, RackScrewComponent, TorxScrewComponent],
  templateUrl: './camera-controller.html',
  styleUrl: './camera-controller.scss',
})
export class CameraControllerComponent implements OnDestroy {
  @HostBinding('attr.data-rack-units') rackUnits = '2';

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

  /**
   * Clean up all timers (called on component destroy)
   */
  ngOnDestroy(): void {
    this.presetHoldTimers.forEach(timerId => clearTimeout(timerId));
    this.presetHoldTimers.clear();
  }
}
