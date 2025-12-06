import * as dotenv from 'dotenv';
dotenv.config();
import {Server} from "socket.io";
import http from "http";
import {DocumentClass} from "./Document";
import {DocumentUserAccess} from "./dto/response/DocumentUserAccess";
import DocumentService from "./services/DocumentService";

dotenv.config();

interface SocketData {
    version: number;
    text: string;
    startIndex: number;
    endIndex: number;
    type: string
}

const server = http.createServer();
const io = new Server(server);

type DocumentObject = Record<string, DocumentClass>;
let usersConnected: Record<string, DocumentUserAccess> = {};

io.listen(4000, {
    cors: {
        origin: [process.env.CLIENT_URL!]
    }
});

io.on('connection', client => {
    console.log("Client connected");

    client.on('connect_document', async (data) => {
        const {documentKey, token} = data;
        usersConnected[client.id] = await DocumentService.getUserAccess(token, documentKey);
        console.log("User with id:", client.id, "connected with document key:", documentKey);
    })

    client.on("operation", (data: SocketData) => {
        if (usersConnected[client.id] !== undefined && usersConnected[client.id].write_access) {

        }
    });
});
