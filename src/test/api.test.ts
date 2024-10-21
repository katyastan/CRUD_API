import request from "supertest";
import * as http from "http";
import { handleRequest } from "../routes/routes";

let server: http.Server;

beforeAll((done) => {
  server = http.createServer(handleRequest);
  server.listen(4000, () => done());
});

afterAll((done) => {
  server.close(() => done());
});

describe("User API testing", () => {
  let testUserId: string;

  it("should return an empty array when there are no users", async () => {
    const response = await request(server).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should create a new user", async () => {
    const newUser = {
      username: "Lalala",
      age: 30,
      hobbies: ["reading", "gaming"],
    };

    const response = await request(server).post("/api/users").send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.username).toBe("Lalala");
    expect(response.body.age).toBe(30);
    expect(response.body.hobbies).toEqual(["reading", "gaming"]);

    testUserId = response.body.id;
  });

  it("should retrieve the created user by ID", async () => {
    const response = await request(server).get(`/api/users/${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testUserId);
    expect(response.body.username).toBe("Lalala");
    expect(response.body.age).toBe(30);
    expect(response.body.hobbies).toEqual(["reading", "gaming"]);
  });

  it("should update the user", async () => {
    const updatedUser = {
      username: "LalalaUpd",
      age: 31,
      hobbies: ["coding", "sleeping", "eating"],
    };

    const response = await request(server)
      .put(`/api/users/${testUserId}`)
      .send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body.username).toBe("LalalaUpd");
    expect(response.body.age).toBe(31);
    expect(response.body.hobbies).toEqual(["coding", "sleeping", "eating"]);
  });

  it("should delete the user by ID", async () => {
    const response = await request(server).delete(`/api/users/${testUserId}`);
    expect(response.status).toBe(204);

    const getResponse = await request(server).get(`/api/users/${testUserId}`);
    expect(getResponse.status).toBe(404);
  });

  it("should return 404 after deletion", async () => {
    const response = await request(server).get(`/api/users/${testUserId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});
