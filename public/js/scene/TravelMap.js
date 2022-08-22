import { Scene } from './Scene.js';
import { StepController, StepAction } from '../input/StepController.js';
import { io } from '../socket.io.esm.min.js';
import { Slideshow } from '../Slideshow.js';

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
  BLACK: 'black', // not really a map area, used to black out external lights for now
}

// When X area is active and Y gamepad event happens, move to area Z
const LOCATION_NAV_MAP = {
  [MapArea.CNC_ROOM]: {
    [StepAction.UP]: MapArea.DEDICATED_SPACE_1,
    [StepAction.DOWN]: MapArea.WOOD_SHOP,
    [StepAction.LEFT]: MapArea.METAL_SHOP,
    [StepAction.RIGHT]: MapArea.WOOD_SHOP,
  },
  [MapArea.WOOD_SHOP]: {
    [StepAction.UP]: MapArea.DEDICATED_SPACE_1,
    [StepAction.DOWN]: MapArea.LASERS,
    [StepAction.LEFT]: MapArea.CNC_ROOM,
    [StepAction.RIGHT]: MapArea.METAL_SHOP,
  },
  [MapArea.METAL_SHOP]: {
    [StepAction.UP]: MapArea.DEDICATED_SPACE_2,
    [StepAction.DOWN]: MapArea.PRINTERS_3D,
    [StepAction.LEFT]: MapArea.WOOD_SHOP,
    [StepAction.RIGHT]: MapArea.CNC_ROOM,
  },
  [MapArea.LASERS]: {
    [StepAction.UP]: MapArea.WOOD_SHOP,
    [StepAction.DOWN]: MapArea.MULTI_USE,
    [StepAction.LEFT]: MapArea.PRINTERS_3D,
    [StepAction.RIGHT]: MapArea.ELECTRONICS,
  },
  [MapArea.ELECTRONICS]: {
    [StepAction.UP]: MapArea.METAL_SHOP,
    [StepAction.DOWN]: MapArea.COMPUTERS_PRINTERS,
    [StepAction.LEFT]: MapArea.LASERS,
    [StepAction.RIGHT]: MapArea.PRINTERS_3D,
  },
  [MapArea.PRINTERS_3D]: {
    [StepAction.UP]: MapArea.METAL_SHOP,
    [StepAction.DOWN]: MapArea.DEDICATED_SPACE_2,
    [StepAction.LEFT]: MapArea.ELECTRONICS,
    [StepAction.RIGHT]: MapArea.LASERS,
  },
  [MapArea.MULTI_USE]: {
    [StepAction.UP]: MapArea.LASERS,
    [StepAction.DOWN]: MapArea.DEDICATED_SPACE_1,
    [StepAction.LEFT]: MapArea.PRINTERS_3D,
    [StepAction.RIGHT]: MapArea.COMPUTERS_PRINTERS,
  },
  [MapArea.COMPUTERS_PRINTERS]: {
    [StepAction.UP]: MapArea.ELECTRONICS,
    [StepAction.DOWN]: MapArea.METAL_SHOP,
    [StepAction.RIGHT]: MapArea.DEDICATED_SPACE_2,
    [StepAction.LEFT]: MapArea.MULTI_USE,
  },
  [MapArea.DEDICATED_SPACE_1]: {
    [StepAction.UP]: MapArea.MULTI_USE,
    [StepAction.DOWN]: MapArea.CNC_ROOM,
    [StepAction.LEFT]: MapArea.DEDICATED_SPACE_2,
    [StepAction.RIGHT]: MapArea.DEDICATED_SPACE_2,
  },
  [MapArea.DEDICATED_SPACE_2]: {
    [StepAction.UP]: MapArea.PRINTERS_3D,
    [StepAction.DOWN]: MapArea.METAL_SHOP,
    [StepAction.LEFT]: MapArea.COMPUTERS_PRINTERS,
    [StepAction.RIGHT]: MapArea.DEDICATED_SPACE_1,
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

    this.stepController = new StepController(this.handleControllerChange.bind(this));
    // track last gamepad interaction for change detection
    this.lastGamepad = { buttons: [], axes: [] };
    this.idleTimeout = {}
    // TODO: is it dom object?:
    this.mapSvg = '';
    // don't track game controller interactions when slideshow is active
    this.slideshowActive = false;
    this.slideshow = {};
    // loaded captions for map areas and slide images with captions for those areas
    this.mapData = [];
    // socket.io connection used to send selected area color back to server, to send to Pi GPIO pins
    this.io = {};
  }

  clearMapAreaHighlights() {
    let areaElement;
    for (const key in MapArea) {
      areaElement = document.getElementById(MapArea[key]);
      if (areaElement && areaElement.classList) {
        areaElement.classList.remove('active');
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
    // Tell server which area to set matching LED colors!
    this.io.emit('mapArea', mapArea)
    // TODO: Move a gamepad cursor over the area
  }

  setSocketConnection() {
    this.io = io();
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
      // TODO: listen to map events
    } catch(err) {
      console.error(err);
    }
  }

  unloadMap() {
    TRAVEL_MAP_DIV.innerHTML = '';
  }

  cleanup() {
    this.io.emit('mapArea', MapArea.BLACK);
    this.stepController.cleanup();
    this.stepController = null;

    this.closeSlideshow();

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

  pickNextArea(activeArea, action) {
    if (
      LOCATION_NAV_MAP[activeArea] &&
      LOCATION_NAV_MAP[activeArea][action]
    ) {
      return LOCATION_NAV_MAP[activeArea][action];
    }
    return;
  }

  startSlideshow() {
    this.slideshowActive = true;
    this.slideshow = new Slideshow(this.mapData[this.activeMapArea].gallery, this.closeSlideshow.bind(this));
    this.slideshow.init();
  }

  closeSlideshow() {
    if (this.slideshow) {
      this.slideshow = null;
      this.slideshowActive = false;
    }
  }

  handleControllerChange(action) {
    this.resetIdleTimeout();

    if(this.slideshowActive) {
      return;
    }

    // accept most buttons to select/toggle for now
    if (action === StepAction.SELECT || action === StepAction.DISMISS) {
      this.startSlideshow();
      return;
    }
    
    const nextAreaId = this.pickNextArea(this.activeMapArea, action);
    if (nextAreaId) {
      this.highlightMapArea(nextAreaId);
      this.activeMapArea = nextAreaId;
    }
  }

  async init() {
    this.stepController.init();
    this.setSocketConnection()

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