import { startCluster } from "./cluster";
import { handleRequest } from "./routes/routes";
import * as http from "http";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT || "4000", 10);

if (process.argv[2] === "multi") {
  startCluster();
} else {
  const server = http.createServer((req, res) => {
    handleRequest(req, res);
  });

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
