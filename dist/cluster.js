"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const os_1 = require("os");
const http = __importStar(require("http"));
const routes_1 = require("./routes/routes");
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const numCPUs = (0, os_1.cpus)().length;
if (cluster_1.default.isPrimary) {
    console.log(`Primary process is running (PID: ${process.pid})`);
    for (let i = 0; i < numCPUs - 1; i++) {
        const workerPort = PORT + i + 1;
        cluster_1.default.fork({ WORKER_PORT: workerPort });
    }
    let currentWorker = 0;
    const loadBalancer = http.createServer((req, res) => {
        const workerPort = PORT + (currentWorker % (numCPUs - 1)) + 1;
        const options = {
            hostname: "localhost",
            port: workerPort,
            path: req.url,
            method: req.method,
            headers: req.headers,
        };
        const proxy = http.request(options, (workerRes) => {
            res.writeHead(workerRes.statusCode || 500, workerRes.headers);
            workerRes.pipe(res, { end: true });
        });
        req.pipe(proxy, { end: true });
        currentWorker++;
    });
    loadBalancer.listen(PORT, () => {
        console.log(`Load balancer is listening on port ${PORT}`);
    });
    cluster_1.default.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster_1.default.fork();
    });
}
else {
    const workerPort = process.env.WORKER_PORT;
    const server = http.createServer((req, res) => {
        (0, routes_1.handleRequest)(req, res);
    });
    server.listen(workerPort, () => {
        console.log(`Worker ${process.pid} is listening on port ${workerPort}`);
    });
}
