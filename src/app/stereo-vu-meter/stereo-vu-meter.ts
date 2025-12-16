import { Component, Input, HostBinding, computed, effect } from '@angular/core';
import { RackScrewComponent } from "../equipment-rack/rack-screw/rack-screw";
import { VuMeterComponent } from "./vu-meter/vu-meter";
import { QrwcMeterComponent } from '../qrwc/components/qrwc-meter-component';

@Component({
  selector: 'app-stereo-vu-meter',
  templateUrl: './stereo-vu-meter.html',
  styleUrls: ['./stereo-vu-meter.scss'],
  standalone: true,
  imports: [RackScrewComponent, VuMeterComponent]
})
export class StereoVuMeterComponent {
  @HostBinding('attr.data-rack-units') rackUnits = '2';
  
  // Create QrwcMeterComponent instance for StereoRmsMeter
  private readonly meter = new QrwcMeterComponent('StereoRmsMeter', 2);
  
  // Computed properties that get RMS values from the meter
  leftLevel = computed(() => {
    const value = this.meter.getRms(1)();
   // console.log('StereoVuMeter Left RMS:', value);
    return value;
  });
  rightLevel = computed(() => {
    const value = this.meter.getRms(2)();
   // console.log('StereoVuMeter Right RMS:', value);
    return value;
  });

}
