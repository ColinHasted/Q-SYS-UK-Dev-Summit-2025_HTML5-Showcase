import { Component, HostBinding, inject } from '@angular/core';

import { RackScrewComponent } from '../equipment-rack/rack-screw/rack-screw';
import { MixerFaderComponent } from './mixer-fader/mixer-fader';
import { QrwcAngularService } from '../qrwc/qrwc-angular-service';
import { QrwcControlBinding } from '../qrwc/qrwc-control-binding';
import { QrwcPinkNoiseComponent } from '../qrwc/components/qrwc-pink-noise-component';

@Component({
  selector: 'app-pink-noise',
  standalone: true,
  imports: [RackScrewComponent, MixerFaderComponent],
  templateUrl: './pink-noise.html',
  styleUrls: ['./pink-noise.scss']
})
export class PinkNoiseComponent {
  @HostBinding('attr.data-rack-units') rackUnits = '1';

  readonly pinkNoiseComponent = new QrwcPinkNoiseComponent('Pink_Noise_Generator');

  onMuteToggle() {
    this.pinkNoiseComponent.toggleMute();
  }

  onLevelChange(value: Event): void {
    const inputElement = value.target as HTMLInputElement;
    const newValue = Number(inputElement.value);
    this.pinkNoiseComponent.setLevel(newValue);
  }
}



