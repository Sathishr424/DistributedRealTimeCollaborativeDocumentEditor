import {io, Socket} from "socket.io-client";

const SOCKET_URL: string = import.meta.env.VITE_SOCKET_URL;

interface SocketRequest {
    version: number;
    text: string;
    startIndex: number;
    endIndex: number;
    type: string
}

export class SocketClass {
    private socket: Socket;
    private version: number = 0;
    constructor() {
        console.log(SOCKET_URL);
        this.socket = io(SOCKET_URL);

        this.socket.on('connect', () => {
            console.log("Client connected");
        })
    }

    public emitInsert(index: number, text: string): void {
        this.socket.emit("insert", );
    }

    dispose(): void {
        this.socket.close();
    }
}