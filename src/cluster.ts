import cluster from "cluster";
import { cpus } from "os";
import * as http from "http";
import { handleRequest } from "./routes/routes";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary process is running (PID: ${process.pid})`);

  for (let i = 0; i < numCPUs - 1; i++) {
    const workerPort = PORT + i + 1;
    cluster.fork({ WORKER_PORT: workerPort });
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

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const workerPort = process.env.WORKER_PORT;
  const server = http.createServer((req, res) => {
    handleRequest(req, res);
  });

  server.listen(workerPort, () => {
    console.log(`Worker ${process.pid} is listening on port ${workerPort}`);
  });
}
