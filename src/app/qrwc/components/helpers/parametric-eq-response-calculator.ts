import { FrequencyResponse } from "../qrwc-parametric-equalizer-component";

/**
 * Enum representing different filter types.
 */
export enum FilterType {
  Parametric = 1,
  LowShelf = 2,
  HighShelf = 3

}

/**
 * Interface representing a response at a given frequency.
 */
export interface Response {
  Frequency: number;
  Magnitude: number;
  Phase: number;
}

/**
 * Interface representing a band in a parametric equalizer.
 */
export interface ParametricEQBand {
  Frequency: number;
  Gain: number;
  Q: number;
  Type: FilterType;
}
/*
 * Class that calculates the response of a parametric equalizer.
 */
export class ParametricEQResponseCalculator {
  /**
   * An array of frequency points in Hz.
   * These points are calculated logarithmically based on the given start frequency, end frequency, and resolution.
   */
  public readonly frequencies: number[];
  /**
   * A dictionary mapping filter types to their corresponding response calculation methods.
   */
  private readonly filterResponseCalculators: Record<FilterType, ( frequency: number,band: ParametricEQBand,sampleRate?:number) => {
    realResponse: number;
    imagResponse: number;
}> = {
    [FilterType.Parametric]: this.calculateBiquadResponse.bind(this),
    [FilterType.LowShelf]: this.calculateLowShelfResponse.bind(this),
    [FilterType.HighShelf]: this.calculateHighShelfResponse.bind(this),
  };

  /**
   * Constructs a new instance of the ParametricEQResponseCalculator class.
   * Initializes the frequency points based on the given start frequency, end frequency, and resolution.
   *
   * @param startFrequency - The starting frequency in Hz (default is 10 Hz).
   * @param endFrequency - The ending frequency in Hz (default is 20,000 Hz).
   * @param resolution - The number of frequency points per octave (default is 48).
   */
  constructor(
    startFrequency: number = 10,
    endFrequency: number = 20000,
    resolution: number = 48
  ) {
    this.frequencies = this.calculateFrequencyPoints(
      startFrequency,
      endFrequency,
      resolution
    );
  }

  /**
   * Calculates the real and imaginary response.
   * @param realNumerator - The real part of the numerator.
   * @param imagNumerator - The imaginary part of the numerator.
   * @param realDenominator - The real part of the denominator.
   * @param imagDenominator - The imaginary part of the denominator.
   * @returns An object containing the real and imaginary response.
   */
  calculateResponse(
    realNumerator: number,
    imagNumerator: number,
    realDenominator: number,
    imagDenominator: number
  ): { realResponse: number; imagResponse: number } {
    const demonimator =
      realDenominator * realDenominator + imagDenominator * imagDenominator;
    const realResponse =
      (realNumerator * realDenominator + imagNumerator * imagDenominator) /
      demonimator;
    const imagResponse =
      (imagNumerator * realDenominator - realNumerator * imagDenominator) /
      demonimator;
    return { realResponse, imagResponse };
  }

  calculateBiquadResponse(
    f: number,
    eqBand: ParametricEQBand,
    sampleRate: number = 48000
  ) {
    const omega0 = (2 * Math.PI * eqBand.Frequency) / sampleRate;
    const alpha = Math.sin(omega0) / (2 * eqBand.Q);
    const A = Math.pow(10, eqBand.Gain / 40); // Gain factor from dB to linear
    const cosOmega0 = Math.cos(omega0);
    // Biquad coefficients for a peak/notch filter
    const b0 = 1 + alpha * A;
    const b1 = -2 * cosOmega0;
    const b2 = 1 - alpha * A;
    const a0 = 1 + alpha / A;
    const a1 = -2 * cosOmega0;
    const a2 = 1 - alpha / A;

    // Calculate the frequency response at frequency 'f'
    const omega = (2 * Math.PI * f) / sampleRate;
    const e1 = Math.cos(omega);
    const e2 = Math.sin(omega);

    // Real and imaginary components of the numerator
    const realNumerator = b0 + b1 * e1 + b2 * (e1 * e1 - e2 * e2);
    const imagNumerator = b1 * e2 + b2 * 2 * e1 * e2;

    // Real and imaginary components of the denominator
    const realDenominator = a0 + a1 * e1 + a2 * (e1 * e1 - e2 * e2);
    const imagDenominator = a1 * e2 + a2 * 2 * e1 * e2;

    // Complex response (H(f)) is numerator / denominator (complex division)
    return this.calculateResponse(
      realNumerator,
      imagNumerator,
      realDenominator,
      imagDenominator
    );
  }

  calculateLowShelfResponse(
    f: number,
    eqBand: ParametricEQBand,
    sampleRate: number = 48000
  ) {
    const A = Math.pow(10, eqBand.Gain / 40); // Gain factor from dB to linear
    const omega0 = (2 * Math.PI * eqBand.Frequency) / sampleRate; // Normalised frequency
    const alpha =
      (Math.sin(omega0) / 2) * Math.sqrt((A + 1 / A - 1) * (1 / 0.4));

    const cosOmega0 = Math.cos(omega0);

    const b0 = A * (A + 1 - (A - 1) * cosOmega0 + 2 * Math.sqrt(A) * alpha);
    const b1 = 2 * A * (A - 1 - (A + 1) * cosOmega0);
    const b2 = A * (A + 1 - (A - 1) * cosOmega0 - 2 * Math.sqrt(A) * alpha);

    const a0 = A + 1 + (A - 1) * cosOmega0 + 2 * Math.sqrt(A) * alpha;
    const a1 = -2 * (A - 1 + (A + 1) * cosOmega0);
    const a2 = A + 1 + (A - 1) * cosOmega0 - 2 * Math.sqrt(A) * alpha;

    // Calculate the frequency response at frequency 'f'
    const omega = (2 * Math.PI * f) / sampleRate;
    const e1 = Math.cos(omega);
    const e2 = Math.sin(omega);

    // Real and imaginary components of the numerator
    const realNumerator = b0 + b1 * e1 + b2 * (e1 * e1 - e2 * e2);
    const imagNumerator = b1 * e2 + b2 * 2 * e1 * e2;

    // Real and imaginary components of the denominator
    const realDenominator = a0 + a1 * e1 + a2 * (e1 * e1 - e2 * e2);
    const imagDenominator = a1 * e2 + a2 * 2 * e1 * e2;

    // Complex response (H(f)) is numerator / denominator (complex division)
    return this.calculateResponse(
      realNumerator,
      imagNumerator,
      realDenominator,
      imagDenominator
    );
  }

