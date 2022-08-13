// basic node static web server with no added packages installed
// thanks: https://stackoverflow.com/a/29046869


const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || 8080;
const public = './public';

http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // parse URL
  const parsedUrl = url.parse(req.url);
  console.log(parsedUrl);
  // extract URL path
  let pathname = `${public}${parsedUrl.pathname}`;
  console.log(pathname);
  // based on the URL path, extract the file extension. e.g. .js, .doc, ...
  let ext = path.parse(pathname).ext;
  // maps file extension to MIME typere
  const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
  };

  fs.exists(pathname, (exist) => {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    // if is a directory search for index file
    if (fs.statSync(pathname).isDirectory()) {
      ext = '.html';
      pathname += '/index.html';
    }

    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', map[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });


}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);