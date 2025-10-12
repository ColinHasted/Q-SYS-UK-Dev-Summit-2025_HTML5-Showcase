import { Component, HostBinding, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RackScrewComponent } from '../equipment-rack/rack-screw/rack-screw';
import { MixerFaderComponent } from './mixer-fader/mixer-fader';
import { QrwcAngularService } from '../qrwc/qrwc-angular-service';
import { QrwcControlBinding } from '../qrwc/qrwc-control-binding';

@Component({
  selector: 'app-pink-noise',
  standalone: true,
  imports: [CommonModule, RackScrewComponent, MixerFaderComponent],
  templateUrl: './pink-noise.html',
  styleUrls: ['./pink-noise.scss']
})
export class PinkNoiseComponent {
  @HostBinding('attr.data-rack-units') rackUnits = '1';

  readonly qrwc = inject(QrwcAngularService);

  // Bind to Q-SYS controls - single subscription per control with all properties available
  readonly mute = new QrwcControlBinding(
    this.qrwc,
    'Pink_Noise_Generator',
    'mute'
  );

  readonly gain = new QrwcControlBinding(
    this.qrwc,
    'Pink_Noise_Generator',
    'level',
    true // use logarithmic position scaling
  );

  // Expose signals for template (with original names for compatibility)
  readonly Mute = this.mute.bool;      // or use .value() for numeric mute
  readonly Gain = this.gain.value;

  onGainChange(value: Event): void {
    const inputElement = value.target as HTMLInputElement;
    const newValue = Number(inputElement.value);
    this.gain.setValue(newValue);
  }

  onMuteToggle(): void {
    this.mute.setValue(!this.mute.bool());
  }
}
