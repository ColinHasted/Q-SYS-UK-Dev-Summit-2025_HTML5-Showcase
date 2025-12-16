import { Component, OnInit, OnDestroy, HostBinding, effect, signal, computed } from '@angular/core';

import { TorxScrewComponent } from '../equipment-rack/torx-screw/torx-screw';
import { RackScrewComponent } from "../equipment-rack/rack-screw/rack-screw";
import { QrwcMeterComponent } from '../qrwc/components/qrwc-meter-component';

interface MeterState {
  currentAngle: ReturnType<typeof signal<number>>;
  targetAngle: ReturnType<typeof computed<number>>;
  peak: ReturnType<typeof computed<boolean>>;
  needleTransform: ReturnType<typeof computed<string>>;
}

@Component({
  selector: 'app-multi-vu-meter',
  standalone: true,
  imports: [ RackScrewComponent],
  templateUrl: './multi-vu-meter.html',
  styleUrls: ['./multi-vu-meter.scss']
})
export class MultiVuMeterComponent implements OnInit, OnDestroy {
    @HostBinding('attr.data-rack-units') rackUnits = '1';
  
  // Create QrwcMeterComponent instance for MultiChannelVuMeter (8 channels)
  private readonly meter = new QrwcMeterComponent('MultiChannelVuMeter', 8);
  
  channels = Array.from({ length: 8 }, (_, i) => i + 1);
  
  meterStates: MeterState[];
  
  private animationFrameId?: number;
  private isAnimating = false;
  private lastFrameTime = 0;
  
  // VU meter ballistics (ANSI standard)
  private readonly ATTACK_TIME = 0.3;  // 300ms attack
  private readonly RELEASE_TIME = 0.6; // 600ms release

  constructor() {
    // Initialize meter states with signals and computed
    this.meterStates = Array.from({ length: 8 }, (_, i) => {
      const currentAngle = signal(-60);
      const targetAngle = computed(() => this.dbToAngle(this.meter.getRms(i + 1)()));
      const peak = computed(() => this.meter.getRms(i + 1)() > 3);
      const needleTransform = computed(() => `translateX(-50%) rotate(${currentAngle()}deg)`);
      return { currentAngle, targetAngle, needleTransform, peak };
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

  private vuBallistics(prev: number, target: number, dt: number): number {
    const tau = target > prev ? this.ATTACK_TIME : this.RELEASE_TIME;
    const alpha = 1 - Math.exp(-dt / tau);
    return prev + alpha * (target - prev);
  }

  private startAnimation() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.lastFrameTime = performance.now();
    this.animate(this.lastFrameTime);
  }

  private animate = (currentTime: number) => {
    const dt = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
    this.lastFrameTime = currentTime;
    
    // Update each meter
    this.meterStates.forEach((state, i) => {
      // Apply VU meter ballistics
      const target = state.targetAngle();
      const current = state.currentAngle();
      const newAngle = this.vuBallistics(current, target, dt);
      state.currentAngle.set(newAngle);
      
    });

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private dbToAngle(db: number): number {
    if (db <= -24) return -50;
    if (db <= -20) return -50 + (db + 24) * (3 / 4);  // -50 to -47
    if (db <= -10) return -47 + (db + 20) * (10 / 10);  // -47 to -37
    if (db <= -7) return -37 + (db + 10) * (10 / 3);  // -37 to -27
    if (db <= -5) return -27 + (db + 7) * (44 / 2);  // -27 to 17
    if (db <= -3) return 17 + (db + 5) * (-21 / 2);  // 17 to -4
    if (db <= -1) return -4 + (db + 3) * (17 / 2);  // -4 to 13
    if (db <= 0) return 13 + (db + 1) * (10 / 1);  // 13 to 23
    if (db <= 1) return 23 + db * (11 / 1);  // 23 to 34
    if (db <= 2) return 34 + (db - 1) * (8 / 1);  // 34 to 42
    if (db <= 3) return 42 + (db - 2) * (7 / 1);  // 42 to 49
    if (db <= 3.2) return 49 + (db - 3) * (1 / 0.2);  // 49 to 50
    return 50;
  }
}

