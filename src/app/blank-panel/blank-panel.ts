import { Component } from '@angular/core';
import { RackScrewComponent } from '../equipment-rack/rack-screw/rack-screw';

@Component({
  selector: 'app-blank-panel',
  standalone: true,
  imports: [RackScrewComponent],
  templateUrl: './blank-panel.html',
  styleUrl: './blank-panel.scss'
})
export class BlankPanelComponent {}
