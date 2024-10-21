import { User } from '../types/user';
import { v4 as uuidv4 } from 'uuid';

export let users: User[] = [];

export function getAllUsers(): User[] {
  return users;
}

export function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

export function createUser(userData: Omit<User, 'id'>): User {
  const newUser: User = { id: uuidv4(), ...userData };
  users.push(newUser);
  return newUser;
}

export function updateUser(id: string, userData: Omit<User, 'id'>): User | null {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = { id, ...userData };
    return users[index];
  }
  return null;
}

export function deleteUser(id: string): boolean {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
}
