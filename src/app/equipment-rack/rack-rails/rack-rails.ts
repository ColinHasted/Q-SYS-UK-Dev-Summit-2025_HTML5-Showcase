import { CommonModule } from '@angular/common';
import { Component, ElementRef, computed, inject, input } from '@angular/core';

@Component({
  selector: 'app-rack-rails',
  imports: [CommonModule],
  templateUrl: './rack-rails.html',
  styleUrl: './rack-rails.scss'
})
export class RackRails {
  /** Number of rack units (U) tall */
  units = input<number>(12, { alias: 'units' });

  /** Optional side. If not provided, falls back to host element class ("right"/"left"). */
  side = input<'left' | 'right' | null>(null, { alias: 'side' });

  /** Read host classes once to infer default side when input not provided */
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly fallbackSide: 'left' | 'right' =
    this.hostEl.nativeElement.classList.contains('right')
      ? 'right'
      : (this.hostEl.nativeElement.classList.contains('left') ? 'left' : 'left');

  /** Computed side preference */
  sideComputed = computed<'left' | 'right'>(() => this.side() ?? this.fallbackSide);

  /** Helper array for *ngFor based on units() */
  ruArray = computed(() => Array.from({ length: Math.max(0, Math.floor(this.units() ?? 0)) }));
}

