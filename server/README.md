# API Documentation

## Getting Started

### Prerequisites
- Install [Docker](https://www.docker.com/) if using Docker to run the application.
- Install [Node.js](https://nodejs.org/) if running the application locally.

### Starting the Application
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies (if running locally):
   ```bash
   npm install
   ```

3. Start the application:
   - **Using Docker Compose**:
     ```bash
     docker-compose up
     ```
   - **Running locally**:
     ```bash
     npm run start
     ```

The application will be available at `http://localhost:<port>`.

---

## Testing the Application

### Running Tests
1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

2. Run the test suite:
   ```bash
   npm run test
   ```

Tests are located in the `__test__` directory and cover middleware, controllers, and endpoints.

---

## API Endpoints

### Authentication Endpoints

1. **Sign Up**
   - **URL**: `/api/auth/signup`
   - **Method**: POST
   - **Middleware**:
     - `verifySignUp.checkDuplicateUsernameOrEmail`
     - `verifySignUp.checkRolesExisted`
   - **Description**: Registers a new user.

2. **Sign In**
   - **URL**: `/api/auth/signin`
   - **Method**: POST
   - **Description**: Authenticates a user and returns a token.

3. **Refresh Token**
   - **URL**: `/api/auth/refreshtoken`
   - **Method**: POST
   - **Description**: Refreshes the authentication token.

### User Access Endpoints

1. **Public Access**
   - **URL**: `/api/test/all`
   - **Method**: GET
   - **Description**: Returns public content accessible to all users.

2. **User Board**
   - **URL**: `/api/test/user`
   - **Method**: GET
   - **Middleware**: `authJwt.verifyToken`
   - **Description**: Returns user-specific content for authenticated users.

3. **Admin Board**
   - **URL**: `/api/test/admin`
   - **Method**: GET
   - **Middleware**:
     - `authJwt.verifyToken`
     - `authJwt.isAdmin`
   - **Description**: Returns admin-specific content for users with admin privileges.

### Permission-Specific Endpoints

1. **Read Permission**
   - **URL**: `/api/test/read`
   - **Method**: GET
   - **Middleware**:
     - `authJwt.verifyToken`
     - `verifyScope(["read"])`
   - **Description**: Returns content for users with read permissions.

2. **Write Permission**
   - **URL**: `/api/test/write`
   - **Method**: GET
   - **Middleware**:
     - `authJwt.verifyToken`
     - `verifyScope(["read", "write", "delete"])`
   - **Description**: Returns content for users with write and delete permissions.

