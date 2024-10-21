"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersController = getAllUsersController;
exports.getUserController = getUserController;
exports.createUserController = createUserController;
exports.updateUserController = updateUserController;
exports.deleteUserController = deleteUserController;
const uuid_1 = require("uuid");
const modelUser_1 = require("../models/modelUser");
function getAllUsersController(req, res) {
    const users = (0, modelUser_1.getAllUsers)();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
}
function getUserController(req, res, id) {
    if (!(0, uuid_1.validate)(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid user ID format' }));
        return;
    }
    const user = (0, modelUser_1.getUserById)(id);
    if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
    }
}
function createUserController(req, res) {
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
            const newUser = (0, modelUser_1.createUser)({ username, age, hobbies });
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        }
        catch (_a) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON format' }));
        }
    });
}
function updateUserController(req, res, id) {
    if (!(0, uuid_1.validate)(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid user ID format' }));
        return;
    }
    const userExists = (0, modelUser_1.getUserById)(id);
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
            const updatedUser = (0, modelUser_1.updateUser)(id, { username, age, hobbies });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedUser));
        }
        catch (_a) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON format' }));
        }
    });
}
function deleteUserController(req, res, id) {
    if (!(0, uuid_1.validate)(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid user ID format' }));
        return;
    }
    const success = (0, modelUser_1.deleteUser)(id);
    if (success) {
        res.writeHead(204);
        res.end();
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
    }
}
