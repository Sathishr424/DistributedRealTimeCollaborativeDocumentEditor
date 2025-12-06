import * as dotenv from 'dotenv';
dotenv.config();
import app from "./server"

app.listen(5000, () => {
    console.log("Server is running on port 3000");
});