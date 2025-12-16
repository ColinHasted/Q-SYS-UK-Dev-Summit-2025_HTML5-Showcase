import { Component, OnInit, OnDestroy, input, signal, computed } from '@angular/core';
import { TorxScrewComponent } from '../../equipment-rack/torx-screw/torx-screw';

@Component({
  selector: 'app-vu-meter',
  templateUrl: './vu-meter.html',
  styleUrls: ['./vu-meter.scss'],
  standalone: true,
  imports: [TorxScrewComponent]
})
export class VuMeterComponent implements OnInit, OnDestroy {
  level = input<number>(0);  // Signal level in dB (-30 to +7 dB)
  channel = input<string>('RIGHT'); // Channel label (LEFT or RIGHT)

  currentAngle = signal(-60);
  targetAngle = computed(() => this.dbToAngle(this.level()));
  
  private animationFrameId: number | null = null;
  private lastFrameTime = 0;
  
  // VU meter ballistics (ANSI standard)
  private readonly ATTACK_TIME = 0.3;  // 300ms attack
  private readonly RELEASE_TIME = 0.6; // 600ms release

  ngOnInit() {
    this.startAnimation();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private dbToAngle(db: number): number {
    // Piecewise linear interpolation between calibration points
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

  private vuBallistics(prev: number, target: number, dt: number): number {
    const tau = target > prev ? this.ATTACK_TIME : this.RELEASE_TIME;
    const alpha = 1 - Math.exp(-dt / tau);
    return prev + alpha * (target - prev);
  }

  private startAnimation() {
    this.lastFrameTime = performance.now();
    
    const animate = (currentTime: number) => {
      const dt = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
      this.lastFrameTime = currentTime;
      
      // Apply VU meter ballistics
      const newAngle = this.vuBallistics(this.currentAngle(), this.targetAngle(), dt);
      this.currentAngle.set(newAngle);

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }
}
