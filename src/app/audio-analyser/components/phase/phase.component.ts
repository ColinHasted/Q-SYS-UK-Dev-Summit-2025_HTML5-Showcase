import { AfterViewInit, Component, effect, input } from '@angular/core';
import { Chart, LogarithmicScale, registerables } from 'chart.js';

@Component({
  selector: 'app-phase',
  imports: [],
  templateUrl: './phase.component.html',
  styleUrl: './phase.component.scss'
})
export class PhaseComponent implements AfterViewInit {
  // Chart instance
  private chart: any;
  phase = input<number[]>();
  frequencies = input<number[]>();

  constructor() {
    Chart.register(...registerables, LogarithmicScale);

    // Effect to redraw the chart whenever phase changes
    effect(() => {
      const phase = this.phase();
      if (!this.chart) return;
      this.chart.data.datasets[0].data = phase || [];
            this.chart.data.labels = this.frequencies() ?? [];

      requestAnimationFrame(() => {
        this.chart.update();
      });
    });
  }


  ngAfterViewInit(): void {
    this.initChart();
  }

  // Initialize the chart
  private initChart(): void {
    const ctx = document.getElementById('phaseResponseGraph') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.frequencies(), // X-axis is the frequency values
        datasets: [
          {
            label: 'Phase (degrees)',
            data: this.phase(),
            borderColor: 'rgba(192, 75, 75, 1)',
            borderWidth: 1,
                        cubicInterpolationMode: 'monotone',
            tension: 0.25, // light curve smoothing (0..1)
            fill: false,
            pointRadius: 0,
            yAxisID: 'y',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        layout: { padding: { top: 0, right: 4, bottom: 0, left: 4 } },
        plugins: {
          title: { display: false },
          legend: { display: false },
        },
        scales: {
          x: {
            type: 'logarithmic',
            title: { display: false },
            min: 20,
            max: 20000,
            border: { display: false },
            grid: { color: 'rgba(255,255,255,0.18)', lineWidth: 0.5, drawTicks: false },
            ticks: {
                       maxRotation: 0, // Horizontal labels
              minRotation: 0, // Horizontal labels
              callback: (value) => {
                const predefinedValues = [20,30,40,50,100,200,300,400,1000,2000,3000,4000,5000,10000,20000];
                if (predefinedValues.includes(+value)) return +value >= 1000 ? +value/1000 + 'k' : value;
                return undefined;
              }, font: { size: 5, family: 'monospace' }, color: 'rgba(255,255,255,0.85)', padding: 2 },
          },
          y: {
            type: 'linear', position: 'left', title: { display: false }, min: -180, max: 180,
            border: { display: false }, grid: { color: 'rgba(255,255,255,0.18)', lineWidth: 0.5, drawTicks: false },
            ticks: {
                            maxRotation: 0, // Horizontal labels
              minRotation: 0, // Horizontal labels
              color: 'rgba(255,255,255,0.85)', stepSize: 30, font: { size: 5, family: 'monospace' }, padding: 2 }
          },
          yCoherence: { type: 'linear', display: false, min: 0, max: 100 }
        }
      }
    });
  }

}
