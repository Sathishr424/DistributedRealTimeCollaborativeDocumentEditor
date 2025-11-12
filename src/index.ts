import app from "./server"
import 'dotenv/config';

app.listen(5000, () => {
    console.log("Server is running on port 3000");
});