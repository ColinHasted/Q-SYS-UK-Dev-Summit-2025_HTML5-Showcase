import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, HostBinding } from '@angular/core';
import { RackScrewComponent } from '../equipment-rack/rack-screw/rack-screw';
import { TorxScrewComponent } from '../equipment-rack/torx-screw/torx-screw';
import { QrwcResponsalyzerComponent, RtaBandwidth } from '../qrwc/components/qrwc-responsalyzer-component';
import { MagnitudeComponent } from './components/magnitude/magnitude.component';
import { RtaComponent } from "./components/rta/rta.component";
import { PhaseComponent } from './components/phase/phase.component';
@Component({
  selector: 'app-audio-analyser',
  standalone: true,
  imports: [CommonModule, FormsModule, RackScrewComponent, TorxScrewComponent, MagnitudeComponent, RtaComponent,PhaseComponent],
  templateUrl: './audio-analyser.html',
  styleUrl: './audio-analyser.scss'
})
export class AudioAnalyserComponent {
  @HostBinding('attr.data-rack-units') rackUnits = '2';

  readonly responsalyzerComponent = new QrwcResponsalyzerComponent(
    'Responsalyzer',
    RtaBandwidth.Octave24
  );


}
