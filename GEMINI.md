# Intelligent Law & Justice Management Platform - Project Overview

This project is a role-based digital justice workflow platform designed to bridge fragmented court systems. It facilitates interactions between citizens, police, lawyers, and judges through a microservices architecture, featuring AI legal assistance and secure, tamper-proof digital evidence storage.

## Architecture

The system consists of four main components:

1.  **Core Backend (`/backend`):** Node.js + Express + MongoDB. Manages user authentication (JWT), RBAC, case management, and orchestration between other services.
2.  **AI Service (`/ai-service`):** Python + Flask. Provides legal intelligence, including complaint categorization, law suggestions, and case summarization.
3.  **Evidence Service (`/evidence-service`):** Node.js + Multer. Handles secure file storage and generates SHA256 hashes for evidence verification.
4.  **Frontend (`/frontend`):** React + Vite + Tailwind CSS. Provides specialized dashboards for all user roles (Citizen, Police, Lawyer, Judge, Admin).

## Technologies

*   **Frontend:** React 19, Vite, Tailwind CSS, Lucide React, Axios, React Router.
*   **Backend:** Node.js, Express, Mongoose (MongoDB), JWT (jsonwebtoken), Bcryptjs.
*   **AI:** Python 3, Flask, Flask-CORS.
*   **Evidence:** Multer (file uploads), Crypto-js/Node Crypto (hashing).

## User Roles & Permissions (RBAC)

*   **CITIZEN:** Files complaints, tracks own cases.
*   **POLICE:** Manages assigned cases, conducts investigations, uploads evidence.
*   **LAWYER:** Reviews evidence, submits legal arguments.
*   **JUDGE:** Presides over trials, locks evidence, issues verdicts.
*   **ADMIN:** Manages users, assigns Police and Judges to cases.

## Getting Started

### Prerequisites

*   Node.js and npm installed.
*   Python 3 and `venv` installed.
*   MongoDB running locally (`mongodb://localhost:27017/justice_platform`).

### Running the Project

The root directory includes a helper script to start all services simultaneously:

```bash
./run_all.sh
```

Alternatively, you can run services individually:

#### Backend
```bash
cd backend
npm install
npm run dev # Starts on port 5000
```

#### AI Service
```bash
cd ai-service
# (Ensure venv is active)
pip install -r requirements.txt # (Or install manually: flask flask-cors requests)
python app.py # Starts on port 8000
```

#### Evidence Service
```bash
cd evidence-service
npm install
node index.js # Starts on port 9000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev # Starts on default Vite port (usually 5173)
```

## Development Conventions

*   **Environment Variables:** Configured via `.env` files in `backend`, `evidence-service`, etc. (Check code for required variables like `MONGODB_URI`, `JWT_SECRET`, `PORT`).
*   **API Communication:** Frontend communicates with the Core Backend (`5000`). Core Backend proxies specific requests to AI (`8000`) and Evidence (`9000`) services.
*   **Evidence Security:** Evidence files are hashed upon upload. The hash is stored in MongoDB to ensure immutability. Once a case is "locked" by a judge, no further modifications are allowed.
*   **Audit Logging:** Critical actions (case creation, status updates) are logged in the `logs` collection via `auditMiddleware`.
*   **Styling:** Utility-first CSS using Tailwind CSS v4.
