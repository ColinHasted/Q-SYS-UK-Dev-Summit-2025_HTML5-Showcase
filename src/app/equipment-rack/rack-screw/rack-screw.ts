import { Component } from '@angular/core';

@Component({
  selector: 'app-rack-screw',
  standalone: true,
  template: `
    <div class="screw-head">
      <div class="screw-cross" [style.transform]="'rotate(' + rotation + 'deg)'">
        <div class="star"></div>
      </div>
    </div>
  `,
  styleUrl: './rack-screw.scss'
})
export class RackScrewComponent {
  rotation = Math.random() * 90; // Random rotation between 0-90 degrees
}
