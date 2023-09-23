const express = require('express');
const app = express();
const fs = require('fs');

const server = require('https').createServer(
  {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
    passphrase: 'password',
  },
  app
);

// GET
app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});