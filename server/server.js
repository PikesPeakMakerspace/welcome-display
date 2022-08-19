
import { KioskServer } from './KioskServer.js';

let app = new KioskServer().app;

const shutdown = (signal) => {
    console.log(`shutting down ${signal}`);
    process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { app };
