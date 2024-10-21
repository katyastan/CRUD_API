"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.synchronizeUsers = synchronizeUsers;
const uuid_1 = require("uuid");
const events_1 = require("events");
exports.users = [];
const eventEmitter = new events_1.EventEmitter();
function getAllUsers() {
    return exports.users;
}
function getUserById(id) {
    return exports.users.find(user => user.id === id);
}
function createUser(userData) {
    const newUser = Object.assign({ id: (0, uuid_1.v4)() }, userData);
    exports.users.push(newUser);
    process.send && process.send({ type: 'update', data: exports.users });
    return newUser;
}
function updateUser(id, userData) {
    const index = exports.users.findIndex(user => user.id === id);
    if (index !== -1) {
        exports.users[index] = Object.assign({ id }, userData);
        process.send && process.send({ type: 'update', data: exports.users });
        return exports.users[index];
    }
    return null;
}
function deleteUser(id) {
    const index = exports.users.findIndex(user => user.id === id);
    if (index !== -1) {
        exports.users.splice(index, 1);
        process.send && process.send({ type: 'update', data: exports.users });
        return true;
    }
    return false;
}
function synchronizeUsers(updatedUsers) {
    exports.users.length = 0;
    exports.users.push(...updatedUsers);
}
