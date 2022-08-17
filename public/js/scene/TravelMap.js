import { Scene } from './Scene.js';
import { GameController, GamepadRockCandy as Gamepad } from '../GameController.js';
import { KeyboardController } from '../KeyboardController.js';

const TRAVEL_MAP_SCENE_DIV = document.getElementById('travelMapScene');
const TRAVEL_MAP_DIV = document.getElementById('travelMap');
const TITLE_DIV = document.getElementById('travelMapTitle');
const EQUIPMENT_DIV = document.getElementById('travelMapEquipment');
const TRAVEL_MAP_SVG_PATH = '../img/travelMap.svg';
const GALLERY_JSON_PATH = '../../data/travelMap.json';

// MapArea enum, capturing svg element id strings
export const MapArea = {
  CNC_ROOM: 'cncRoom',
  WOOD_SHOP: 'woodShop',
  METAL_SHOP: 'metalShop',
  LASERS: 'laserEngravers',
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
const ACTION_BUTTON_MAP = {
  [Action.LEFT]: [Gamepad.DPADL, Gamepad.LB, Gamepad.LT],
  [Action.RIGHT]: [Gamepad.DPADR, Gamepad.RB, Gamepad.RT],
  [Action.UP]: [Gamepad.DPADU],
  [Action.DOWN]: [Gamepad.DPADD],
  [Action.DISMISS]: [Gamepad.A, Gamepad.X, Gamepad.START, Gamepad.THUMBR],
  [Action.SELECT]: [Gamepad.B, Gamepad.Y, Gamepad.BACK, Gamepad.THUMBL],
}

// When X area is active and Y gamepad event happens, move to area Z
const LOCATION_NAV_MAP = {
  [MapArea.CNC_ROOM]: {
    [Action.RIGHT]: MapArea.WOOD_SHOP,
    [Action.DOWN]: MapArea.WOOD_SHOP,
  },
  [MapArea.WOOD_SHOP]: {
    [Action.RIGHT]: MapArea.METAL_SHOP,
    [Action.LEFT]: MapArea.CNC_ROOM,
    [Action.UP]: MapArea.CNC_ROOM,
    [Action.DOWN]: MapArea.LASERS,
  },
  [MapArea.METAL_SHOP]: {
    [Action.LEFT]: MapArea.WOOD_SHOP,
    [Action.DOWN]: MapArea.ELECTRONICS,
  },
  [MapArea.LASERS]: {
    [Action.RIGHT]: MapArea.ELECTRONICS,
    [Action.DOWN]: MapArea.MULTI_USE,
    [Action.UP]: MapArea.WOOD_SHOP,
  },
  [MapArea.ELECTRONICS]: {
    [Action.RIGHT]: MapArea.PRINTERS_3D,
    [Action.LEFT]: MapArea.LASERS,
    [Action.DOWN]: MapArea.COMPUTERS_PRINTERS,
    [Action.UP]: MapArea.METAL_SHOP,
  },
  [MapArea.PRINTERS_3D]: {
    [Action.LEFT]: MapArea.ELECTRONICS,
    [Action.DOWN]: MapArea.DEDICATED_SPACE_2,
    [Action.UP]: MapArea.METAL_SHOP,
  },
  [MapArea.MULTI_USE]: {
    [Action.RIGHT]: MapArea.COMPUTERS_PRINTERS,
    [Action.UP]: MapArea.LASERS,
    [Action.DOWN]: MapArea.DEDICATED_SPACE_1,
  },
  [MapArea.COMPUTERS_PRINTERS]: {
    [Action.RIGHT]: MapArea.DEDICATED_SPACE_2,
    [Action.LEFT]: MapArea.MULTI_USE,
    [Action.UP]: MapArea.ELECTRONICS,
  },
  [MapArea.DEDICATED_SPACE_1]: {
    [Action.RIGHT]: MapArea.DEDICATED_SPACE_2,
    [Action.UP]: MapArea.MULTI_USE,
  },
  [MapArea.DEDICATED_SPACE_2]: {
    [Action.LEFT]: MapArea.COMPUTERS_PRINTERS,
    [Action.UP]: MapArea.PRINTERS_3D,
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
   firstMapArea = MapArea.CNC_ROOM,
   idleTimeoutMilliseconds = 120000,
  ) {
    super();
    this.onSceneEnd = onSceneEnd;
    this.activeMapArea = firstMapArea;
    this.idleTimeoutMilliseconds = idleTimeoutMilliseconds;

    this.gameControllers = [
      new GameController(this.handleControllerChange.bind(this)),
      new KeyboardController(this.handleControllerChange.bind(this)),
    ];
    this.idleTimeout = {}
    // TODO: is it dom object?:
    this.mapSvg = '';
    // don't track game controller interactions when slideshow is active or still loading
    this.interactActive = false;
    // track last gamepad interaction for change detection
    this.lastGamepad = { buttons: [], axes: [] };
    // loaded captions for map areas and slide images with captions for those areas
    this.mapData = [];
  }

  clearMapAreaHighlights() {
    let areaElement;
    for (const key in MapArea) {
      areaElement = document.getElementById(MapArea[key]);
      if (areaElement && areaElement.classList) {
        areaElement.classList.remove('active')
      }
    }
  }

  highlightMapArea(mapArea) {
    this.clearMapAreaHighlights();
    const areaElement = document.getElementById(mapArea);
    if (areaElement && areaElement.classList) {
      areaElement.classList.add('active')
    }
    TITLE_DIV.innerHTML = this.mapData[mapArea].title;
    EQUIPMENT_DIV.innerHTML = this.mapData[mapArea].equipment;
    // TODO: Move a gamepad cursor over the area
  }

  async loadMapData() {
    try {
      const response = await fetch(GALLERY_JSON_PATH);
      return response.json();
    } catch(err) {
      console.error(err);
    }
  }

  /**
   * Keep .svg external for simpler edits, yet also place inline for simpler
   * access to enable enhanced* external styling to svg.
   */
  async loadMap() {
    try {
      const response = await fetch(TRAVEL_MAP_SVG_PATH);
      const svg = await response.text();
      const textAsDom = document.createRange().createContextualFragment(svg);
      TRAVEL_MAP_DIV.appendChild(textAsDom);
      this.highlightMapArea(this.activeMapArea);
      this.interactActive = true;
      // TODO: listen to map events
    } catch(err) {
      console.error(err);
    }
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

  /**
   * When pressing multiple buttons at the same time, example: down+right, and letting
   * one of those go like down, reduce duplicates so not to to trigger right button twice.
   */
  cancelExistingButtons(activeButtons, lastButtons) {
    return activeButtons.filter(button => {
      return !lastButtons.includes(button);
    });
  }

  /**
   * Multiple buttons can result in the same action. Reduce that here.
   */
  getGamepadAction (gamepadButtonIndex) {
    for (const action in ACTION_BUTTON_MAP) {
      if (ACTION_BUTTON_MAP[action].includes(gamepadButtonIndex)) {
        return action;
      }
    }
    console.log(`gamepad index of ${gamepadButtonIndex} doesn't have a valid action assigned`);
    return;
  }

  pickNextArea(activeArea, gamepadButtonIndex) {
    const action = this.getGamepadAction(gamepadButtonIndex);
    console.log(action);
    if (
      LOCATION_NAV_MAP[activeArea] &&
      LOCATION_NAV_MAP[activeArea][action]
    ) {
      console.log(LOCATION_NAV_MAP[activeArea][action]);
      return LOCATION_NAV_MAP[activeArea][action];
    }
    return;
  }

  // TODO: this is only working with buttons, not thumbsticks at the moment,
  // thumbstick support would be cool!
  handleControllerChange(gamepad) {
    this.resetIdleTimeout();
    let nextAreaId;
    const reducedButtons = this.cancelExistingButtons(gamepad.buttons, this.lastGamepad.buttons);

    if (this.interactActive && reducedButtons.length > 0) {
      for (const button of reducedButtons) {
        nextAreaId = this.pickNextArea(this.activeMapArea, button);
        if (nextAreaId) {
          this.highlightMapArea(nextAreaId);
          this.activeMapArea = nextAreaId;
        }
      }
    }

    this.lastGamepad = gamepad;
  }

  async init() {
    for(const controller of this.gameControllers) {
      controller.init();
    }

    try {
      this.mapData = await this.loadMapData();
      await this.loadMap();
      this.resetIdleTimeout();
      TRAVEL_MAP_SCENE_DIV.classList.remove('hidden');
    } catch(err) {
      console.error(err);
    }
  }
}