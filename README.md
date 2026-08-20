# NyayaConnect: Intelligent Law & Justice Management Platform

NyayaConnect is a comprehensive digital justice workflow platform designed to bridge fragmented court systems. It streamlines interactions between citizens, law enforcement, legal professionals, and the judiciary through a secure microservices architecture, featuring AI-driven legal intelligence and tamper-proof digital evidence management.

## 🚀 Key Features

### 🏛️ Digital Justice Infrastructure

- **Role-Based Access Control (RBAC):** Tailored dashboards and permissions for **Citizens, Police, Lawyers, Judges, and Admins**.
- **Secure Evidence Vault:** SHA-256 hashed evidence storage to ensure data integrity and prevent tampering.
- **Case Lifecycle Management:** End-to-end tracking from initial complaint filing to final judicial verdict.
- **Audit Logging:** Transparent tracking of all critical system actions for institutional accountability.

### 🧠 AI-Powered Intelligence (NyayaAI)

- **Automated Categorization:** AI analyzes complaint narratives to classify cases (Criminal, Civil, Family, etc.).
- **Urgency Scoring:** Dynamic 1-10 priority scoring based on the severity of the incident.
- **Legal Insights:** Suggestions for relevant **IPC (Indian Penal Code)** or **BNS (Bharatiya Nyaya Sanhita)** sections.
- **Case Summarization:** AI-generated executive summaries for Judges to quickly review complex case descriptions.

### 🎨 Modern User Experience

- **Interactive Landing Page:** A professional, glassmorphism-inspired entry point for all users.
- **Persistent Sessions:** Secure JWT-based authentication with 30-day persistence.
- **Real-time Case Tracking:** Visual timelines for citizens to monitor their case progress.
- **Unified Official Gateway:** Specialized portals for law enforcement and judicial officers.

## 🏗️ Architecture

The platform follows a modular microservices approach for maximum scalability:

1.  **Core Backend (`/backend`):** Node.js/Express hub managing authentication, RBAC, and case orchestration.
2.  **AI Service (`/ai-service`):** Python/Flask intelligence layer utilizing the **meta/llama-3.1-405b-instruct** model via NVIDIA API.
3.  **Evidence Service (`/evidence-service`):** Dedicated Node.js service for secure file handling and cryptographic hashing.
4.  **Frontend (`/frontend`):** Modern React 19 application built with Vite and Tailwind CSS.

## 🛠️ Technology Stack

| Component      | Technologies                                         |
| :------------- | :--------------------------------------------------- |
| **Frontend**   | React 19, Vite, Tailwind CSS v4, Lucide React, Axios |
| **Backend**    | Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt    |
| **AI Service** | Python 3, Flask, OpenAI SDK, python-dotenv           |
| **Evidence**   | Node.js, Multer, Crypto-js                           |
| **Database**   | MongoDB                                              |

## 👥 User Roles & Workflow

- **Citizen:** Files digital complaints, uploads initial evidence, and tracks real-time status.
- **Police:** Manages investigations, records official diary entries, and uploads verified evidence.
- **Lawyer:** Reviews case details and submits legal arguments for the defense or prosecution.
- **Judge:** Reviews AI-summarized cases, examines evidence, and issues final digital verdicts.
- **Admin:** Verifies official credentials (badges/bar IDs) and assigns personnel to active cases.

# 🔌 NyayaConnect API Documentation

Base URL:

```text
http://localhost:5000
```

Protected routes require:

```http
Authorization: Bearer <JWT_TOKEN>
```

JWT tokens expire after **30 days**.

---

## 🔐 Authentication

| Method | Endpoint                  | Access | Description                     |
| ------ | ------------------------- | ------ | ------------------------------- |
| `POST` | `/auth/register/citizen`  | Public | Register citizen & generate OTP |
| `POST` | `/auth/register/official` | Public | Register Police/Lawyer/Judge    |
| `POST` | `/auth/resend-otp`        | Public | Resend OTP                      |
| `POST` | `/auth/reset-password`    | Public | Reset password                  |
| `POST` | `/auth/login`             | Public | Unified login with JWT/OTP      |

---

## ⚖️ Case Management

| Method | Endpoint            | Access             | Description             |
| ------ | ------------------- | ------------------ | ----------------------- |
| `POST` | `/cases/create`     | Citizen/Admin      | Create a new case       |
| `GET`  | `/cases/my`         | Authenticated      | Get role-specific cases |
| `GET`  | `/cases/:id`        | Authenticated      | Get case details        |
| `PUT`  | `/cases/status/:id` | Police/Judge/Admin | Update case status      |
| `PUT`  | `/cases/assign/:id` | Admin              | Assign officials        |

---

## 🧠 NyayaAI

| Method | Endpoint               | Description                              |
| ------ | ---------------------- | ---------------------------------------- |
| `POST` | `/ai/analyzeComplaint` | Categorize complaint & calculate urgency |
| `POST` | `/ai/summarizeCase`    | Generate case summary                    |
| `POST` | `/ai/legalInsight`     | Generate legal insights                  |

