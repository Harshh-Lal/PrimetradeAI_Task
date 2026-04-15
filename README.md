# Primetrade Task Manager

This is a full-stack Task Management application featuring role-based access control, a secure backend, and a clean frontend UI. It was built as part of the Primetrade Backend Developer (Intern) assignment.

## Tech Stack
- **Backend:** Node.js, Express, Prisma (MySQL via MariaDB adapter), Zod (Validation), JWT (Auth), Swagger (Docs), bcryptjs
- **Frontend:** React (Vite), TailwindCSS, Axios

## Features
- **User Authentication:** Registration and Login with JWT tokens and bcrypt password hashing.
- **Role-based Access Control:** Segregation between standard users and admins.
  - Normal users manage their own tasks.
  - Admins can view and manage tasks for all users, and also manage users themselves.
- **Task Management (CRUD):** Users can easily create, read, update (including status toggling), and delete tasks.
- **Security:** Helmet for securing HTTP headers, and centralized Express Error Handling.

## Quick Start

### 1. Database Setup (MySQL)
Ensure MySQL is running. Update `backend/.env` with your DB credentials:
```env
DATABASE_URL="mysql://username:password@localhost:3306/primetrade_db"
```
Run migrations inside `backend` folder:
```sh
npm install
npx prisma migrate dev
```

### 2. Backend Server
```sh
cd backend
npm install
npm run start
```
The API should run on `http://localhost:5000`. Swagger API documentation is available at `http://localhost:5000/api-docs`.

### 3. Setup Admin User (Optional)
Run the seed script in `backend` to spawn an admin user:
```sh
node seedAdmin.js
```
Credentials:
- Email: `admin@primetrade.ai`
- Password: `adminpassword`

### 4. Frontend Application
```sh
cd frontend
npm install
npm run dev
```

---

## Scalability & Production Readiness Note

To transition this application from a local monolith to a highly scalable production system, the following approaches can be employed:

1. **Caching (Redis):** Cache frequently accessed routes (like `/tasks` fetching) and user session/authentication data (token blacklisting) to offload database reads.
2. **Horizontal Scaling & Load Balancing:** Containerize the Node.js apps using Docker and deploy them over an orchestrator like Kubernetes (or AWS ECS). Put an Application Load Balancer in front to distribute incoming API traffic effectively across multiple backend nodes.
3. **Microservices Migration:** Over time, as features grow, the monolithic entity could be separated into distinct sub-domains. For instance, extracting the `Auth Service` and `Task Service` as decoupled microservices connected via an event bus (e.g., Kafka or RabbitMQ).
4. **Database Optimization:** Configure master-slave replication for MySQL where writes go to the master and reads are load-balanced across fast replica nodes. Introduce indexing aggressively on high-trafficked columns (like `userId` and `role`).
5. **Rate Limiting & DDos Protection:** Implement rate-limiters at the API Gateway (or via tools like Cloudflare) to deter abuse.
