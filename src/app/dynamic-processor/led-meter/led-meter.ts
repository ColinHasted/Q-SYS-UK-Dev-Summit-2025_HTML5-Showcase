
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-led-meter',
  standalone: true,
  imports: [],
  templateUrl: './led-meter.html',
  styleUrl: './led-meter.scss'
})
export class LedMeterComponent {
  // Configuration inputs - all as signals for reactivity
  readonly value = input<number>(0);
  readonly min = input<number>(0);
  readonly max = input<number>(10);
  readonly ledCount = input<number>(10);
  readonly width = input<string>('4rem');
  readonly height = input<string>('0.5rem');
  readonly label = input<string>('');
  readonly showScale = input<boolean>(false);

  // Color thresholds (as percentages of total range)
  readonly greenThreshold = input<number>(60); // 0-60% green
  readonly yellowThreshold = input<number>(80); // 60-80% yellow
  // 80-100% red



  // Computed properties
  ledSegments = computed(() => Array(this.ledCount()).fill(0));

  activeLedCount = computed(() => {
    const normalizedValue = this.normalizeValue(this.value());
    return Math.floor(normalizedValue * this.ledCount());
  });

  scaleMarks = computed(() => {
    if (!this.showScale()) return [];

    // Create scale marks for min, middle, and max
    const range = this.max() - this.min();
    const middle = this.min() + (range / 2);

    return [
      { value: this.max(), position: '100%' },
      { value: middle, position: '50%' },
      { value: this.min(), position: '0%' }
    ];
  });

  /**
   * Normalize incoming value to 0-1 range
   * Handles both normal (min < max) and inverse (min > max) scales
   */
  private normalizeValue(value: number): number {
    const minVal = this.min();
    const maxVal = this.max();

    if (minVal === maxVal) return 0;

    if (minVal < maxVal) {
      // Normal scale: min to max
      const clampedValue = Math.max(minVal, Math.min(maxVal, value));
      return (clampedValue - minVal) / (maxVal - minVal);
    } else {
      // Inverse scale: max to min (e.g., 0dB to -40dB)
      const clampedValue = Math.max(maxVal, Math.min(minVal, value));
      return (minVal - clampedValue) / (minVal - maxVal);
    }
  }

  /**
   * Get LED color class based on position
   */
  getLedColorClass(index: number): string {
    const percentage = ((index + 1) / this.ledCount()) * 100;

    if (percentage <= this.greenThreshold()) {
      return 'green';
    } else if (percentage <= this.yellowThreshold()) {
      return 'yellow';
    } else {
      return 'red';
    }
  }

  /**
   * Check if LED should be active
   */
  isLedActive(index: number): boolean {
    return index < this.activeLedCount();
  }
}
