import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, HostBinding, signal, computed } from '@angular/core';
import { RackScrewComponent } from '../equipment-rack/rack-screw/rack-screw';
import { QrwcGraphicEqualizerComponent } from '../qrwc/components/qrwc-graphic-equalizer-component';
import { KnobComponent } from './knob/knob';
@Component({
  selector: 'app-graphic-eq',
  standalone: true,
  imports: [CommonModule, FormsModule, RackScrewComponent, KnobComponent],
  templateUrl: './graphic-eq.html',
  styleUrl: './graphic-eq.scss'
})
export class GraphicEqComponent {
  @HostBinding('attr.data-rack-units') rackUnits = '2';

  public GraphicEqualizer: QrwcGraphicEqualizerComponent;

    constructor() {
    this.GraphicEqualizer = new QrwcGraphicEqualizerComponent('Graphic_Equalizer');

    }
  // EQ frequency bands
  frequencies = ['16', '20','25','31.5','40','50','63','80','100','125','160','200','250','315','400','500','630','800','1k','1.25k','1.6k','2k','2.5k','3.15k','4k','5k','6.3k','8k','10k','12.5k','16k'];

  // Slider values (in dB, range -20 to +20)
  sliderValues: number[] = new Array(this.frequencies.length).fill(0);




  // Helper: clamp value
  private clamp(v: number, min: number, max: number) {
    return Math.min(max, Math.max(min, v));
  }



  // Handle slider value changes
  onSliderChange(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = Number(inputElement.value);
    this.GraphicEqualizer.setGain(index, value);
  }

  // Button toggle methods
  toggleBypass(): void {
     this.GraphicEqualizer.ToggleBypass();
  }

  toggleInvert(): void {
    this.GraphicEqualizer.ToggleInvert();
  }

  toggleMute(): void {
    this.GraphicEqualizer.ToggleMute();
  }


}
