const http = require("http");
// import http from "http";
const app = require("./app");
// import app from "./app";

const port = process.env.port || 6002;

const server = http.createServer(app);

server.listen(port, () => {
 console.log("Server started at port " + port)
});
