import { AfterViewInit, Component, effect, input } from '@angular/core';
import { Chart, registerables, LogarithmicScale } from 'chart.js';

@Component({
  selector: 'app-rta',
  imports: [],
  templateUrl: './rta.component.html',
  styleUrl: './rta.component.scss'
})
export class RtaComponent implements AfterViewInit {
  // Chart instance
  private chart: any;
  response = input<number[]>();
  frequencies = input<number[]>();

  constructor() {
    Chart.register(...registerables, LogarithmicScale);

    // Effect to redraw the chart whenever response changes
    effect(() => {
      const response = this.response();
      if (!this.chart) return;
            this.chart.data.labels = this.frequencies() ?? [];

      this.chart.data.datasets[0].data =
        response;
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
    const ctx = document.getElementById('rtaResponseGraph') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.frequencies(), // X-axis is the frequency values
        datasets: [
          {
            label: 'Magnitude (dB)',
            data: this.response(), // Y-axis is the magnitude data from the signal
            borderColor: 'rgba(192, 75, 192, 1)', // Different color for the second line
            borderWidth: 1,
            fill: 'start',
            pointRadius: 0, // No points, just the line
            backgroundColor: 'rgba(192, 75, 192, 0.5)',
            yAxisID: 'y' // Attach to the right Y-axis
          }
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
            border: { display: false },
            grid: {
              color: 'rgba(255, 255, 255, 0.18)',
              lineWidth: 0.5,
              drawTicks: false,
            },
            ticks: {
                            maxRotation: 0, // Horizontal labels
              minRotation: 0, // Horizontal labels
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
              color: 'rgba(255,255,255,0.85)',
            }, // Change Y1-axis label color},
          },
          y: {
            title: {
              display: false,
              text: 'Magnitude (dB)',
              color: 'white',
            },
            min: -80, // Set fixed min for dB scale
            max: 20, // Set fixed max for dB scale
            border: { display: false },
            grid: {
              color: 'rgba(255, 255, 255, 0.18)',
              lineWidth: 0.5,
              drawTicks: false,
            },
            ticks: {
              color: 'rgba(255,255,255,0.85)',
              font: {
                size: 5, // Smaller font
                family: 'monospace',
              },
            },
          }

        }
      }
    });
  }

}
