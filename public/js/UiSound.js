
const AUDIO_MP3_PATH = '../../audio/sounds.mp3';
const AUDIO_WAV_PATH = '../../audio/sounds.wav';

/**
 * enum for sounds
 */
export const Sounds = {
  NEXT: 'next',
  OPEN: 'open',
  CLOSE: 'close',
}

/**
 * sound mapping
 */
const soundRanges = {
  [Sounds.NEXT]: [3000, 500],
  [Sounds.OPEN]: [1000, 500],
  [Sounds.CLOSE]: [2000, 500],
}

/**
 * Singleton class enabling playing of sounds
 */
export class UiSound {
  constructor() {
    if (UiSound._instance) {
      return UiSound._instance
    }
    UiSound._instance = this;
    this._sound = this._loadSound();
  }

  _loadSound() {
    this.sound = new Howl({
      src: [AUDIO_MP3_PATH, AUDIO_WAV_PATH],
      sprite: soundRanges,
      volume: 0.5,
    });
  }

  play(soundId) {
    if(soundRanges.hasOwnProperty(soundId)) {
      this.sound.play(soundId);
    }
  }
}