import { Component, input } from '@angular/core';
import { RackScrewComponent } from '../equipment-rack/rack-screw/rack-screw';

@Component({
  selector: 'app-vent-plate',
  standalone: true,
  imports: [RackScrewComponent],
  templateUrl: './vent-plate.html',
  styleUrls: ['./vent-plate.scss']
})
export class VentPlateComponent {
  // allow optional width control in inches (1in = 3rem scale assumed for height)
  units = input<number>(1);

  readonly columns = Array(12); // 12 columns
  readonly vents = Array(5);   // 5 vents per column
}
