import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ScaleTick {
  position: number;
}

interface ScaleLabel {
  position: number;
  text: string;
}

@Component({
  selector: 'app-mixer-fader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mixer-fader.html',
  styleUrls: ['./mixer-fader.scss']
})
export class MixerFaderComponent {
  disabled = input<boolean>(false);
  max = input<number>(20);
  min = input<number>(-100);
  input = output<Event>();
  step = input<number>(1);
  unit = input<string>('dB');
  value = input<number>(0);

  // Major ticks: every 16.67% (7 ticks: 0, 16.67, 33.33, 50, 66.67, 83.33, 100)
  majorTicks: ScaleTick[] = [
    { position: 0 },
    { position: 16.67 },
    { position: 33.33 },
    { position: 50 },
    { position: 66.67 },
    { position: 83.33 },
    { position: 100 }
  ];

  // Minor ticks: every 16.67% offset by 8.33% (6 ticks)
  minorTicks: ScaleTick[] = [
    { position: 8.33 },
    { position: 25 },
    { position: 41.67 },
    { position: 58.33 },
    { position: 75 },
    { position: 91.67 }
  ];

  // Micro ticks: every 8.33% offset by 4.17% (12 ticks)
  microTicks: ScaleTick[] = [
    { position: 4.17 },
    { position: 12.5 },
    { position: 20.83 },
    { position: 29.17 },
    { position: 37.5 },
    { position: 45.83 },
    { position: 54.17 },
    { position: 62.5 },
    { position: 70.83 },
    { position: 79.17 },
    { position: 87.5 },
    { position: 95.83 }
  ];

  // Scale labels corresponding to major ticks
  scaleLabels: ScaleLabel[] = [
    { position: 0, text: '-100' },
    { position: 16.67, text: '-80' },
    { position: 33.33, text: '-60' },
    { position: 50, text: '-40' },
    { position: 66.67, text: '-20' },
    { position: 83.33, text: '0' },
    { position: 100, text: '+20' }
  ];

  onInputChange(event: Event): void {
    this.input.emit(event);
  }
}
