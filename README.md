# Tech Inject Design Library · Sales CRM Component Standard

A production-ready Next.js / React + TypeScript component library and platform, featuring a **Public Component Catalogue** (Astryx-style UX), an **Admin Publishing & Access Management Dashboard**, a persistent **PostgreSQL (Prisma) backend** following the Clean Contract/Repository architecture, a working **NPX CLI installer**, and automated security tests.

---

## 🌟 Architecture Overview

The repository is organized as a unified monorepo:

```
├── apps/
│   ├── catalogue/          # Public Catalogue Web App (Next.js 14 App Router, Astryx UX)
│   │   ├── src/app/        # Catalogue pages (/ & /components/[slug]) & Public API
│   │   └── src/context/    # AuthContext with quick test account switcher
│   └── admin/              # Admin Dashboard Web App (Next.js 14 App Router)
│       ├── src/app/        # Admin management pages & server-verified Admin API
│       └── src/context/    # AdminAuthProvider
├── packages/
│   ├── ui/                 # Reusable React + TypeScript Sales CRM Component Library
│   │   ├── src/components/ # Button, StatusBadge, MetricCard, DealsTable, FilterPill, etc.
│   │   └── src/styles/     # Sales CRM design tokens (colors, surface highlights, bevels)
│   ├── database/           # Prisma ORM + Clean Layered Architecture
│   │   ├── prisma/         # schema.prisma, migrations, and seed.ts
│   │   ├── src/data/       # Contracts (IUser, IComponent) & Implementations (Postgres)
│   │   ├── src/services/   # UserService, ComponentService, AuthService
│   │   └── src/utils/      # Token, ApiResponse, and ApiError helpers
│   └── cli/                # NPX Component Installer CLI (npx tech-inject-ui)
│       └── bin/index.js    # Path traversal protection, overwrite safety, auth checking
├── tests/                  # Automated integration and security test suite
├── answers.md              # Mandatory written answers for Section 10
└── README.md
```

---

## 🚀 Live Demo & Deployment Setup

### Environment Variables (.env.example)

```env
# Database connection string (PostgreSQL on Render / Supabase / Neon)
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# JWT Secret for customer token issuance and verification
JWT_SECRET="your-jwt-secret-key"

# Server Administrator Secret
ADMIN_SECRET="tech-inject-admin-secure-key-2026"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Pre-Configured Test Accounts (Seeded in Live Database)

| Account Type | Email | Password | Role | Default Access |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@techinject.io` | `Admin@12345` | `ADMIN` | Full System Privileges |
| **Free Customer** | `free@techinject.io` | `User@12345` | `CUSTOMER` | Free Components Only |
| **Premium Customer** | `premium@techinject.io` | `Premium@12345` | `CUSTOMER` | Full Access to All Components |

> *Tip: Reviewers can use the **"Reviewer Quick-Switch"** buttons in the top navbar of the Catalogue app to instantly toggle between Free and Premium customer views with 1 click.*

---

## 🛠️ Local Development & Build Commands

### 1. Install Dependencies
```bash
npm install
npm --workspace=packages/database run push
npm --workspace=packages/database run seed
```

### 2. Run Applications Locally
```bash
# Terminal 1: Run Public Component Catalogue (Port 3000)
npm run dev:catalogue

# Terminal 2: Run Admin Dashboard (Port 3001)
npm run dev:admin
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build Production Bundles
```bash
npm run build:catalogue
npm run build:admin
```

---

## 📦 NPX Component Installer

Developers can install components into any separate React / Next.js project with a single command:

```bash
# Install a Free component:
npx tech-inject-ui add button

# Install a Premium component (enforces token authentication):
npx tech-inject-ui add deals-table --token <YOUR_AUTH_TOKEN>

# Overwrite existing files if needed:
npx tech-inject-ui add status-badge --force
```

### Security Safeguards Built into the CLI:
* **Path Traversal Protection**: Enforces `path.relative(cwd, targetDir)` to strictly prevent writes outside the target consumer project.
* **Overwrite Warning**: Halts execution if a file exists unless `--force` is supplied.
* **Authentication Guard**: Intercepts requests for premium components and immediately aborts if unauthenticated or revoked.

---

## 🧪 Automated Access Control & Security Tests

Run the test suite with:
```bash
node tests/run-tests.js
```

### Test Suite Execution Output:
```text
==================================================
🚀 Running Tech Inject Automated Security Tests
==================================================

▶ Suite: Security, Access Enforcement & Clean Architecture Checks
  ✔ 1. Draft Isolation: Drafts must stay private and never be listed publicly
  ✔ 2. Admin Write Protection: Token verification distinguishes admin vs customer
  ✔ 3. Premium Access Logic: Free user vs Premium user permissions
  ✔ 4. Real-Time Revocation: Database status takes precedence over token payload
  ✔ 5. CLI Security: Path Traversal Interception
✔ Suite: Security, Access Enforcement & Clean Architecture Checks
ℹ pass 6
ℹ fail 0
✅ All automated security and access control tests PASSED!
```

---

## 🛡️ Release Checks & Recovery Plan

1. **Diagnosis**: If a deployed component causes runtime issues, inspect server logs via Render or Vercel runtime telemetry to identify the component slug.
2. **Instant Isolation**: An administrator can unpublish the broken component in 1 click from the Admin Dashboard. The component instantly drops to `DRAFT` status, removing it from public listings and the CLI installer within milliseconds—without needing a code redeploy or database migration.
3. **Data Protection**: PostgreSQL schemas are managed via Prisma migrations with relational integrity; customer accounts and component definitions are preserved safely.

---

## 🤖 AI Usage & Verification Record

* **AI Coding Partner**: Google Antigravity (Gemini 3.8 Flash)
* **Representative Prompt**: 
  > *"Build a reusable Next.js/React + TypeScript component library with two separately runnable web apps, matching the Sales CRM reference tokens and contracts pattern."*
* **Challenged Assumption & Verification**:
  * The initial recommendation was to store `isPremium: true` in the customer's signed JWT token and verify access purely via token payload.
  * **Challenge**: JWTs are stateless; if an administrator revokes a customer's premium tier in the Admin Dashboard, the customer would continue having access until the JWT expires hours or days later.
  * **Correction**: Implemented live database queries in `authService.authenticateRequest` for every protected request, ensuring revocation takes effect immediately in real time. Verified via automated test `4. Real-Time Revocation`.
