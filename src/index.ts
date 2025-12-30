import * as dotenv from 'dotenv';
dotenv.config();
import app from "./server"
import fs from "node:fs";
import https from "https";

const options = {
    key: fs.readFileSync("/home/sat/Documents/ssl/192.168.0.130+1-key.pem"),
    cert: fs.readFileSync("/home/sat/Documents/ssl/192.168.0.130+1.pem"),
};

https.createServer(options, app).listen(5000, "0.0.0.0", () => {
    console.log("HTTPS API running on https://192.168.1.5:5000");
});
