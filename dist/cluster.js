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
exports.startCluster = startCluster;
const http = __importStar(require("http"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = require("os");
const routes_1 = require("./routes/routes");
const modelUser_1 = require("./models/modelUser");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const PORT = parseInt(process.env.PORT || '3000', 10);
function startCluster() {
    if (cluster_1.default.isPrimary) {
        const numWorkers = (0, os_1.cpus)().length - 1 || 1;
        const workers = [];
        console.log(`Master ${process.pid} is running`);
        for (let i = 0; i < numWorkers; i++) {
            const workerPort = PORT + i + 1;
            const worker = cluster_1.default.fork({ WORKER_PORT: workerPort.toString() });
            workers.push(worker);
        }
        let currentWorker = 0;
        const loadBalancer = http.createServer((req, res) => {
            const workerPort = PORT + ((currentWorker % numWorkers) + 1);
            const proxyReq = http.request({
                hostname: 'localhost',
                port: workerPort,
                path: req.url,
                method: req.method,
                headers: req.headers,
            }, (proxyRes) => {
                res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
                proxyRes.pipe(res, { end: true });
            });
            req.pipe(proxyReq, { end: true });
            currentWorker = (currentWorker + 1) % numWorkers;
        });
        loadBalancer.listen(PORT, () => {
            console.log(`Load balancer is running on port ${PORT}`);
        });
        for (const worker of workers) {
            worker.on('message', (message) => {
                if (message.type === 'syncRequest') {
                    worker.send({ type: 'sync', data: modelUser_1.users });
                }
                else if (message.type === 'update') {
                    (0, modelUser_1.synchronizeUsers)(message.data);
                    for (const otherWorker of workers) {
                        if (otherWorker !== worker) {
                            otherWorker.send({ type: 'sync', data: modelUser_1.users });
                        }
                    }
                }
            });
        }
    }
    else {
        const workerPort = process.env.WORKER_PORT ? parseInt(process.env.WORKER_PORT, 10) : PORT + 1;
        const server = http.createServer((req, res) => {
            (0, routes_1.handleRequest)(req, res);
        });
        server.listen(workerPort, () => {
            console.log(`Worker ${process.pid} is running on port ${workerPort}`);
        });
        process.send && process.send({ type: 'syncRequest' });
        process.on('message', (message) => {
            if (message.type === 'sync') {
                (0, modelUser_1.synchronizeUsers)(message.data);
            }
        });
    }
}
