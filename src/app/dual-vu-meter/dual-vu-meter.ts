import { Component, OnInit, OnDestroy, HostBinding, signal, computed } from '@angular/core';

import { TorxScrewComponent } from '../equipment-rack/torx-screw/torx-screw';
import { RackScrewComponent } from "../equipment-rack/rack-screw/rack-screw";
import { QrwcMeterComponent } from '../qrwc/components/qrwc-meter-component';

interface MeterState {
  currentAngle: ReturnType<typeof signal<number>>;
  targetAngle: ReturnType<typeof computed<number>>;
  needleTransform: ReturnType<typeof computed<string>>;
}

@Component({
  selector: 'app-dual-vu-meter',
  standalone: true,
  imports: [ RackScrewComponent],
  templateUrl: './dual-vu-meter.html',
  styleUrls: ['./dual-vu-meter.scss']
})
export class DualVuMeterComponent implements OnInit, OnDestroy {
    @HostBinding('attr.data-rack-units') rackUnits = '2';
  
  // Create QrwcMeterComponent instance for StereoRmsMeter
  private readonly meter = new QrwcMeterComponent('StereoRmsMeter', 2);
  
  meterStates: MeterState[];
  
  private animationFrameId?: number;
  private isAnimating = false;
  private lastFrameTime = 0;
  
  // VU meter ballistics (ANSI standard)
  private readonly ATTACK_TIME = 0.3;  // 300ms attack
  private readonly RELEASE_TIME = 0.6; // 600ms release

  constructor() {
    // Initialize meter states with signals and computed
    this.meterStates = Array.from({ length: 2 }, (_, i) => {
      const currentAngle = signal(-60);
      const targetAngle = computed(() => this.dbToAngle(this.meter.getRms(i + 1)()));
      const needleTransform = computed(() => `rotate(${currentAngle()}deg)`);
      return { currentAngle, targetAngle, needleTransform };
    });
  }

  ngOnInit() {
    this.startAnimation();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private startAnimation() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.lastFrameTime = performance.now();
    this.animate();
  }

  private animate = (currentTime: number = performance.now()) => {
    const dt = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
    this.lastFrameTime = currentTime;
    
    this.meterStates.forEach((state) => {
      // Apply VU meter ballistics
      const newAngle = this.vuBallistics(state.currentAngle(), state.targetAngle(), dt);
      state.currentAngle.set(newAngle);
    });

    this.animationFrameId = requestAnimationFrame(this.animate);
  };
  
  private vuBallistics(prev: number, target: number, dt: number): number {
    const tau = target > prev ? this.ATTACK_TIME : this.RELEASE_TIME;
    const alpha = 1 - Math.exp(-dt / tau);
    return prev + alpha * (target - prev);
  }

  private dbToAngle(db: number): number {
    if (db <= -32) return -60;
    if (db <= -30) return -60 + (db + 32) * (2 / 2);  // -60 to -58
    if (db <= -20) return -58 + (db + 30) * (10.5 / 10);  // -58 to -47.5
    if (db <= -10) return -47.5 + (db + 20) * (11.5 / 10);  // -47.5 to -36
    if (db <= -7) return -36 + (db + 10) * (12.8 / 3);  // -36 to -23.2
    if (db <= -5) return -23.2 + (db + 7) * (12.9 / 2);  // -23.2 to -10.3
    if (db <= -4) return -10.3 + (db + 5) * (7.6 / 1);  // -10.3 to -2.7
    if (db <= -3) return -2.7 + (db + 4) * (7.3 / 1);  // -2.7 to 4.6
    if (db <= -2) return 4.6 + (db + 3) * (5.6 / 1);  // 4.6 to 10.2
    if (db <= -1) return 10.2 + (db + 2) * (6.6 / 1);  // 10.2 to 16.8
    if (db <= 0) return 16.8 + (db + 1) * (5.7 / 1);  // 16.8 to 22.5
    if (db <= 1) return 22.5 + db * (5.0 / 1);  // 22.5 to 27.5
    if (db <= 2) return 27.5 + (db - 1) * (6.0 / 1);  // 27.5 to 33.5
    if (db <= 3) return 33.5 + (db - 2) * (5.7 / 1);  // 33.5 to 39.2
    if (db <= 4) return 39.2 + (db - 3) * (5.0 / 1);  // 39.2 to 44.2
    if (db <= 5) return 44.2 + (db - 4) * (4.8 / 1);  // 44.2 to 49
    if (db <= 7) return 49 + (db - 5) * (9.0 / 2);  // 49 to 58
    return 58;
  }

  onMeterClick() {
    // Click handler
  }
}
