import express from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';

const app = express();

// 以下の行を追加して、静的ファイルを適切に提供するためのミドルウェアを設定します
app.use(express.static(path.join(__dirname)));

app.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, "./test.html"))
});

const server = https.createServer(
    {
        key: fs.readFileSync('./server.key'),
        cert: fs.readFileSync('./server.crt'),
        passphrase: 'password',
    },
    app
);

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
