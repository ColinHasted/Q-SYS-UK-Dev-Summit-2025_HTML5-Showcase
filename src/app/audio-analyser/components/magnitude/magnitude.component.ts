import { Component, effect, input } from '@angular/core';
import { flush } from '@angular/core/testing';
import { Chart, registerables, LogarithmicScale } from 'chart.js';

@Component({
  selector: 'app-magnitude',
  imports: [],
  templateUrl: './magnitude.component.html',
  styleUrl: './magnitude.component.scss',
})
export class MagnitudeComponent {
  // Chart instance
  private chart: any;
  magnitude = input<number[]>();
  coherence = input<number[]>();
  frequencies = input<number[]>();

  constructor() {
    Chart.register(...registerables, LogarithmicScale);

    // Effect to redraw the chart whenever magnitudeData changes
    effect(() => {
      const magnitude = this.magnitude();
      const coherence = this.coherence();

      if (!this.chart) return;
      this.chart.data.datasets[0].data = magnitude;
      this.chart.data.datasets[1].data = coherence;
      this.chart.data.labels = this.frequencies() ?? [];

      requestAnimationFrame(() => {
        this.chart.update();
      });
    });

  }

  ngAfterViewInit(): void {
    // Register the necessary scales
    this.initChart();
  }

  // Initialize the chart
  private initChart(): void {
    const ctx = document.getElementById(
      'magnitudeResponseGraph'
    ) as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.frequencies(), // X-axis is the frequency values
        datasets: [
          {
            label: 'Magnitude (dB)',
            data: this.magnitude(), // Y-axis is the magnitude data from the signal
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.25, // light curve smoothing (0..1)
            pointRadius: 0, // No points, just the line
            yAxisID: 'y', // Attach to the right Y-axis
          },
          {
            label: 'Coherence',
            borderWidth: 1,
            cubicInterpolationMode: 'monotone',
            tension: 0.25, // light curve smoothing (0..1)
            data: this.coherence(), // Coherence data (in percentage format)
            yAxisID: 'yCoherence', // Assign to the hidden y-axis
            borderColor: 'green',
            pointRadius: 0, // No points, just the line
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // Allows independent width & height
        layout: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },

        plugins: {
          title: {
            display: false,

          },
          legend: {
            display: false, // Set to false to hide the legend
          },
        },
        scales: {
          x: {
            type: 'logarithmic',
            title: {
              display: false,
              text: 'Frequency (Hz)',
              color: 'white',
            },
            min: 20, // Set fixed min for dB scale
            max: 20000, // Set fixed max for dB scale
            border: {
              display: false,
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.18)', // subtle grid
              lineWidth: 0.5,
              drawTicks: false,
            },
            ticks: {
              maxRotation: 0, // Horizontal labels
              minRotation: 0, // Horizontal labels
              padding: 0,
              callback: (value) => {
                const predefinedValues = [
                  20, 30, 40, 50, 100, 200, 300, 400, 1000, 2000, 3000, 4000,
                  5000, 10000, 20000,
                ];

                if (predefinedValues.includes(+value)) {
                  return +value >= 1000 ? +value / 1000 + 'k' : value;
                }

                return undefined;
              },
              font: {
                size: 5, // Smaller font
                family: 'monospace',
              },
              color: 'white',
            }, // Change Y1-axis label color},
          },
          y: {
            title: {
              display: false,
            },
            min: -20, // Set fixed min for dB scale
            max: 20, // Set fixed max for dB scale
            border: {
              display: false,
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.18)', // subtle grid
              lineWidth: 0.5,
              drawTicks: false,
            },
            ticks: {
              color: 'white', // Change Y1-axis label color
              padding: 0,
              //  stepSize: 20,  // Step size for the second Y-axis
              font: {
                size: 5, // Smaller font
                family: 'monospace',
              },
            },
          },

          yCoherence: {
            type: 'linear',
            display: false, // Hide this scale from being printed
            min: 0,
            max: 100, // 0-100% represented as 0-1
            afterDataLimits: (axis) => {
              axis.max = 100; // Keep full range values
              axis.min = 0; // Keep full range values
              axis.bottom = axis.top + (axis.bottom - axis.top) * 0.8;
              // Compress the coherence axis to only the top 20%
            },
          },
        },
      },
    });
  }
}
