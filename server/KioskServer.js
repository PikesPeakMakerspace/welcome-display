import express from 'express';
import bodyParser from 'body-parser';
import { Server as SocketServer } from 'socket.io';
import { createServer, Server } from 'http';
import { resolve } from 'path';
import cors from 'cors';

const PUBLIC_FOLDER = resolve(process.cwd(), '..') + '/public';
console.log(PUBLIC_FOLDER);

const SocketIoEvent = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  DISCONNECTING: 'disconnecting',
  ERROR: 'error',
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

    this.listen();
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on(SocketIoEvent.CONNECT, (socket) => {
      console.log(`Connected client on port ${this.port}.`);

      // Fired when the client is going to be disconnected (but hasn’t left its rooms yet).
      socket.on(SocketIoEvent.DISCONNECTING, (reason) => {
        console.log('Client disconnecting but has not left room(s) yet');
      });

      // Fired upon disconnection.
      socket.on(SocketIoEvent.DISCONNECT, (reason) => {
        console.log('Client disconnected');
      });

      // TODO: Replace 'any' if possible
      socket.on(SocketIoEvent.ERROR, (error) => {
        console.log('Client error');
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