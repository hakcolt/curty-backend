# Curty Backend

**Curty Restful API** is a backend service developed to [**Curty URL shortner**](https://github.com/hakcolt/curty) made entirely with typescript and Clean Architecture concepts. If you want more details about how the components works, i sugest you take a look at [Node A2](https://github.com/hakcolt/node-a2) template on which this project was based.

## 🚀 Getting Started

These instructions enable you to obtain a copy of this project in your local machine for development and test purpose.

### 📋 Pre requiriments

What do you need to use this project:

* Node v14 or higher
* NPM v8 or higher
* Postgres v9.6 or higher (Don't necessary if using docker)
* Docker v20 or higher (Optional)

### 🔧 Instalation with docker

Install dependencies:

```shell
npm install
```

Initialize docker container:

```shell
npm run dev:up
```

### 👾 Instalation without docker:

Rename `.env.example` to `.env` and replace the attributes:

```text
NODE_ENV=development
SERVER_API_PATH=/api
SERVER_HOST=localhost # IT'S IMPORTANT DEFINE IT TO COOKIES TO FUNCTION IN PRODUCTION ENVIRONMENT
SERVER_PORT=3000
ALLOWED_ORIGINS="http://localhost:5432,http://localhost:3200"
JWT_JWT_REFRESH_TOKEN_KEY=defineYourKey
JWT_JWT_REFRESH_TOKEN_TIME_IN_SECONDS=2592000 # 30 DAYS IN SECONDS
JWT_ACCESS_TOKEN_KEY=defineAnotherKey
JWT_ACCESS_TOKEN_TIME_IN_SECONDS=3600 # 1 HOURS IN SECONDS
DATABASE_URL="postgresql://user:password@localhost:5432/curty?schema=public" # DON'T NECESSARY IF USING DOCKER COMPOSE
```

Install dependencies:

```shell
npm install
```

Prepare database:

```shell
npm run prisma:dev
```

And then initialize development server:

```shell
npm run dev
```

Now the application is running on port you defined.

## ⚙️ Running tests

The **Curty Restful API** use vitest to run tests. Vitest works like jest, however it's more faster and has better performance.

To execute tests, run the following command:

```shell
npm run test
```

To coverage mode:

```shell
npm run coverage
```

## 📦 Implementation

The user login, submitting the email address and password of the user in the request body. The server then validates the user credentials and, if valid, generates a **JWT** access token and a **JWT** refresh token. The access token is used on **Authorization** header to access the protected resources (as get a link, for example), while the refresh token is saved in response cookies to be used to obtain a new access token when the current access token expires.

### Registration:

* Path: `/api/v1/users/signup`
* Method: **POST**
* Body: 
```typescript
{
  "firstName": string,
  "lastName": string,
  "email": string,
  "password": string,
  "imageUrl": string,
  "gender": "male" | "female" | "nobinary",
}
```
* Response: Status code 201 with sucessful message.

### Login:

* Path: `/api/v1/users/signin`
* Method: **POST**
* Body: 
```typescript
{
  "email": string,
  "password": string
}
```
* Response: Status code 200 with the user information and access token.

### Refresh access token:

* Path: `/api/v1/users/refresh`
* Method: **GET**
* Response: Status 200 with new access token that enable the user to access your resources.

### Fetch logged in user information:

* Path: `/api/v1/users/get`
* Method: **GET**
* Header: `Authorization: Bearer :accessToken` (Replace the ":accessToken")
* Response: Status code 200 with user information.

### Create link:

* Path: `/api/v1/links`
* Method: **POST**
* Header: `Authorization: Bearer :accessToken` (Replace the ":accessToken")
* Body: 
```typescript
{
  "name": string | undefined,
  "path": string
  "url": string
}
```
* Response: Status code 201 with link information.

### Fetch all links:

* Path: `/api/v1/links`
* Method: **GET**
* Header: `Authorization: Bearer :accessToken` (Replace the ":accessToken")
* Response: All links that the logged in user has created.

### Fetch a link:

* Path: `/api/v1/links/:id` (Replace the ":id")
* Method: **GET**
* Header: `Authorization: Bearer :accessToken` (Replace the ":accessToken")
* Response: Status code 200 with sucessful response.

> **warning:** The user can fetch only links he created

### Delete a link:

* Path: `/api/v1/links/:id` (Replace the ":id")
* Method: **DELETE**
* Header: `Authorization: Bearer :accessToken` (Replace the ":accessToken")
* Response: Status code 200 with sucessful response.

All requests return the following response model:

```typescript
{
  "message": string | undefined,
  "error": string | undefined,
  "statusCode": string,
  "data": object | Array<any> | undefined
  "_isSuccess": boolean
}
```

A request to `/api/v1/users/get` if successful returns:

```json
{
  "message": "Successful operation",
  "statusCode": 201,
  "data": {
    "firstName": "Igor",
    "lastName": "Hakcolt",
    "email": "test@hakcolt.com",
    "password": "Test123",
    "imageUrl": undefined,
    "gender": "male"
  },
  "_isSuccess": true
}
```

If fails, it should be:

```json
{
  "error": "Email or password invalid",
  "statusCode": 409,
  "_isSuccess": false
}
```

## ✒️ Authors

* **Igor Hakcolt** - Owner - [@hakcolt](https://github.com/hakcolt)

## 📄 License

This project is on the MIT license. See the file [LICENSE.md](https://github.com/hakcolt/curty/LICENSE.md) for more details.

## 🎁 Thanks

* If you liked this project, consider giving it a star. It won't cost you anything and that way you help me a lot. 📢;
* Tell someone about the project 🍺;

---
<p style="text-align: right">Made with ❤️ in Brazil.</p>