# NyayaConnect: Intelligent Law & Justice Management Platform

NyayaConnect is a comprehensive digital justice workflow platform designed to bridge fragmented court systems. It streamlines interactions between citizens, law enforcement, legal professionals, and the judiciary through a secure microservices architecture, featuring AI-driven legal intelligence and tamper-proof digital evidence management.

## 🚀 Key Features

- **Role-Based Access Control (RBAC):** Tailored dashboards and permissions for Citizens, Police, Lawyers, Judges, and Admins.
- **AI-Powered Assistance:** Automated complaint categorization, relevant law (IPC/BNS) suggestions, and case summarization.
- **Secure Evidence Vault:** SHA-256 hashed evidence storage to ensure data integrity and prevent tampering.
- **Case Management Life-cycle:** End-to-end tracking from complaint filing to final verdict.
- **Audit Logging:** Transparent tracking of all critical system actions for accountability.

## 🏗️ Architecture

The platform is built using a microservices approach to ensure scalability and modularity:

1.  **Core Backend (`/backend`):** The central hub (Node.js/Express) managing authentication, RBAC, and case orchestration.
2.  **AI Service (`/ai-service`):** A Python-based intelligence layer (Flask) for legal text analysis.
3.  **Evidence Service (`/evidence-service`):** A dedicated storage and hashing service (Node.js) for handling sensitive case files.
4.  **Frontend (`/frontend`):** A modern, responsive user interface (React/Vite/Tailwind CSS).

## 🛠️ Technology Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React, Axios |
| **Backend** | Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt |
| **AI Service** | Python 3, Flask, Flask-CORS |
| **Evidence** | Node.js, Multer, Crypto-js |
| **Database** | MongoDB |

## 👥 User Roles & Workflow

- **Citizen:** Can file complaints and track the real-time status of their cases.
- **Police:** Investigates assigned cases, updates status, and uploads digital evidence.
- **Lawyer:** Accesses case details and evidence to prepare and submit legal arguments.
- **Judge:** Presides over cases, locks evidence to prevent changes, and issues final verdicts.
- **Admin:** System overseer responsible for user management and assigning officials to cases.

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18+) and **npm**
- **Python 3.x** and `pip`
- **MongoDB** (Running locally or a URI for Atlas)

### Quick Start (All Services)

The easiest way to start the entire platform is using the provided shell script:

```bash
chmod +x run_all.sh
./run_all.sh
```

### Manual Service Setup

If you prefer to run services individually:

#### 1. Core Backend
```bash
cd backend
npm install
npm run dev # Port 5000
```

#### 2. AI Service
```bash
cd ai-service
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py # Port 8000
```

#### 3. Evidence Service
```bash
cd evidence-service
npm install
node index.js # Port 9000
```

#### 4. Frontend
```bash
cd frontend
npm install
npm run dev # Port 5173
```

## 🔐 Environment Variables

Ensure you create `.env` files in the respective service directories.

**Backend (`/backend/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/justice_platform
JWT_SECRET=your_super_secret_key
AI_SERVICE_URL=http://localhost:8000
EVIDENCE_SERVICE_URL=http://localhost:9000
```

## 📜 Development Conventions

- **Security:** All evidence files are hashed upon upload; the hash is stored in MongoDB.
- **Immutability:** Once a Judge "locks" a case, evidence cannot be modified.
- **API Flow:** The Frontend primarily talks to the Core Backend, which proxies relevant requests to specialized services.
- **Styling:** Follows a utility-first approach using Tailwind CSS.

---
*Bridging the gap in the judicial system with technology.*
