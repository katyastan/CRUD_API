"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const http = __importStar(require("http"));
const routes_1 = require("../routes/routes");
let server;
beforeAll((done) => {
    server = http.createServer(routes_1.handleRequest);
    server.listen(4000, () => done());
});
afterAll((done) => {
    server.close(() => done());
});
describe('User API testing', () => {
    let testUserId;
    it('should return an empty array when there are no users', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).get('/api/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    }));
    it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            username: 'Lalala',
            age: 30,
            hobbies: ['reading', 'gaming'],
        };
        const response = yield (0, supertest_1.default)(server).post('/api/users').send(newUser);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe('Lalala');
        expect(response.body.age).toBe(30);
        expect(response.body.hobbies).toEqual(['reading', 'gaming']);
        testUserId = response.body.id;
    }));
    it('should retrieve the created user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).get(`/api/users/${testUserId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testUserId);
        expect(response.body.username).toBe('Lalala');
        expect(response.body.age).toBe(30);
        expect(response.body.hobbies).toEqual(['reading', 'gaming']);
    }));
    it('should update the user', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = {
            username: 'LalalaUpd',
            age: 31,
            hobbies: ['coding', 'sleeping', 'eating'],
        };
        const response = yield (0, supertest_1.default)(server)
            .put(`/api/users/${testUserId}`)
            .send(updatedUser);
        expect(response.status).toBe(200);
        expect(response.body.username).toBe('LalalaUpd');
        expect(response.body.age).toBe(31);
        expect(response.body.hobbies).toEqual(['coding', 'sleeping', 'eating']);
    }));
    it('should delete the user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).delete(`/api/users/${testUserId}`);
        expect(response.status).toBe(204);
        const getResponse = yield (0, supertest_1.default)(server).get(`/api/users/${testUserId}`);
        expect(getResponse.status).toBe(404);
    }));
    it('should return 404 after deletion', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).get(`/api/users/${testUserId}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    }));
});
