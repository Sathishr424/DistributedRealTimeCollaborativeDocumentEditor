import {io, Socket} from "socket.io-client";
import JWTService from "../../../services/JWTService";

const SOCKET_URL: string = import.meta.env.VITE_SOCKET_URL;

interface SocketData {
    version: number;
    text: string;
    startIndex: number;
    endIndex: number;
    type: string
}

export class SocketClass {
    private socket: Socket;
    private documentKey: string;
    private version: number = 0;
    constructor(documentKey: string) {
        this.documentKey = documentKey;
        console.log(SOCKET_URL);
        this.socket = io(SOCKET_URL);

        this.socket.on('connect', () => {
            console.log("Client connected");

            this.socket.emit('connect_document', {documentKey, token: JWTService.getToken()});
        });

        this.socket.on("event", this.onReceive.bind(this));
    }

    public onReceive(data: SocketData) {
        console.log(data);
    }

    public emitInsert(text: string, startIndex: number, endIndex: number): void {
        this.emit({
            startIndex,
            endIndex,
            text,
            type: "insert",
            version: this.version,
        });
    }

    public emitDelete(text: string, startIndex: number, endIndex: number): void {
        this.emit({
            startIndex,
            endIndex,
            text,
            type: "delete",
            version: this.version,
        });
    }

    private emit(socketData: SocketData) {
        this.socket.emit("operation", socketData);
    }

    dispose(): void {
        this.socket.close();
    }
}