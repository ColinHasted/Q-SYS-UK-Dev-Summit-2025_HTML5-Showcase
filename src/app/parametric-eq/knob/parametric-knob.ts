import { Component, input, output, computed, signal } from '@angular/core';


@Component({
  selector: 'app-parametric-knob',
  standalone: true,
  imports: [],
  templateUrl: './parametric-knob.html',
  styleUrls: ['./parametric-knob.scss']
})
export class ParametricKnobComponent {
  // Angular 20 input signals
  label = input<string>('');
  minLabel = input<string>('');
  centerLabel = input<string>('');
  maxLabel = input<string>('');
  value = input.required<number>();
  min = input<number>(-20);
  max = input<number>(20);
  step = input<number>(0.5);
  sensitivity = input<number>(0.15); // pixels per unit
  size = input<'small' | 'large'>('small'); // Size variant

  // Output signal
  valueChange = output<number>();

  // Internal drag state
  private dragState = signal<{
    startX: number;
    startY: number;
    startValue: number;
    pointerId: number;
  } | null>(null);

  // Bound listeners for cleanup
  private onPointerMoveBound = this.onPointerMove.bind(this);
  private onPointerUpBound = this.onPointerUp.bind(this);


  // Computed rotation for the indicator
  indicatorRotation = computed(() => {
    const currentValue = this.value();
    const minVal = this.min();
    const maxVal = this.max();
    const normalizedValue = (currentValue - minVal) / (maxVal - minVal);
    const rotationAngle = (normalizedValue * 270) - 135; // -135deg to +135deg range
    return `rotate(${rotationAngle}deg)`;
  });

  // Helper: clamp value
  private clamp(v: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, v));
  }

  onPointerDown(event: PointerEvent): void {
    const el = event.target as HTMLElement;
    event.preventDefault();
    (el as Element).setPointerCapture?.(event.pointerId);


    this.dragState.set({
      startX: event.clientX,
      startY: event.clientY,
      startValue: this.value(),
      pointerId: event.pointerId
    });

    window.addEventListener('pointermove', this.onPointerMoveBound);
    window.addEventListener('pointerup', this.onPointerUpBound);
  }

  private onPointerMove(event: PointerEvent): void {
    const drag = this.dragState();
    if (!drag || event.pointerId !== drag.pointerId) return;

    const dX = event.clientX - drag.startX;
    const dY = event.clientY - drag.startY;
    const sensitivity = this.sensitivity();

    // Combine horizontal (right = +, left = -) and vertical (up = +, down = -) movement
    const deltaValue = (dX - dY) * sensitivity;
    const newValue = drag.startValue + deltaValue;

    const clampedValue = this.clamp(
      Math.round(newValue / this.step()) * this.step(),
      this.min(),
      this.max()
    );

    this.valueChange.emit(clampedValue);
  }

  private onPointerUp(event: PointerEvent): void {
    const drag = this.dragState();
    if (!drag) return;

    try {
      window.removeEventListener('pointermove', this.onPointerMoveBound);
      window.removeEventListener('pointerup', this.onPointerUpBound);
    } catch {}

    this.dragState.set(null);

  }

  onKeydown(event: KeyboardEvent): void {
    const step = this.step();
    let newValue = this.value();

    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      newValue = this.clamp(this.value() + step, this.min(), this.max());
      event.preventDefault();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      newValue = this.clamp(this.value() - step, this.min(), this.max());
      event.preventDefault();
    }

    if (newValue !== this.value()) {
      this.valueChange.emit(newValue);
    }
  }
}
