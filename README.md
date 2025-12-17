# Q-SYS HTML5 Showcase

An HTML5 user interface for Q-SYS systems built with Angular 21 and the Q-SYS Web Remote Control (QRWC) library. The interface displays audio processing components in a virtual equipment rack layout.

## Overview

This project demonstrates HTML5-based control interfaces for Q-SYS Core processors. Built with Angular 21 and the QRWC library, it includes:

- Bidirectional communication with Q-SYS Core processors via QRWC
- Signal-based reactive architecture using Angular signals API
- VU meters, dynamic processors, and EQ components
- Rack-mounted equipment UI styling
- Rotary knobs, faders, meters, and LED controls

### Components

- **Q-SYS Core 24f** - Core processor visualization with status indicators
- **Multi-Channel VU Meters** - 8-channel meters with ANSI-standard ballistics and peak detection
- **Dual Stereo VU Meters** - Stereo meters with needle animation
- **Parametric EQ** - Multi-band parametric equalizer with frequency/gain/Q controls
- **Graphic EQ** - Multi-band graphic equalizer with fader controls
- **Dynamic Processor** - Compressor/limiter with threshold, ratio, attack, and release controls
- **Audio Analyser** - Frequency analysis with RTA, magnitude, and phase displays
- **Camera Controller** - PTZ camera control with preset management
- **Audio Player** - Media playback with transport controls and volume knob
- **Pink Noise Generator** - Test signal generator with level control
- **Equipment Rack Rails** - Rack mounting hardware visualization

## Q-SYS Web Remote Control (QRWC)

This project uses the **@q-sys/qrwc** library, which provides:

- Angular services for Q-SYS control communication
- Component bindings for Q-SYS control types (buttons, knobs, meters, faders)
- WebSocket connection management and reconnection handling
- Synchronization of control values between UI and Q-SYS Core
- Support for Named Controls and Named Components

### QRWC Integration Examples

```typescript

  readonly mute = new QrwcControlBinding(
    this.qrwc,
    'Pink_Noise_Generator',
    'mute'
  );

  readonly gain = new QrwcControlBinding(
    this.qrwc,
    'Pink_Noise_Generator',
    'level',
    true // logarithmic position scaling
  );

```

## Technology Stack

- **Angular 21** - Web framework with signal-based reactivity
- **TypeScript** - Programming language
- **QRWC Library** - Q-SYS Web Remote Control integration
- **Chart.js** - Frequency analysis visualization
- **SCSS** - CSS preprocessor

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Q-SYS Designer and Core processor (for testing with Q-SYS hardware)
- Web browser with WebSocket support

### Installation

```bash
npm install
```

### Development Server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Connecting to Q-SYS

1. Load the included design file (`q-sys_design_files/HTML5 Sample Project.qsys`) in Q-SYS Designer
2. Deploy the design to your Q-SYS Core processor
3. Configure the QRWC connection settings in the Angular app to point to your Core's IP address
4. The UI will automatically connect and begin receiving real-time updates

## Building

To build the project for production deployment, run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory, optimized for performance and ready to deploy to a web server or Q-SYS UCI deployment.

## Project Structure

```
src/app/
├── audio-analyser/          # Real-time frequency analysis component
├── audio-player/            # Media playback with transport controls
├── camera-controller/       # PTZ camera control interface
├── core-24f/                # Q-SYS Core 24f processor visualization
├── dual-vu-meter/           # Dual stereo VU meter component
├── dynamic-processor/       # Compressor/limiter with LED meters
├── equipment-rack/          # Virtual rack chassis with mounting hardware
├── graphic-eq/              # Multi-band graphic equalizer
├── multi-vu-meter/          # 8-channel VU meter array
├── parametric-eq/           # Parametric equalizer with frequency response
├── pink-noise/              # Test signal generator
├── stereo-vu-meter/         # Individual VU meter component
├── qrwc/                    # Q-SYS Web Remote Control integration
└── pipes/                   # Utility pipes for value formatting
```

## Key Features

### VU Meter Implementation

The VU meter components implement ANSI C16.5-1942 ballistics:
- 300ms attack time
- 600ms release time
- Peak detection for signals exceeding +3dB
- 12-point piecewise linear calibration for needle positioning

### Architecture

Built with Angular signals API:
- Computed values for derived state
- Template bindings for DOM updates
- Change detection optimization

### UI Design

- Equipment rack styling with hardware details
- Rack screws, vent plates, and mounting rails
- Component faceplates and labeling
- Responsive layouts

## Q-SYS Design File

The included Q-SYS design file (`HTML5 Sample Project.qsys`) contains:
- Named Controls configured for each UI component
- Multi-channel meter bridges for VU displays
- Audio processing blocks (EQ, dynamics, analysis)
- Camera control logic
- Media player integration

## Development Notes

### Angular CLI

This project uses Angular CLI version 20.1.4. For scaffolding new components:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Testing

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Contributing

This project provides reference implementations for Q-SYS HTML5 control interfaces. The components can be used as examples for building Q-SYS web-based control applications.

## License

See the [LICENSE](LICENSE) file for details.

## Additional Resources

- [Q-SYS Web Remote Control Documentation](https://q-syshelp.qsc.com/)
- [Angular Documentation](https://angular.dev/)
- [Q-SYS Control 101 Training](https://www.qsc.com/training/)
- [Q-SYS Community Forums](https://q-syshelp.qsc.com/)
