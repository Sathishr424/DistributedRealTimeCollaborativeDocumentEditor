import * as dotenv from 'dotenv';
dotenv.config();

import { SocketOperation } from "../../shared/SocketOperation"
import {Server} from "socket.io";
import http from "http";
import {MyDocument} from "./MyDocument";
import {DocumentUserAccess} from "./dto/response/DocumentUserAccess";
import DocumentService from "./services/DocumentService";

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: [process.env.CLIENT_URL!]
    }
});

server.listen(4000, "0.0.0.0", () => {
    console.log("Server listening on 0.0.0.0:4000");
});

type DocumentObject = Record<string, MyDocument>;
let usersConnected: Record<string, Record<string, DocumentUserAccess>> = {};
let documents: DocumentObject = {};

io.on('connection', client => {
    console.log("Client connected");

    client.on('connect_document', async (data) => {
        const {documentKey, token, clientId} = data;
        if (usersConnected[documentKey] === undefined) {
            usersConnected[documentKey] = {};
        }
        if (Object.keys(usersConnected[documentKey]).length >= parseInt(process.env.MAX_COLLAB_LIMIT || '0')) {
            io.emit('collab_limit_reached', {
                clientId,
                message: "Collab limit reached"
            });
            return;
        }
        usersConnected[documentKey][client.id] = await DocumentService.getUserAccess(token, documentKey);
        if (documents[documentKey] === undefined) {
            documents[documentKey] = new MyDocument(documentKey);
        }
        console.log("User with id:", client.id, "connected with document key:", documentKey);
        console.log(documents[documentKey].getFullText())
        io.emit('server_document', {
            clientId,
            text: documents[documentKey].getFullText(),
            version: documents[documentKey].getVersion(),
        });
    });

    client.on("operation", (data: SocketOperation) => {
        if (usersConnected[data.documentKey] !== undefined && usersConnected[data.documentKey][client.id] !== undefined && usersConnected[data.documentKey][client.id] .write_access) {
            const res = documents[data.documentKey].processOperation(data);
            io.emit("operation", res);
            // console.log("Receive:", data);
            console.log("Send:", res);
        }
    });
});