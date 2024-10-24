import { IncomingMessage, ServerResponse } from 'http';
import { validate as isUuid } from 'uuid';
import {
  getAllUsers,
  getUserById as getUserByIdFromModel,
  createUser as createUserInModel,
  updateUser as updateUserInModel,
  deleteUser as deleteUserFromModel,
} from '../models/modelUser';

export function getAllUsersController(req: IncomingMessage, res: ServerResponse): void {
  const users = getAllUsers();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
}

export function getUserController(req: IncomingMessage, res: ServerResponse, id: string): void {
  if (!isUuid(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid user ID format' }));
    return;
  }

  const user = getUserByIdFromModel(id);
  if (user) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
  }
}

export function createUserController(req: IncomingMessage, res: ServerResponse): void {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const { username, age, hobbies } = JSON.parse(body);

      if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid or missing user data' }));
        return;
      }

      const newUser = createUserInModel({ username, age, hobbies });
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });
}

export function updateUserController(req: IncomingMessage, res: ServerResponse, id: string): void {
  if (!isUuid(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid user ID format' }));
    return;
  }

  const userExists = getUserByIdFromModel(id);
  if (!userExists) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }

  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const { username, age, hobbies } = JSON.parse(body);

      if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid or missing user data' }));
        return;
      }

      const updatedUser = updateUserInModel(id, { username, age, hobbies });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedUser));
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });
}

export function deleteUserController(req: IncomingMessage, res: ServerResponse, id: string): void {
  if (!isUuid(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid user ID format' }));
    return;
  }

  const success = deleteUserFromModel(id);

  if (success) {
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
  }
}
