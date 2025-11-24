import dotenv from "dotenv";
dotenv.config();

import {Server} from "socket.io";
import http from "http";
import {DocumentClass} from "./Document";

const server = http.createServer();
const io = new Server(server);

type DocumentObject = Record<string, DocumentClass>;

io.listen(4000, {
    cors: {
        origin: [process.env.CLIENT_URL!]
    }
});

io.on('connection', client => {
    console.log("Client connected");
    client.on('event', data => {

    });
    client.on('disconnect', () => {

    });
});