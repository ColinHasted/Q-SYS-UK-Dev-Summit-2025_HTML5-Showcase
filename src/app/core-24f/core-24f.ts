import { Component, HostBinding, input } from '@angular/core';
import { RackScrewComponent } from '../equipment-rack/rack-screw/rack-screw';
import { QrwcStatusComponent } from '../qrwc/components/qrwc-status-component';

@Component({
  selector: 'app-core-24f',
  standalone: true,
  imports: [RackScrewComponent],
  templateUrl: './core-24f.html',
  styleUrl: './core-24f.scss'
})
export class Core24fComponent {
  @HostBinding('attr.data-rack-units') rackUnits = '1';

  readonly Core : QrwcStatusComponent;
    constructor() {
    this.Core = new QrwcStatusComponent('Status');
    }

}
