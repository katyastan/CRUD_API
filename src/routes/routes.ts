import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import {
  getAllUsersController,
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
} from '../controller/userController';

export function handleRequest(req: IncomingMessage, res: ServerResponse): void {
  try {
    const parsedUrl = parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';
    const method = req.method || '';
    const idMatch = pathname.match(/^\/api\/users\/([0-9a-fA-F-]+)$/);
    const id = idMatch ? idMatch[1] : null;

    if (pathname === '/api/users' && method === 'GET') {
        getAllUsersController(req, res);
    } else if (id && pathname === `/api/users/${id}` && method === 'GET') {
        getUserController(req, res, id);
    } else if (pathname === '/api/users' && method === 'POST') {
        createUserController(req, res);
    } else if (id && pathname === `/api/users/${id}` && method === 'PUT') {
        updateUserController(req, res, id);
    } else if (id && pathname === `/api/users/${id}` && method === 'DELETE') {
        deleteUserController(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint not found' }));
    }
  } catch {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
}
