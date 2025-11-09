# Cruise0-App Modernization (React & Auth0)

This project demonstrates a modern Single-Page Application (SPA) built with React integrated with Auth0 Universal Login and several advanced security features. It serves as a proof-of-concept for modernizing user authentication and securing a backend API.

## Core Features

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
## Cloudfront URL to access the Cruis0 Application - 

https://dss3jdxg4usbj.cloudfront.net

## 🖥️ Architecture (Mermaid Diagram)

```
flowchart TD
  A[React SPA<br/>(CloudFront / localhost)]
  B[Auth0 PKCE + OIDC]
  C[Auth0 Universal Login]
  D[ID Token + Access Token]
  E[Backend API<br/>(Local Express or AWS Lambda)]
  F[jwtVerify via Auth0 JWKS (RS256)]
  G[Protected Data → UI]

  A --> B
  B --> C
  C --> D
  D --> E
  E --> F
  F --> G

---

