import { Component } from '@angular/core';

@Component({
  selector: 'app-torx-screw',
  standalone: true,
  template: `
    <div class="screw">
      <div
        class="screw__head"
        [style.transform]="'rotate(' + rotation + 'deg)'"
      >
        <svg
          width="100%"
          height="100%"
          version="1.1"
          viewBox="0 0 1200 1200"
          xmlns="http://www.w3.org/2000/svg"
          fill="#0a0a0a"
        >
          <path
            d="m676.8 226.8 26.398 93.602c12 42 55.199 66 97.199 56.398l94.801-24c78-19.199 133.2 75.602 76.801 134.4l-67.199 69.602c-30 31.199-30 80.398 0 111.6l67.199 69.602c56.398 57.602 1.1992 153.6-76.801 134.4l-94.801-24c-42-10.801-85.199 14.398-97.199 56.398l-26.398 93.602c-22.801 78-132 78-154.8 0l-26.398-93.602c-12-42-55.199-66-97.199-56.398l-94.801 24c-78 19.199-133.2-75.602-76.801-134.4l67.199-69.602c30-31.199 30-80.398 0-111.6l-67.199-69.602c-56.398-57.602-1.1992-153.6 76.801-134.4l94.801 24c42 10.801 85.199-14.398 97.199-56.398l26.398-93.602c22.801-78 133.2-78 154.8 0z"
          />
        </svg>
      </div>
    </div>
  `,
  styleUrl: './torx-screw.scss',
})
export class TorxScrewComponent {
  rotation = Math.random() * 60; // Random rotation between 0-360 degrees
}
