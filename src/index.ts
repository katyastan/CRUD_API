import * as http from 'http';
import * as dotenv from 'dotenv';
import { handleRequest } from './routes/routes';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  req.on('error', (err) => {
    console.error('Request error:', err);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Bad Request' }));
  });

  res.on('error', (err) => {
    console.error('Response error:', err);
  });

  handleRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
