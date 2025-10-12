import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, signal, HostBinding, computed } from '@angular/core';
import { RackScrewComponent } from '../equipment-rack/rack-screw/rack-screw';
import { QrwcAudioPlayerComponent } from '../qrwc/components/qrwc-audio-player-component';
import { AudioPlayerVolumeKnobComponent } from './volume-knob/volume-knob';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, FormsModule, RackScrewComponent, AudioPlayerVolumeKnobComponent],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.scss'
})
export class AudioPlayerComponent {
  @HostBinding('attr.data-rack-units') rackUnits = '1';

  public readonly audioPlayer = new QrwcAudioPlayerComponent(
    'Audio_Player',
  );

  progress = computed(() => {
    const totalSeconds = Math.floor(this.audioPlayer.progress());
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  onLevelChange(value: number): void {
    this.audioPlayer.SetGain(value);
  }

  toggleMute(): void {
    this.audioPlayer.MuteToggle();
  }
}