  calculateHighShelfResponse(
    f: number,
    eqBand: ParametricEQBand,
    sampleRate: number = 48000
  ) {
    const A = Math.pow(10, eqBand.Gain / 40); // Gain factor from dB to linear
    const omega0 = (2 * Math.PI * eqBand.Frequency) / sampleRate; // Normalised frequency
    const alpha =
      (Math.sin(omega0) / 2) * Math.sqrt((A + 1 / A - 1) * (1 / 0.4));

    const cosOmega0 = Math.cos(omega0);

    const b0 = A * (A + 1 + (A - 1) * cosOmega0 + 2 * Math.sqrt(A) * alpha);
    const b1 = -2 * A * (A - 1 + (A + 1) * cosOmega0);
    const b2 = A * (A + 1 + (A - 1) * cosOmega0 - 2 * Math.sqrt(A) * alpha);

    const a0 = A + 1 - (A - 1) * cosOmega0 + 2 * Math.sqrt(A) * alpha;
    const a1 = 2 * (A - 1 - (A + 1) * cosOmega0);
    const a2 = A + 1 - (A - 1) * cosOmega0 - 2 * Math.sqrt(A) * alpha;

    // Calculate the frequency response at frequency 'f'
    const omega = (2 * Math.PI * f) / sampleRate;
    const e1 = Math.cos(omega);
    const e2 = Math.sin(omega);

    // Real and imaginary components of the numerator
    const realNumerator = b0 + b1 * e1 + b2 * (e1 * e1 - e2 * e2);
    const imagNumerator = b1 * e2 + b2 * 2 * e1 * e2;

    // Real and imaginary components of the denominator
    const realDenominator = a0 + a1 * e1 + a2 * (e1 * e1 - e2 * e2);
    const imagDenominator = a1 * e2 + a2 * 2 * e1 * e2;

    // Complex response (H(f)) is numerator / denominator (complex division)
    return this.calculateResponse(
      realNumerator,
      imagNumerator,
      realDenominator,
      imagDenominator
    );
  }

  static bandwidthToQ(bandwidth: number): number {
    return Math.sqrt(Math.pow(2, bandwidth)) / (Math.pow(2, bandwidth) - 1);
  }

  static qToBandwidth(Q: number): number {
    return Math.log2(Math.sqrt(2) / Q + Math.sqrt(1 / (Q * Q) + 1));
  }

  /**
   * Calculates an array of frequency points between a start and end frequency.
   * The frequency points are calculated logarithmically based on the given resolution.
   *
   * @param startFreq - The starting frequency in Hz (default is 10 Hz).
   * @param endFreq - The ending frequency in Hz (default is 20,000 Hz).
   * @param resolution - The number of frequency points per octave (default is 1/48 Octave).
   * @returns An array of frequency points in Hz.
   */
  calculateFrequencyPoints(
    startFreq: number = 10,
    endFreq: number = 20000,
    resolution: number = 48
  ): number[] {
    const frequencies = [];
    const numBands = Math.log2(endFreq / startFreq) * resolution;
    for (let i = 0; i <= numBands; i++) {
      const freq = startFreq * Math.pow(2, i / resolution);
      frequencies.push(freq);
    }
    // Ensure the end frequency is included
    if (frequencies[frequencies.length - 1] !== endFreq) {
      frequencies.push(endFreq);
    }
    return frequencies;
  }

  sumEQBands(f: number, eqBands: ParametricEQBand[], sampleRate?: number) {
    let realTotal = 1;
    let imagTotal = 0;

    // Iterate through each band and calculate its complex response
    eqBands.forEach((band) => {
      const { realResponse, imagResponse } = this.filterResponseCalculators[
        band.Type
      ](f, band, sampleRate);

      // Multiply the complex responses (real and imaginary parts)
      const tempReal = realTotal * realResponse - imagTotal * imagResponse;
      const tempImag = realTotal * imagResponse + imagTotal * realResponse;

      realTotal = tempReal;
      imagTotal = tempImag;
    });

    // Magnitude and phase of the total response
    var magnitude =
      20 * Math.log10(Math.sqrt(realTotal * realTotal + imagTotal * imagTotal));
    var phase = Math.atan2(-imagTotal, realTotal) * (180 / Math.PI);

    return { magnitude, phase };
  }

  public calculateFilterResponse(
    bands: ParametricEQBand[],
    invert = false
  ): FrequencyResponse[] {
    var response = this.frequencies.map((frequency) => {
      const { magnitude, phase } = this.sumEQBands(frequency, bands);

      return {
        Frequency: frequency,
        Magnitude: magnitude,
        Phase: phase,
      } as FrequencyResponse;
    });
    return response;
  }
}