Example:

```json
{
  "complaint_text": "The accused threatened the complainant."
}
```

---

## 🔐 Evidence

| Method | Endpoint            | Access                      | Description            |
| ------ | ------------------- | --------------------------- | ---------------------- |
| `POST` | `/evidence/upload`  | Citizen/Police/Lawyer/Admin | Upload & hash evidence |
| `GET`  | `/evidence/:caseId` | Authenticated               | Get case evidence      |

Upload uses:

```text
multipart/form-data
file=<file>
caseId=<case_id>
```

Evidence is processed by the dedicated Evidence Service and stored with a cryptographic hash.

---

## 👮 Police Investigation

| Method | Endpoint                           | Description                   |
| ------ | ---------------------------------- | ----------------------------- |
| `POST` | `/police/:id/diary`                | Add investigation diary entry |
| `POST` | `/police/:id/suspects`             | Add suspect                   |
| `PUT`  | `/police/:id/evidence/:evidenceId` | Mark evidence relevance       |
| `PUT`  | `/police/:id/status`               | Update investigation status   |

Allowed investigation statuses:

```text
INVESTIGATING
REPORT_SUBMITTED
```

Only the assigned Police Officer can modify the investigation.

---

## 👑 Admin

| Method | Endpoint                    | Description                    |
| ------ | --------------------------- | ------------------------------ |
| `POST` | `/admin/users/create-judge` | Create Judge account           |
| `GET`  | `/admin/users`              | Manage users                   |
| `PUT`  | `/admin/users/status/:id`   | Approve/Suspend user           |
| `PUT`  | `/admin/verifyCase/:id`     | Approve/Reject case            |
| `GET`  | `/admin/report/:id`         | Download case PDF              |
| `PUT`  | `/admin/assign/:id`         | Assign Police/Judge/Prosecutor |
| `GET`  | `/admin/workload`           | Monitor official workload      |
| `PUT`  | `/admin/autoAssign/:id`     | AI-assisted auto assignment    |
| `PUT`  | `/admin/aiOverride/:id`     | Override AI classification     |
| `GET`  | `/admin/logs`               | View audit logs                |

---

## 🛡️ Authorization

NyayaConnect uses **JWT authentication + Role-Based Access Control (RBAC)**.

Supported roles:

```text
CITIZEN
POLICE
LAWYER
JUDGE
ADMIN
```

Critical operations are recorded through the audit logging system.

---

## 🔄 Case Flow

```text
Citizen
   ↓
PENDING_VERIFICATION
   ↓
Admin Verification
   ↓
REGISTERED
   ↓
ASSIGNED
   ↓
INVESTIGATING
   ↓
REPORT_SUBMITTED
   ↓
TRIAL
   ↓
Final Verdict
```

---

## 🏗️ Microservices

```text
React Frontend
      ↓
Node.js / Express API
      ├── MongoDB
      ├── NyayaAI Service
      └── Evidence Service
```

### Internal Services

```text
AI Service
POST /predict-category
POST /summarize
POST /get-legal-insight

Evidence Service
POST /upload
```

---

> **Note:** Exact production URLs and router prefixes depend on the `app.use()` configuration in `server.js`.



## 🔗 Links

| Resource                    | Link                                                                |
| :-------------------------- | :------------------------------------------------------------------ |
| **Recruitment / Live Site** | [Click Here to View Live Demo 🚀](https://nyayaconnect.vercel.app/) |
| **Source Code**             | [View on GitHub 📂](https://github.com/kodo-kaze/nyayaconnect)      |
| **Demo Video**              | [Watch on YouTube 📺](https://youtu.be/l6-UArXPgnU)                 |

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18+) & **npm**
- **Python 3.x** & `pip`
- **MongoDB** (Local instance or Atlas URI)
- **NVIDIA AI API Key** (For NyayaAI features)

### Quick Start (All Services)

```bash
chmod +x run_all.sh
./run_all.sh
```

### Manual Service Setup

#### 1. Core Backend

```bash
cd backend
npm install
npm run dev # Runs on Port 5000
```

#### 2. AI Service

```bash
cd ai-service
pip install -r requirements.txt
# Ensure NVIDIA_API_KEY is in .env
python app.py # Runs on Port 8000
```

#### 3. Evidence Service

```bash
cd evidence-service
npm install
node index.js # Runs on Port 9000
```

#### 4. Frontend

```bash
cd frontend
npm install
npm run dev # Runs on Port 5173
```

## 🔐 Environment Configuration

Ensure you create `.env` files in the respective service directories.

**Backend (`/backend/.env`):**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nyayaconnect
JWT_SECRET=your_jwt_secret_here
AI_SERVICE_URL=http://localhost:8000
EVIDENCE_SERVICE_URL=http://localhost:9000
```

**AI Service (`/ai-service/.env`):**

```env
PORT=8000
NVIDIA_API_KEY=your_nvidia_api_key_here
```

---

_NyayaConnect — Bridging Fragmented Court Systems with Intelligent Infrastructure._
