import express from 'express';
import bodyParser from 'body-parser';
import { Server as SocketServer } from 'socket.io';
import { createServer, Server } from 'http';
import { resolve } from 'path';
import cors from 'cors';
import { Gpio } from 'onoff';

const PUBLIC_FOLDER = resolve(process.cwd(), '..') + '/public';
console.log(PUBLIC_FOLDER);

const SocketIoEvent = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  DISCONNECTING: 'disconnecting',
  ERROR: 'error',
  MAP_AREA: 'mapArea',
}

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

const mapAreaColorSequence = {
  [MapArea.CNC_ROOM]: [0, 0, 1, 0],
  [MapArea.WOOD_SHOP]: [1, 0, 0, 1],
  [MapArea.METAL_SHOP]: [0, 1, 1, 1],
  [MapArea.LASERS]: [0, 1, 1, 0],
  [MapArea.ELECTRONICS]: [0, 1, 0, 1],
  [MapArea.PRINTERS_3D]: [0, 0, 0, 1],
  [MapArea.MULTI_USE]: [1, 0, 0, 0],
  [MapArea.COMPUTERS_PRINTERS]: [0, 0, 1, 1],
  [MapArea.DEDICATED_SPACE_1]: [0, 1, 0, 0],
  [MapArea.DEDICATED_SPACE_2]: [0, 1, 0, 0],
}

export class KioskServer {    
  _app;
  server;
  router;
  io;
  port;
  publicFolder;
  
  constructor () {
    this.port = 8080;
    this.router = express.Router();

    this._app = express();
    this._app.use(cors());
    this._app.options('*', cors());
    this._app.use(bodyParser.json());
    this._app.use(bodyParser.urlencoded({ extended: true }));
    this._app.use(this.router);

    this.publicFolder = PUBLIC_FOLDER;
    this._app.use(express.static(this.publicFolder));
    
    this.server = createServer(this._app);
    this.io = new SocketServer(this.server);

    this.bit0 = {};
    this.bit1 = {};
    this.bit2 = {};
    this.bit3 = {};

    this.listen();
    this.initGpio();
  }

  initGpio() {
    // TODO: This kills the Mac. Need to optionally load or mock
    this.bit0 = new Gpio(16, 'out'); // GPIO16 = bit 0;
    this.bit1 = new Gpio(19, 'out'); // GPIO19 = bit 1;
    this.bit2 = new Gpio(20, 'out'); // GPIO20 = bit 2
    this.bit3 = new Gpio(21, 'out'); // GPIO21 = bit 3
  }

  // TODO: This probably should move to its own class...
  setGpioColor(mapArea) {
    if (MapArea.hasOwnKey(mapArea)) {
      const sequence = mapAreaColorSequence[MapArea[mapArea]];
      bit0.writeSync(sequence[0]);
      bit1.writeSync(sequence[1]);
      bit2.writeSync(sequence[2]);
      bit3.writeSync(sequence[3]);
    }
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on(SocketIoEvent.CONNECT, (socket) => {
      console.log(`Connected client on port ${this.port}.`);

      // Fired when the client is going to be disconnected (but hasn’t left its rooms yet).
      socket.on(SocketIoEvent.DISCONNECTING, (reason) => {
        console.log('Client disconnecting but has not left room(s) yet', reason);
      });

      // Fired upon disconnection.
      socket.on(SocketIoEvent.DISCONNECT, (reason) => {
        console.log('Client disconnected', reason);
      });

      socket.on(SocketIoEvent.ERROR, (error) => {
        console.log('Client error', error);
      });

      socket.on(SocketIoEvent.MAP_AREA, (mapArea) => {
        console.log('mapArea', mapArea);
      });
    });
  }

  /**
   * Return the express app
   */
  get app() {
    return this._app;
  }
}