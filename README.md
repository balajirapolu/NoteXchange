# 📚 NoteXchange — Academic Note Repository Platform

[![Java](https://img.shields.io/badge/Java-21-orange.svg?style=for-the-badge&logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.0-brightgreen.svg?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.0-blue.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED.svg?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg?style=for-the-badge&logo=mysql)](https://www.mysql.com/)

**NoteXchange** is an enterprise-grade, full-stack academic repository platform designed for students, researchers, and educators to upload, discover, stream, rate, and manage verified academic study materials. 

Built with a robust **Spring Boot 3 REST backend**, a high-performance **React + Tailwind CSS frontend**, and fully containerized via **Docker Compose & Nginx**, NoteXchange provides a secure, seamless environment for academic collaboration.

---

## 🏛️ System Architecture

```
[ User Browser / Client ]
           │
           │ (HTTP / Port 3000)
           ▼
┌──────────────────────────────────────────────┐
│  Nginx Web Server (Frontend Container)       │
│  - React 19 SPA Static Distribution          │
│  - Reverse Proxy (/api -> Spring Boot)       │
└──────────────────────┬───────────────────────┘
                       │
                       │ (REST APIs / Port 8080)
                       ▼
┌──────────────────────────────────────────────┐
│  Spring Boot Backend (Java 21 Container)     │
│  - Spring Security + JWT Authentication      │
│  - JPA / Hibernate ORM Layer                 │
│  - Multipart File Streaming & Management     │
└──────────────────────┬───────────────────────┘
                       │
                       │ (JDBC / Port 3306)
                       ▼
┌──────────────────────────────────────────────┐
│  MySQL Database (Persistent Relational DB)   │
│  - Users, Notes, Ratings, & File Data        │
└──────────────────────────────────────────────┘
```

---

## ✨ Key Features

- **🔐 Stateless JWT Authentication**: Secure register, login, and token-based authorization via Spring Security.
- **📂 Academic Note Repository**: Upload, category-tag, and search study materials by title, subject, and semester.
- **👁️ Inline Document Viewer**: Instant PDF viewing and direct attachment download capabilities.
- **⭐ Community Rating System**: Rate verified notes and dynamically sort top-performing academic resources.
- **👤 Personalized User Workspace**: "My Notes" dashboard allows users to manage and curate their own uploaded notes.
- **🐳 Enterprise Docker Containerization**: Multi-stage Docker builds for backend and frontend with Docker Compose orchestration.

---

## 🛠️ Technology Stack

| Component | Technology | Version |
| :--- | :--- | :--- |
| **Backend Framework** | Spring Boot | 3.4.0 / Java 21 |
| **Security Layer** | Spring Security, JJWT | 0.12.6 |
| **Database & ORM** | MySQL, Spring Data JPA / Hibernate | 8.0 |
| **Frontend UI** | React, Vite, Tailwind CSS, Lucide Icons | 19.0 |
| **API Client** | Axios (with Bearer Token Interceptors) | 1.19 |
| **Web Server & Reverse Proxy** | Nginx | Alpine |
| **Containerization** | Docker, Docker Compose | v3.8 Specification |

---

## 📁 Project Structure

```text
NoteXchange/
├── docker-compose.yml              # Multi-container Docker orchestration
├── README.md                       # Comprehensive project documentation
├── notexchange/                    # Spring Boot 3 Backend
│   ├── Dockerfile                  # Multi-stage Java 21 Docker build
│   ├── pom.xml                     # Maven project configuration
│   └── src/
│       └── main/
│           ├── java/com/balaji/notexchange/
│           │   ├── controller/    # REST API endpoints (Auth, Note)
│           │   ├── dto/           # Data Transfer Objects (Auth, Note)
│           │   ├── entity/        # JPA Entities (User, Note, Rating)
│           │   ├── repository/    # Spring Data JPA repositories
│           │   ├── security/      # JWT Filter & Security Configuration
│           │   └── service/       # Business logic implementations
│           └── resources/
│               └── application.properties
└── notexchange-frontend/           # React 19 Frontend App
    ├── Dockerfile                  # Multi-stage Node + Nginx Docker build
    ├── nginx.conf                  # Nginx SPA routing & API proxy config
    ├── package.json                # Frontend dependencies
    └── src/
        ├── api/                    # Axios HTTP client configuration
        ├── components/             # React components (Auth, Notes, Modals)
        ├── context/                # Global AuthContext & state management
        └── App.jsx                 # Main application view & routing
```

---

## 🚀 Quick Start (Docker Deployment)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Launching the Application
Run the following command in the root directory:

```bash
docker compose up --build -d
```

### Accessing Services
- **Web Frontend**: [http://localhost:3000](http://localhost:3000)
- **Spring Boot REST API**: [http://localhost:8080/api](http://localhost:8080/api)
- **Swagger Documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## 🛠️ Local Development Setup

### 1. Backend Setup (Spring Boot)
Ensure Java 21 and MySQL are installed locally.

```bash
cd notexchange
./mvnw clean install
./mvnw spring-boot:run
```

### 2. Frontend Setup (React)
Ensure Node.js (v20+) is installed.

```bash
cd notexchange-frontend
npm install
npm run dev
```

---

## 🔑 REST API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Authenticate and receive JWT bearer token
- `GET  /api/auth/me` — Fetch current user details

### Notes Management (`/api/notes`)
- `GET  /api/notes` — Fetch all notes (filterable by `subject` & `semester`)
- `GET  /api/notes/top` — Fetch top-rated academic notes
- `GET  /api/notes/mine` — Fetch notes uploaded by the current user
- `POST /api/notes/upload` — Upload a new academic note (Multipart data)
- `GET  /api/notes/{id}/file` — Stream file content inline
- `GET  /api/notes/{id}/download` — Download attached note PDF
- `DELETE /api/notes/{id}` — Delete user-owned note

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Balaji Rapolu**  
- GitHub: [@balajirapolu](https://github.com/balajirapolu)  
- Project Repository: [NoteXchange](https://github.com/balajirapolu/NoteXchange)
