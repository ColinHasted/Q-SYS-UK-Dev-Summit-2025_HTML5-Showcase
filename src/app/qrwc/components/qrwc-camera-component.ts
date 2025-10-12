import { computed, effect, inject, signal, Signal } from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';

export enum PtzDirection {
  Up = 'tilt.up',
  Down = 'tilt.down',
  Left = 'pan.left',
  LeftUp = 'pan.left.tilt.up',
  LeftDown = 'pan.left.tilt.down',
  Right = 'pan.right',
  RightUp = 'pan.right.tilt.up',
  RightDown = 'pan.right.tilt.down',
}

export class QrwcPtzCameraComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings
  private readonly _jpegDataBinding;
  private readonly _autoFrameEnabledBinding;
  private readonly _privacyEnabledBinding;
  private readonly _autoFocusEnabledBinding;
  private readonly _presetHomeLoadBinding;
  private readonly _zoomInBinding;
  private readonly _zoomOutBinding;
  private readonly _panLeftBinding;
  private readonly _panRightBinding;
  private readonly _tiltUpBinding;
  private readonly _tiltDownBinding;
  private readonly _panLeftTiltUpBinding;
  private readonly _panLeftTiltDownBinding;
  private readonly _panRightTiltUpBinding;
  private readonly _panRightTiltDownBinding;

  /** JSON object containing the camera image data. */
  get jpegData(): Signal<string> {
    return this._jpegDataBinding.string;
  }

  get autoFrameEnabled(): Signal<boolean> {
    return this._autoFrameEnabledBinding.bool;
  }

  get privacyEnabled(): Signal<boolean> {
    return this._privacyEnabledBinding.bool;
  }

  get autoFocusEnabled(): Signal<boolean> {
    return this._autoFocusEnabledBinding.bool;
  }

  /** Base64 encoded JPEG image data for the camera image preview. */
  public readonly preview = computed<string>(() => {
    const data = this.jpegData();
    if (data) {
      try {
        return JSON.parse(data).IconData;
      } catch {
        console.log('Error parsing JPEG data');
      }
    }
    return '';
  });

  /**
   * PTZ Camera Component
   * @param componentName - The name of the Camera Component.
   */
  constructor(private componentName: string) {
    // Update bindings with actual component name
    this._jpegDataBinding = this.qrwc.bindControl(componentName, 'jpeg.data', '');
    this._autoFrameEnabledBinding = this.qrwc.bindControl(componentName, 'autoframe.enable', false);
    this._privacyEnabledBinding = this.qrwc.bindControl(componentName, 'toggle.privacy', false);
    this._autoFocusEnabledBinding = this.qrwc.bindControl(componentName, 'focus.auto', false);
    this._presetHomeLoadBinding = this.qrwc.bindControl(componentName, 'preset.home.load', false);
    this._zoomInBinding = this.qrwc.bindControl(componentName, 'zoom.in', false);
    this._zoomOutBinding = this.qrwc.bindControl(componentName, 'zoom.out', false);
    this._panLeftBinding = this.qrwc.bindControl(componentName, PtzDirection.Left, false);
    this._panRightBinding = this.qrwc.bindControl(componentName, PtzDirection.Right, false);
    this._tiltUpBinding = this.qrwc.bindControl(componentName, PtzDirection.Up, false);
    this._tiltDownBinding = this.qrwc.bindControl(componentName, PtzDirection.Down, false);
    this._panLeftTiltUpBinding = this.qrwc.bindControl(componentName, PtzDirection.LeftUp, false);
    this._panLeftTiltDownBinding = this.qrwc.bindControl(componentName, PtzDirection.LeftDown, false);
    this._panRightTiltUpBinding = this.qrwc.bindControl(componentName, PtzDirection.RightUp, false);
    this._panRightTiltDownBinding = this.qrwc.bindControl(componentName, PtzDirection.RightDown, false);
  }

  move(direction: PtzDirection, state: boolean): void {
    switch (direction) {
      case PtzDirection.Left:
        this._panLeftBinding.setValue(state);
        break;
      case PtzDirection.Right:
        this._panRightBinding.setValue(state);
        break;
      case PtzDirection.Up:
        this._tiltUpBinding.setValue(state);
        break;
      case PtzDirection.Down:
        this._tiltDownBinding.setValue(state);
        break;
      case PtzDirection.LeftUp:
        this._panLeftTiltUpBinding.setValue(state);
        break;
      case PtzDirection.LeftDown:
        this._panLeftTiltDownBinding.setValue(state);
        break;
      case PtzDirection.RightUp:
        this._panRightTiltUpBinding.setValue(state);
        break;
      case PtzDirection.RightDown:
        this._panRightTiltDownBinding.setValue(state);
        break;
    }
  }

  home(): void {
    this._presetHomeLoadBinding.trigger();
  }

   /**
   * Handles the zoom-in action for the camera.
   * @param state The signal state for zoom in control.
   */
   zoomIn(state: boolean) {
    this._zoomInBinding.setValue(state);
  }

  /**
   * Handles the zoom-out action for the camera.
   * @param state The signal state for zoom out control.
   */
  zoomOut(state: boolean) {
    this._zoomOutBinding.setValue(state);
  }

  /**
   * Toggles the auto-framing feature of the camera.
   */
  toggleAutoFraming() {
    const current = this._autoFrameEnabledBinding.bool();
    this._autoFrameEnabledBinding.setValue(!current);
  }

  /**
   * Toggles the privacy feature of the camera.
   */
  togglePrivacy() {
    const current = this._privacyEnabledBinding.bool();
    this._privacyEnabledBinding.setValue(!current);
  }
}
