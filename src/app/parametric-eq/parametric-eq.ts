import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, effect, HostBinding } from '@angular/core';
import { RackScrewComponent } from '../equipment-rack/rack-screw/rack-screw';
import { ParametricKnobComponent } from './knob/parametric-knob';
import { Chart, registerables, LogarithmicScale } from 'chart.js';
import {
  ParametricEQResponseCalculator,
  ParametricEQBand,
} from '../qrwc/components/helpers/parametric-eq-response-calculator';
import {
  EQBand,
  QrwcParametricEqualizerComponent,
} from '../qrwc/components/qrwc-parametric-equalizer-component';

function remapQRWCEqBands(eqBands: EQBand[]): ParametricEQBand[] {
  return eqBands.map((eqBand) => ({
    Frequency: eqBand.Frequency(),
    Gain: eqBand.Gain(),
    Bandwidth: eqBand.Bandwidth(),
    Q: eqBand.Q(),
    Type: eqBand.Type(),
  }));
}

@Component({
  selector: 'app-parametric-eq',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RackScrewComponent,
    ParametricKnobComponent,
  ],
  templateUrl: './parametric-eq.html',
  styleUrl: './parametric-eq.scss',
})
export class ParametricEqComponent implements AfterViewInit {
  @HostBinding('attr.data-rack-units') rackUnits = '2';
  private readonly ParametricEQResponseCalculator =
    new ParametricEQResponseCalculator(10, 20000, 48);

  chart: any;

  public ParametricEqualizer: QrwcParametricEqualizerComponent;

  constructor() {
    this.ParametricEqualizer = new QrwcParametricEqualizerComponent(
      'Parametric_Equalizer'
    );

    effect(() => {
      var bands = remapQRWCEqBands(this.ParametricEqualizer.ActiveEQBands());
      var response =
        this.ParametricEQResponseCalculator.calculateFilterResponse(bands);
      if (!this.chart) return;
      this.chart.data.datasets[0].data = response.map((r) => r.Magnitude);
      this.chart.data.datasets[1].data = response.map((r) => r.Phase);
      this.chart.data.datasets[2].data = this.ParametricEqualizer.EQBands.map(
        (band) => {
          return {
            x: Number(band.Frequency()) || 0,
            y: Number(band.Gain()) || 0,
          };
        }
      );
      requestAnimationFrame(() => {
        this.chart.update();
      });
    });
  }

  ngAfterViewInit(): void {
    // Register the necessary scales
    Chart.register(...registerables, LogarithmicScale);

    // Create the Chart.js chart
    const ctx = document.getElementById('responseGraph') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.ParametricEQResponseCalculator.frequencies, // Frequency labels

        datasets: [
          {
            label: 'EQ Response',
            data: [],
            cubicInterpolationMode: 'monotone',
            tension: 0.25, // light curve smoothing (0..1)
            borderColor: '#00cc66', // Darker green for dark background
            borderWidth: 1,
            fill: false,
            pointRadius: 0, // No points, just the line
            yAxisID: 'y', // Attach to the right Y-axis
          },
          {
            label: 'Phase (degrees)',
            data: [],
            cubicInterpolationMode: 'monotone',
            tension: 0.25, // light curve smoothing (0..1)
            borderColor: '#ff6b35', // Orange for contrast on dark background
            borderWidth: 1,
            fill: false,
            pointRadius: 0, // No points, just the line
            yAxisID: 'y1', // Attach to the right Y-axis
          },
          {
            label: 'EQ Band Points',
            data: [,],
            borderColor: '#ffdd00', // Bright yellow for visibility
            pointBorderColor: (context) => {
              return this.ParametricEqualizer.EQBands[
                Number(context.dataIndex)
              ]?.Bypass()
                ? '#cc2222' // Darker red for bypassed
                : '#ffdd00'; // Bright yellow for active
            },
            pointRadius: 1.5, // Slightly larger for visibility
            showLine: false, // Disable connecting lines between the dots
            yAxisID: 'y', // Attach to the right Y-axis
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 0, // Immediate resize response
        interaction: {
          intersect: false,
        },
        animation: {
          duration: 0, // Disable animations for better performance during resize
        },
        plugins: {
          legend: {
            display: false, // Hide legend for cleaner look
          },
        },
        scales: {
          x: {
            type: 'logarithmic',
            title: {
              display: false, // Remove title
            },
            min: 10,
            max: 20000,
            grid: {
              color: 'rgba(80, 204, 102, 0.1)', // Darker green grid
              lineWidth: 0.5,
            },
            ticks: {
              maxRotation: 0, // Horizontal labels
              minRotation: 0, // Horizontal labels
              callback: (value) => {
                const predefinedValues = [
                  20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000,
                ];

                if (predefinedValues.includes(+value)) {
                  return +value >= 1000 ? +value / 1000 + 'k' : value;
                }

                return undefined;
              },
              color: '#00cc66', // Darker green text
              font: {
                size: 9, // Smaller font
                family: 'monospace',
              },
            },
          },
          y: {
            title: {
              display: false, // Remove title
            },
            min: -20,
            max: 20,
            grid: {
              color: 'rgba(80, 204, 102, 0.15)', // Darker green grid
              lineWidth: 0.5,
            },
            ticks: {
              color: '#00cc66', // Darker green text
              font: {
                size: 9, // Smaller font
                family: 'monospace',
              },
              stepSize: 10, // Show every 10dB
            },
          },
          y1: {
            type: 'linear',
            position: 'right',
            title: {
              display: false, // Remove title
            },
            min: -180,
            max: 180,
            grid: {
              drawOnChartArea: false, // Avoid overlapping grid lines
            },
            ticks: {
              color: '#ff6b35', // Orange text to match phase line
              font: {
                size: 8, // Smaller font
                family: 'monospace',
              },
              stepSize: 90, // Show every 90 degrees
            },
          },
        },
      },
    });

    // Add ResizeObserver for better responsive behavior
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        if (this.chart) {
          this.chart.resize();
        }
      });
      resizeObserver.observe(ctx.parentElement!);
    }
  }

  updateBandGain(bandIndex: number, value: number) {
    this.ParametricEqualizer.setGain(bandIndex, value);
  }

  updateBandFreq(bandIndex: number, value: number) {
    this.ParametricEqualizer.setFrequencyPosition(bandIndex, value);
  }

  updateBandWidth(bandIndex: number, value: number) {
    this.ParametricEqualizer.setBandwidthPosition(bandIndex, value);
  }
  toggleBandBypass(bandIndex: number) {
    this.ParametricEqualizer.toggleBypass(bandIndex);
  }

  //
}
