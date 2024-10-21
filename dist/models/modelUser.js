"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const uuid_1 = require("uuid");
exports.users = [];
function getAllUsers() {
    return exports.users;
}
function getUserById(id) {
    return exports.users.find(user => user.id === id);
}
function createUser(userData) {
    const newUser = Object.assign({ id: (0, uuid_1.v4)() }, userData);
    exports.users.push(newUser);
    return newUser;
}
function updateUser(id, userData) {
    const index = exports.users.findIndex(user => user.id === id);
    if (index !== -1) {
        exports.users[index] = Object.assign({ id }, userData);
        return exports.users[index];
    }
    return null;
}
function deleteUser(id) {
    const index = exports.users.findIndex(user => user.id === id);
    if (index !== -1) {
        exports.users.splice(index, 1);
        return true;
    }
    return false;
}
