
const AUDIO_MP3_PATH = '../../audio/blips.mp3';
const AUDIO_WAV_PATH = '../../audio/blips.wav';

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
  [Sounds.NEXT]: [0, 38],
  [Sounds.OPEN]: [39, 60],
  [Sounds.CLOSE]: [78, 122],
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
      sprite: {
        next: [0, 38],
        open: [39, 60],
        close: [78, 122],
      }
    });
  }

  play(soundId) {
    if(soundRanges.hasOwnProperty(soundId)) {
      this.sound.play(soundId);
    }
  }
}