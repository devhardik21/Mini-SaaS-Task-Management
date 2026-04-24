# 🚀 Mini-SaaS Task Manager

A production-ready, full-stack Task Management application featuring Clerk authentication, role-based access control, real-time activity logging, and data-driven insights.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: React Hooks
- **Data Fetching**: [Axios](https://axios-http.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: [Clerk](https://clerk.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Sequelize](https://sequelize.org/)
- **Security**: [Helmet](https://helmetjs.github.io/), [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)
- **Validation**: [Express Validator](https://express-validator.github.io/docs/)

---

## ✨ Features

- **🔐 Secure Authentication**: Integrated with Clerk for Google OAuth and email-based login.
- **📋 Task Management**: Full CRUD operations for tasks with status (Todo, In Progress, Completed) and priority (Low, Medium, High) levels.
- **📊 Analytics Dashboard**: Visual representation of task distribution and status using interactive charts.
- **🛡️ RBAC (Role-Based Access Control)**: Admin dashboard for user role management and system-wide visibility.
- **📜 Activity Logs**: Comprehensive tracking of all user actions for audit and monitoring.
- **⚡ Performance & Security**: Optimized with API rate limiting, security headers, and structured error handling.

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
    subgraph Client ["Frontend (React + Vite)"]
        UI[User Interface]
        ClerkSDK[Clerk Auth SDK]
        Axios[Axios Client]
    end

    subgraph Auth ["Authentication"]
        Clerk[Clerk Auth Service]
    end

    subgraph Server ["Backend (Express + Node.js)"]
        Middleware[Auth & Security Middleware]
        Controllers[API Controllers]
        Sequelize[Sequelize ORM]
    end

    subgraph Database ["Persistence Layer"]
        Postgres[(PostgreSQL)]
    end

    UI <--> ClerkSDK
    ClerkSDK <--> Clerk
    UI <--> Axios
    Axios <--> Middleware
    Middleware <--> Controllers
    Controllers <--> Sequelize
    Sequelize <--> Postgres
    
    style Client fill:#f9f,stroke:#333,stroke-width:2px
    style Server fill:#bbf,stroke:#333,stroke-width:2px
    style Database fill:#dfd,stroke:#333,stroke-width:2px
    style Auth fill:#ffd,stroke:#333,stroke-width:2px
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Clerk Account (for API keys)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd mini-saas
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
DATABASE_URL=postgresql://user:password@localhost:5432/taskdb
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
Run migrations:
```bash
npm run migrate
```
Start development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
VITE_API_URL=http://localhost:5000
```
Start development server:
```bash
npm run dev
```

---

## 🔌 API Documentation

### User Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/users/me` | Get current user profile | Private |
| PATCH | `/api/users/me` | Update current user profile | Private |
| POST | `/api/users/sync` | Sync user from Clerk to Local DB | Private |
| GET | `/api/users` | Get all users | Admin |
| PATCH | `/api/users/:id/role` | Update user role | Admin |

### Task Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/tasks` | Get all tasks for current user | Private |
| POST | `/api/tasks` | Create a new task | Private |
| PATCH | `/api/tasks/:id` | Update an existing task | Private |
| DELETE | `/api/tasks/:id` | Delete a task | Private |
| GET | `/api/tasks/stats` | Get task summary statistics | Private |
| GET | `/api/tasks/chart` | Get task data for charts | Private |

### Activity Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/activity` | Get user activity logs | Private |

---

## 📄 License
This project is licensed under the MIT License.
