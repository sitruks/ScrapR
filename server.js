const http = require("http");
// import http from "http";
const app = require("./app");
// import app from "./app";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`)
});