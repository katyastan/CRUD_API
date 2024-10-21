"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequest = handleRequest;
const url_1 = require("url");
const userController_1 = require("../controller/userController");
function handleRequest(req, res) {
    const parsedUrl = (0, url_1.parse)(req.url || '', true);
    const pathname = parsedUrl.pathname || '';
    const method = req.method || '';
    const idMatch = pathname.match(/^\/api\/users\/([0-9a-fA-F-]+)$/);
    const id = idMatch ? idMatch[1] : null;
    if (pathname === '/api/users' && method === 'GET') {
        (0, userController_1.getAllUsersController)(req, res);
    }
    else if (id && pathname === `/api/users/${id}` && method === 'GET') {
        (0, userController_1.getUserController)(req, res, id);
    }
    else if (pathname === '/api/users' && method === 'POST') {
        (0, userController_1.createUserController)(req, res);
    }
    else if (id && pathname === `/api/users/${id}` && method === 'PUT') {
        (0, userController_1.updateUserController)(req, res, id);
    }
    else if (id && pathname === `/api/users/${id}` && method === 'DELETE') {
        (0, userController_1.deleteUserController)(req, res, id);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint not found' }));
    }
}
