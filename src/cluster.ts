import * as http from "http";
import cluster from "cluster";
import { Worker } from "cluster";
import { cpus } from "os";
import { handleRequest } from "./routes/routes";
import { users, synchronizeUsers } from "./models/modelUser";
import * as dotenv from "dotenv";
import { IncomingMessage, ServerResponse } from "http";
import { Message } from "./types/message";

dotenv.config();

const PORT = parseInt(process.env.PORT || "4000", 10);

export function startCluster() {
  if (cluster.isPrimary) {
    const numWorkers = cpus().length - 1 || 1;
    const workers: Worker[] = [];

    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numWorkers; i++) {
      const workerPort = PORT + i + 1;
      const worker = cluster.fork({ WORKER_PORT: workerPort.toString() });
      workers.push(worker);
    }

    let currentWorker = 0;

    const loadBalancer = http.createServer((req, res) => {
      const workerPort = PORT + ((currentWorker % numWorkers) + 1);
      const proxyReq = http.request(
        {
          hostname: "localhost",
          port: workerPort,
          path: req.url,
          method: req.method,
          headers: req.headers,
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
          proxyRes.pipe(res, { end: true });
        }
      );

      req.pipe(proxyReq, { end: true });

      currentWorker = (currentWorker + 1) % numWorkers;
    });

    loadBalancer.listen(PORT, () => {
      console.log(`Load balancer is running on port ${PORT}`);
    });

    for (const worker of workers) {
      worker.on("message", (message: Message) => {
        if (message.type === "syncRequest") {
          worker.send({ type: "sync", data: users });
        } else if (message.type === "update") {
          synchronizeUsers(message.data);
          for (const otherWorker of workers) {
            if (otherWorker !== worker) {
              otherWorker.send({ type: "sync", data: users });
            }
          }
        }
      });
    }
  } else {
    const workerPort = process.env.WORKER_PORT
      ? parseInt(process.env.WORKER_PORT, 10)
      : PORT + 1;

    const server = http.createServer(
      (req: IncomingMessage, res: ServerResponse) => {
        handleRequest(req, res);
      }
    );

    server.listen(workerPort, () => {
      console.log(`Worker ${process.pid} is running on port ${workerPort}`);
    });

    process.send && process.send({ type: "syncRequest" });

    process.on("message", (message: Message) => {
      if (message.type === "sync") {
        synchronizeUsers(message.data);
      }
    });
  }
}
