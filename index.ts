import express from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';

const app = express();

app.get("/", (req: express.Request, res: express.Response)=>{
    res.sendFile(path.join(__dirname,"./index.html"))
})

const server = https.createServer(
  {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
    passphrase: 'password',
  },
  app
);

// GET
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
