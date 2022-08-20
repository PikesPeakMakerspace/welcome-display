import { Logo } from './scene/Logo.js';
import { TravelMap, MapArea } from './scene/TravelMap.js';

/**
 * The kiosk operates in a mode suited for traveling display
 * and for folks at at the makerspace who want more detailed info shown */
export const KioskMode = {
  TRAVEL: 'travel',
  MAKERSPACE: 'makerspace',
};

export const KioskScene = {
  LOGO: 'logo',
  TRAVEL_MAP: 'travelMap',
}

/** Represents the main app */
export class App {
  
  constructor(
    scenes = [KioskScene.LOGO],
  ) {
    this.gameControllers = [];
    this.scenes = scenes;
    this.activeScene = {};
    this.activeSceneInt = 0;
  }

  handleSceneEnd() {
    console.log('ending scene...');
    this.activeScene = null;
    this.activeSceneInt++;
    if (this.activeSceneInt >= this.scenes.length) {
      this.activeSceneInt = 0;
    }
    this.loadScene(this.activeSceneInt);
  }

  loadScene(sceneInt) {
    switch(this.scenes[sceneInt]) {
      case KioskScene.LOGO:
        console.log(`${sceneInt}: loading logo scene...`);
        this.activeScene = new Logo(this.handleSceneEnd.bind(this));
        break;
      case KioskScene.TRAVEL_MAP:
        console.log(`${sceneInt}: loading travel map...`);
        this.activeScene = new TravelMap(this.handleSceneEnd.bind(this), MapArea.CNC_ROOM, 600000);
        break;
      default:
        console.error(`Scene option of ${this.scenes[sceneInt]} is not valid.`);
        return;
    }
    
    this.activeScene.init();
  }

  init() {
    this.loadScene(this.activeSceneInt);
  }

}