'use strict';

const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  let path = req.url === '/' ? 'index.html' : '.' + req.url;
  //path = path.replace(/assets/, '../assets');
  console.log(path);
  res.statusCode = 200;
  fs.readFile(path, (err, data) => {
    res.end(data);
  })
  // const data = fs.readFileSync(path);
}).listen(8080);
