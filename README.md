# Cruise0-App Modernization (React & Auth0)

This project demonstrates a modern Single-Page Application (SPA) built with React integrated with Auth0 Universal Login and several advanced security features. It serves as a proof-of-concept for modernizing user authentication and securing a backend API.

Core Features - 

- Universal Login
- Email verification enforcement
- Conditional MFA (database users only)
- Social login with Google (no MFA required)
- IP-based country tagging (added to user_metadata)
- Secure API calls with RS256 JWT validation


---

## Features

| Feature | Description |
|--------|-------------|
| **Auth0 Universal Login (Custom Branding)** | Cruise theme, welcome messaging, logo & background |
| **Disposable Email Block** | Pre-User Registration Action checks email using Disify |
| **Email Verification Required** | User cannot log in until verified |
| **Conditional MFA** | MFA enforced only for non-social (database) users |
| **Country Auto-Enrichment** | On login, IP → `user_metadata.country` |
| **React SPA** | Auth0 React SDK + Access Token (Bearer) API calls |
| **Protected Node API** | JWT validation + checks `email_verified === true` |

---

## 🖥️ Architecture

React SPA (CloudFront / localhost)
│ (Auth0 PKCE + OIDC)
▼
Auth0 Universal Login
│
│ (ID Token + Access Token)
▼
Backend API (Local Express or AWS Lambda)
│
(jwtVerify via Auth0 JWKS, RS256)
│
Protected Data → UI


---

## 🚀 Quick Start — Local Run

### 1) Backend (Protected API)
```powershell
cd backend
npm install
npm run dev

API now live:
http://localhost:4000/protected  

2) Frontend (React App)
cd frontend
cp .env.example .env.local
# Fill ONLY VITE_AUTH0_CLIENT_ID
npm install
npm run dev

UI now live:
http://localhost:5173

Deploy to AWS
Backend → AWS Lambda + API Gateway

Copy the output API URL, then update:

frontend/.env.local:
VITE_API_BASE_URL=<YOUR_API_URL>

Frontend → S3 + CloudFront

App is now globally available

Auth0 Configuration Checklist

| Setting       | Value                               |
| ------------- | ----------------------------------- |
| Domain        | `dev-oo2oo6jk421zx72b.us.auth0.com` |
| SPA Client ID | `BXHDNDjk2kuKkIkxf84OWcDoXCgdAKql`  |
| API Audience  | `https://api.cruise0`               |
| Algorithm     | RS256                               |

Allowed URLs

| Field                 | URLs to Add                              |
| --------------------- | ---------------------------------------- |
| Allowed Callback URLs | `http://localhost:5173` + CloudFront URL |
| Allowed Logout URLs   | `http://localhost:5173` + CloudFront URL |
| Allowed Web Origins   | `http://localhost:5173` + CloudFront URL |

Auth0 Actions Used

| Action                    | Logic                                          |
| ------------------------- | ---------------------------------------------- |
| **Pre-User Registration** | Reject disposable emails                       |
| **Post-Login**            | Require email verification                     |
|                           | Enforce MFA for non-social users               |
|                           | Add `country` to `user_metadata` via IP lookup |


Feature Checks

Login with Google → No MFA
Login with email/password → MFA required
Try login before verifying email → Login blocked
Check user profile in Auth0 → country auto-populated
Call protected API → Response only when email_verified = true
