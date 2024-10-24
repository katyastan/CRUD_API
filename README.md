# CRUD_API
This is simple CRUD API using in-memory database underneath.
-

## Technical requirements

Use 22.x.x version (22.9.0 or upper) of Node.js

**Installation**

Clone the repository:

```bash
git clone git@github.com:katyastan/CRUD_API.git
```

Go to develop branch:
```bash
git checkout develop
```

Install dependencies:
```bash
npm install
```

#### The default port is 4000.

**Start in Development Mode:**

To run the application in development mode with automatic restarts on code changes:
```bash
npm run start:dev
```

**Start in Production Mode:**

To build and run the application in production mode:
```bash
npm run start:prod
```

**Start multiple instances:**
```bash
npm run start:multi
```

**Run tests:**
```bash
npm run test
```

## Endpoints

**The API provides the following endpoints:**

### Get All Users
- **Endpoint:** GET /api/users
- **Description:** Creates a new user.
- **Response:** JSON object of the user.

### Get User by ID
- **Endpoint:** GET /api/users/{userId}
- **Description:** Retrieves a user by their unique ID.
- **userId:** UUID of the user.
- **Response:** JSON object of the user.

### Create a New User
- **Endpoint:** POST /api/users
- **Description:**  Is used to create record about new user and store it in database
- **Response:** JSON object of the newly created user, including a generated id.
- **Request Body:**
```bash
{
  "username": "string",
  "age": number,
  "hobbies": ["string"]
}
```

### Update a User
- **Endpoint:** PUT /api/users/{userId}
- **Description:** Is used to update existing user
- **userId:** UUID of the user.
- **Response:** JSON object of the updated user.

### Delete a User
- **Endpoint:** DELETE /api/users/{userId}
- **Description:** Deletes a user.
- **userId:** UUID of the user.
- **Response:** No content (HTTP status code 204 No Content).


## Example Usage with cURL
### Get All Users:
```
curl -X GET http://localhost:4000/api/users
```
### Create a New User:
```
curl -X POST http://localhost:4000/api/users -d '{"username":"Kate","age":99,"hobbies":["code"]}'
```
###  Get a User by ID
```
curl -X GET http://localhost:4000/api/users/{userId}
```
You should replace {userId} with the actual id returned from the create command above. For example: `818ede85-cdcd-4fb6-99e2-fcdd2effaee7`
### Update a User
```
curl -X PUT http://localhost:4000/api/users/818ede85-cdcd-4fb6-99e2-fcdd2effaee7 -d '{"username":"Kate","age":199,"hobbies":["all", "and more"]}'
```
### Delete a User
```
curl -X DELETE http://localhost:4000/api/users/818ede85-cdcd-4fb6-99e2-fcdd2effaee7
```

## Good luck with using CRUD API!
