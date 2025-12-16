
import { FormsModule } from '@angular/forms';
import { Component, effect, HostBinding } from '@angular/core';
import { RackScrewComponent } from '../equipment-rack/rack-screw/rack-screw';
import { DynamicKnobComponent } from './dynamic-knob/dynamic-knob';
import { LedMeterComponent } from './led-meter/led-meter';
import { QrwcGateComponent } from '../qrwc/components/qrwc-gate-component';
import { QrwcCompressorComponent } from '../qrwc/components/qrwc-compressor-component';
import { QrwcLimiterComponent } from '../qrwc/components/qrwc-limiter-component';

@Component({
  selector: 'app-dynamic-processor',
  standalone: true,
  imports: [ RackScrewComponent, DynamicKnobComponent, LedMeterComponent],
  templateUrl: './dynamic-processor.html',
  styleUrl: './dynamic-processor.scss'
})
export class DynamicProcessorComponent {
  @HostBinding('attr.data-rack-units') rackUnits = '1';

  readonly gate = new QrwcGateComponent('Gate');
  readonly compressor  = new QrwcCompressorComponent('Compressor');
  readonly limiter = new QrwcLimiterComponent('Peak_Limiter');

  }

