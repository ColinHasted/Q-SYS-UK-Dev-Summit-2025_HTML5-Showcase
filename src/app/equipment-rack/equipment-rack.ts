import { Component, input } from '@angular/core';
import { RackRails } from "./rack-rails/rack-rails";

@Component({
  selector: 'app-equipment-rack',
  imports: [RackRails ],
  templateUrl: './equipment-rack.html',
  styleUrl: './equipment-rack.scss'
})
export class EquipmentRack {
  /** Number of rack units (U) tall */
  units = input<number>(24, { alias: 'units' });
}
