import 'dotenv/config'
import app from "./app";
const PORT = process.env.PORT || 7000;
import * as  http from 'http'
const server = http.createServer(app)

server.listen(PORT, () => {
    console.log(`listening on: http://localhost:${PORT}`);
})