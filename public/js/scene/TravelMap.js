import { Scene } from './Scene.js';
import { GameController, GamepadRockCandy as Gamepad } from '../GameController.js';
import { KeyboardController } from '../KeyboardController.js';

const TRAVEL_MAP_SCENE_DIV = document.getElementById('travelMapScene');
const TRAVEL_MAP_DIV = document.getElementById('travelMap');

// MapAreas enum, capturing svg element id strings
const MapAreas = {
  CNC_ROOM: 'cncRoom',
  WOOD_SHOP: 'woodShop',
  METAL_SHOP: 'metalShop',
  LASERS: 'lasers',
  ELECTRONICS: 'electronics',
  PRINTERS_3D: 'printers3d',
  MULTI_USE: 'multiUse',
  COMPUTERS_PRINTERS: 'computersPrinters',
  DEDICATED_SPACE_1: 'dedicatedSpace1',
  DEDICATED_SPACE_2: 'dedicatedSpace2',
}

// Names of effective button actions for the map and its slideshows
const Action = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
  SELECT: 'select',
  DISMISS: 'dismiss'
}

// map actions with reported gamepad indices
const actionButtonMap = {
  [Action.LEFT]: [Gamepad.DPADL, Gamepad.LB, Gamepad.LT],
  [Action.RIGHT]: [Gamepad.DPADR, Gamepad.RB, Gamepad.RT],
  [Action.UP]: [Gamepad.DPADU],
  [Action.DOWN]: [Gamepad.DPADD],
  [Action.SELECT]: [Gamepad.A, Gamepad.X, Gamepad.START, Gamepad.THUMBR],
  [Action.DISMISS]: [Gamepad.B, Gamepad.Y, Gamepad.BACK, Gamepad.THUMBL],
}

// When X area is active and Y gamepad event happens, move to area Z
const locationNavMap = {
  [MapAreas.CNC_ROOM]: {
    [Action.RIGHT]: MapAreas.WOOD_SHOP,
    [Action.DOWN]: MapAreas.WOOD_SHOP,
  },
  [MapAreas.WOOD_SHOP]: {
    [Action.RIGHT]: MapAreas.METAL_SHOP,
    [Action.LEFT]: MapAreas.CNC_ROOM,
    [Action.DOWN]: MapAreas.LASERS,
  },
  [MapAreas.METAL_SHOP]: {
    [Action.LEFT]: MapAreas.WOOD_SHOP,
    [Action.DOWN]: MapAreas.ELECTRONICS,
  },
  [MapAreas.LASERS]: {
    [Action.RIGHT]: MapAreas.ELECTRONICS,
    [Action.DOWN]: MapAreas.MULTI_USE,
    [Action.UP]: MapAreas.CNC_ROOM,
  },
  [MapAreas.ELECTRONICS]: {
    [Action.RIGHT]: MapAreas.PRINTERS_3D,
    [Action.LEFT]: MapAreas.LASERS,
    [Action.DOWN]: MapAreas.COMPUTERS_PRINTERS,
    [Action.UP]: MapAreas.METAL_SHOP,
  },
  [MapAreas.PRINTERS_3D]: {
    [Action.LEFT]: MapAreas.ELECTRONICS,
    [Action.DOWN]: MapAreas.DEDICATED_SPACE_2,
    [Action.UP]: MapAreas.METAL_SHOP,
  },
  [MapAreas.MULTI_USE]: {
    [Action.RIGHT]: MapAreas.COMPUTERS_PRINTERS,
    [Action.UP]: MapAreas.LASERS,
    [Action.DOWN]: MapAreas.DEDICATED_SPACE_1,
  },
  [MapAreas.COMPUTERS_PRINTERS]: {
    [Action.RIGHT]: MapAreas.DEDICATED_SPACE_2,
    [Action.LEFT]: MapAreas.MULTI_USE,
    [Action.UP]: MapAreas.ELECTRONICS,
  },
  [MapAreas.DEDICATED_SPACE_1]: {
    [Action.RIGHT]: MapAreas.DEDICATED_SPACE_2,
    [Action.UP]: MapAreas.MULTI_USE,
  },
  [MapAreas.DEDICATED_SPACE_2]: {
    [Action.LEFT]: MapAreas.COMPUTERS_PRINTERS,
    [Action.UP]: MapAreas.PRINTERS_3D,
  },
}

/**
 * Represents a the "travel" map of PPM, a slightly simplified map targeted towards
 * newcomers in a travel booth setting. Example: Someone who has never heard of PPM
 * may not care about where our bathroom or emergency exit is. They want to see the
 * giant laser that could* cut their kitchen table in half...
 */
export class TravelMap extends Scene {
  constructor(
   onSceneEnd = () => { },
   idleTimeoutMilliseconds = 120000,
  ) {
    super();
    this.onSceneEnd = onSceneEnd;
    this.idleTimeoutMilliseconds = idleTimeoutMilliseconds;

    this.gameControllers = [
      new GameController(this.handleControllerChange.bind(this)),
      new KeyboardController(this.handleControllerChange.bind(this)),
    ];
    this.idleTimeout = {}
    // TODO: is it dom object?:
    this.mapSvg = '';
  }

  async loadMap() {
    // Keep .svg external for simpler edits, yet also make inline for simpler
    // access to enable enhanced* external styling to svg.
    fetch('../img/travelMap.svg')
      .then(r => r.text())
      .then(text => {
        this.mapSvg = text;
        TRAVEL_MAP_DIV.innerHTML = text;
      })
      .catch(console.error.bind(console));
  }

  unloadMap() {
    TRAVEL_MAP_DIV.innerHTML = '';
  }

  cleanup() {
    for(const index in this.gameControllers) {
      this.gameControllers[index].cleanup();
      this.gameControllers[index] = null;
    }

    this.unloadMap();

    TRAVEL_MAP_SCENE_DIV.classList.add('hidden');
  }

  cleanupAndEnd() {
    this.cleanup();
    this.endScene();
  }

  resetIdleTimeout() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }
    
    // End scene and move to something else like the the logo screensaver after idle too long
    this.idleTimeout = setTimeout(this.cleanupAndEnd.bind(this), this.idleTimeoutMilliseconds);
  }

  handleControllerChange(buttons) {
    // TODO
    this.resetIdleTimeout();
    console.log(buttons);
  }

  init() {
    for(const controller of this.gameControllers) {
      controller.init();
    }

    this.loadMap();

    this.resetIdleTimeout();
    TRAVEL_MAP_SCENE_DIV.classList.remove('hidden');
  }
}