import { computed, inject, output, Signal } from '@angular/core';
import { QrwcAngularService } from '../qrwc-angular-service';
import { Component } from '@q-sys/qrwc';

export class QrwcAudioPlayerComponent {
  private readonly qrwc: QrwcAngularService = inject(QrwcAngularService);

  // Private bindings
  private readonly _allFilesBinding;
  private readonly _directoryBinding;
  private readonly _directoryUiBinding;
  private readonly _fastForwardBinding;
  private readonly _filenameBinding;
  private readonly _filenameUiBinding;
  private readonly _gainBinding;
  private readonly _locateBinding;
  private readonly _loopBinding;
  private readonly _muteBinding;
  private readonly _pausedBinding;
  private readonly _playBinding;
  private readonly _pauseBinding;
  private readonly _stopBinding;
  private readonly _playOnStartupBinding;
  private readonly _playingBinding;
  private readonly _progressBinding;
  private readonly _remainingBinding;
  private readonly _rewindBinding;
  private readonly _rootBinding;
  private readonly _rootUiBinding;
  private readonly _statusBinding;
  private readonly _stoppedBinding;
  private readonly _playlistFileBinding;
  private readonly _playlistRepeatBinding;
  private readonly _playlistShuffleBinding;

  // Will be initialized in the constructor to ensure componentName is available
  private readonly audioPlayerComponent: Signal<Component | null>;

  get allFiles(): Signal<string> {
    return this._allFilesBinding.string;
  }

  get directory(): Signal<string> {
    return this._directoryBinding.string;
  }

  get directoryUi(): Signal<string> {
    return this._directoryUiBinding.string;
  }

  get fastForward(): Signal<boolean> {
    return this._fastForwardBinding.bool;
  }

  get filename(): Signal<string> {
    return this._filenameBinding.string;
  }

  get filenameUi(): Signal<string> {
    return this._filenameUiBinding.string;
  }

  get gain(): Signal<number> {
    return this._gainBinding.value;
  }

  get locate(): Signal<number> {
    return this._locateBinding.value;
  }

  get loop(): Signal<boolean> {
    return this._loopBinding.bool;
  }

  get mute(): Signal<boolean> {
    return this._muteBinding.bool;
  }

  get paused(): Signal<boolean> {
    return this._pausedBinding.bool;
  }

  get playOnStartup(): Signal<boolean> {
    return this._playOnStartupBinding.bool;
  }

  get playing(): Signal<boolean> {
    return this._playingBinding.bool;
  }

  get progress(): Signal<number> {
    return this._progressBinding.value;
  }

  get remaining(): Signal<number> {
    return this._remainingBinding.value;
  }

  get rewind(): Signal<boolean> {
    return this._rewindBinding.bool;
  }

  get root(): Signal<string> {
    return this._rootBinding.string;
  }

  get rootUi(): Signal<string> {
    return this._rootUiBinding.string;
  }

  get status(): Signal<string> {
    return this._statusBinding.string;
  }

  get stopped(): Signal<boolean> {
    return this._stoppedBinding.bool;
  }

  get playlistFile(): Signal<string> {
    return this._playlistFileBinding.string;
  }

  get playlistRepeat(): Signal<boolean> {
    return this._playlistRepeatBinding.bool;
  }

  get playlistShuffle(): Signal<boolean> {
    return this._playlistShuffleBinding.bool;
  }

  /**
   * Audio Player Component
   * @param componentName - The name of the Audio Player Component.
   */
  constructor(private componentName: string) {
    // Initialize computed audioPlayerComponent via service helper for correct timing
    this.audioPlayerComponent = this.qrwc.getComputedComponent(componentName);

    // Update bindings with actual component name
    this._allFilesBinding = this.qrwc.bindControl(componentName, 'all.files', '');
    this._directoryBinding = this.qrwc.bindControl(componentName, 'directory', '');
    this._directoryUiBinding = this.qrwc.bindControl(componentName, 'directory.ui', '');
    this._fastForwardBinding = this.qrwc.bindControl(componentName, 'fast.forward', false);
    this._filenameBinding = this.qrwc.bindControl(componentName, 'filename', '');
    this._filenameUiBinding = this.qrwc.bindControl(componentName, 'filename.ui', '');
    this._gainBinding = this.qrwc.bindControl(componentName, 'gain', 0);
    this._locateBinding = this.qrwc.bindControl(componentName, 'locate', 0);
    this._loopBinding = this.qrwc.bindControl(componentName, 'loop', false);
    this._muteBinding = this.qrwc.bindControl(componentName, 'mute', false);
    this._pausedBinding = this.qrwc.bindControl(componentName, 'paused', false);
    this._playBinding = this.qrwc.bindControl(componentName, 'play', false);
    this._pauseBinding = this.qrwc.bindControl(componentName, 'pause', false);
    this._stopBinding = this.qrwc.bindControl(componentName, 'stop', false);
    this._playOnStartupBinding = this.qrwc.bindControl(componentName, 'play.on.startup', false);
    this._playingBinding = this.qrwc.bindControl(componentName, 'playing', false);
    this._progressBinding = this.qrwc.bindControl(componentName, 'progress', 0);
    this._remainingBinding = this.qrwc.bindControl(componentName, 'remaining', 0);
    this._rewindBinding = this.qrwc.bindControl(componentName, 'rewind', false);
    this._rootBinding = this.qrwc.bindControl(componentName, 'root', '');
    this._rootUiBinding = this.qrwc.bindControl(componentName, 'root.ui', '');
    this._statusBinding = this.qrwc.bindControl(componentName, 'status', '');
    this._stoppedBinding = this.qrwc.bindControl(componentName, 'stopped', false);
    this._playlistFileBinding = this.qrwc.bindControl(componentName, 'playlist.file', '');
    this._playlistRepeatBinding = this.qrwc.bindControl(componentName, 'playlist.repeat', false);
    this._playlistShuffleBinding = this.qrwc.bindControl(componentName, 'playlist.shuffle', false);
  }

  Play(): void {
    this._playBinding.trigger();
  }

  Stop(): void {
    this._stopBinding.trigger();
  }
  
  Pause(): void {
    this._pauseBinding.trigger();
  }

  Rewind(state: boolean): void {
    this._rewindBinding.setValue(state);
  }

  FastForward(state: boolean): void {
    this._fastForwardBinding.setValue(state);
  }

  LoopToggle(): void {
    const current = this.loop();
    this._loopBinding.setValue(!current);
  }

  AutoPlayOnStartupToggle(): void {
    const current = this.playOnStartup();
    this._playOnStartupBinding.setValue(!current);
  }

  MuteToggle(): void {
    const current = this.mute();
    this._muteBinding.setValue(!current);
  }

  SetGain(value: number): void {
    this._gainBinding.setValue(value);
  }
}
