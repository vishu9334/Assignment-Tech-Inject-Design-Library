# Section 10: Required Written Answers

### 1. Reference Analysis
**How did you identify reusable components, variants and shared theme tokens? Explain one boundary you chose and how you verified the recreation against the reference.**

By inspecting the live DOM and computed styles of the [Sales CRM Reference](https://sales-crm-kargulstudio.vercel.app/), I extracted reusable theme tokens for dark canvas surfaces (`#0A0A0A`, `#121212`), high-contrast text (`#FFFFFF`, `#D4D4D4`), tactile pill bevels (`shadow-[0px_0px_0px_1px_rgba(0,0,0,0.5),inset_0px_1px_0px_0px_rgba(255,255,255,0.1)]`), and status indicators (`#16C89E` Won/Active, `#FFDB4B` Lead, `#9668FE` Negotiation, `#FE4A8E` Lost). For component boundaries, I separated generic interactive primitives (such as the tactile `Button` and `StatusBadge`) from domain-specific composite blocks like `DealsTable` and `MetricCard`, choosing to represent split dropdowns as a dedicated `FilterPill` variant rather than building an ad-hoc toolbar button. I verified the visual recreation through side-by-side browser rendering, matching pixel paddings, border radii, hover scale micro-interactions, and disabled states directly against the reference.

---

### 2. Architecture and Clean Code
**Why did you choose this stack and separation of responsibilities? Show one practical SOLID/DRY decision and one abstraction or feature you avoided under KISS/YAGNI.**

I chose a Next.js + TypeScript monorepo with PostgreSQL and Prisma ORM to maintain strict end-to-end typing while separating the reusable component library (`packages/ui`), database contracts (`packages/database`), public discovery (`apps/catalogue`), and back-office management (`apps/admin`). Adhering to the Single Responsibility and Interface Segregation principles (SOLID), all database operations are governed by repository contracts (`IComponentContract`, `IUserContract`) implemented in `packages/database/src/data/implimentations`, isolating database access from business services and Next.js routes. Under KISS and YAGNI, I deliberately avoided adding complex billing SDKs (like Stripe or Razorpay) and generalized role-permission matrices, instead implementing a direct, server-verified admin access model and a binary customer access tier (`isPremium: boolean`) as prescribed by the requirements.

---

### 3. Publishing Consistency
**How do preview, copied code, installation and agent instructions stay on the same published version? What happens when an update fails or a component is unpublished?**

The database serves as the single source of truth: the component entity stores the definitive version string, raw source code, usage example, and AI prompt in unified columns. The public preview, code tab, `npx` installer endpoint (`/api/install/:slug`), and agent prompt dynamically pull from this identical database record, eliminating divergent copies. When a component update fails validation in the admin dashboard, database transactions reject the write, leaving the active published version intact. When a component is unpublished, its status transitions to `DRAFT`, which instantly excludes it from public catalogue queries and returns an HTTP 404 on both detail pages and CLI install requests.

---

### 4. Security
**What could go wrong when previewing uploaded code, calling admin APIs or installing files into another project? Which protections did you implement and test, and what limitations remain?**

Risks include remote code execution (RCE) via untrusted component uploads, unauthorized admin mutations, and arbitrary file-system overwrites during CLI execution. To prevent RCE, uploaded components are stored as inert text bundles validated with strict JSON schemas and are never executed directly on the server. Admin APIs enforce server-verified JWT signatures against `ADMIN_SECRET`, rejecting customer privilege escalation. For the CLI, path-traversal safeguards (`path.relative(cwd, destDir)`) block attempts to write files outside the consumer project, and the installer requires `--force` before replacing existing files. A remaining limitation is that browser preview rendering of newly uploaded raw JSX strings in runtime environments requires iframe sandboxing or ahead-of-time compilation.

---

### 5. AI Ownership
**Which AI suggestion or assumption did you challenge, and what evidence supported your conclusion? Show how you checked that copied code, the install command and the agent prompt actually worked in consumer projects—not just inside the catalogue.**

When initially scaffolding the authentication architecture, the AI suggested embedding `isPremium` solely within the JWT token payload and trusting token expiration. I challenged this assumption because client-side JWT claims fail the core requirement: revoking a customer's premium access must take effect immediately on subsequent requests even if their session token remains unexpired. I implemented real-time database verification in `authService.authenticateRequest`, ensuring that every protected preview and CLI download validates the live customer record. I verified the CLI installer by running `node packages/cli/bin/index.js add button` in a clean consumer directory, confirming the component file was safely created with intact imports and zero broken local dependencies.

---

### 6. Production Ownership
**What checks convinced you the deployed project was ready? If a newly published component breaks after release, what would you inspect first, how would you restore service without losing data, and what would you communicate to the team?**

The project was validated by automated integration tests verifying draft isolation, admin role authorization, and real-time premium revocation against a live Render PostgreSQL database, followed by successful Next.js production builds. If a newly published component causes client runtime errors post-release, I would immediately inspect the server audit logs and Sentry/Render error traces to isolate the component slug. I would instantly revert the broken component to `DRAFT` status via the Admin Dashboard (`/api/admin/components/:id/publish`), which hides it from the public catalogue and CLI within milliseconds without requiring database rollbacks or code redeployments. I would notify the team with the error signature, affected customer impact, and a scheduled patch release once local verification passes.

---

### 7. Premium Access
**How did you model account access separately from component publication and admin permissions? Show how a free or revoked customer is blocked from premium code through previews, direct URLs, CLI and agent integration, and explain what revocation cannot undo.**

Account access (`Role: ADMIN | CUSTOMER`, `isPremium: boolean`) and component state (`AccessLevel: FREE | PREMIUM`, `Status: DRAFT | PUBLISHED`) are modeled as distinct, decoupled attributes in PostgreSQL. When an unauthenticated visitor or free customer requests a premium component, the backend masks sensitive fields (`code: null`, `agentPrompt: null`), returning `isLocked: true` alongside a static snapshot placeholder. Direct calls to `/api/install/:slug` without an active premium token immediately return an HTTP 403 Forbidden. While real-time revocation stops all subsequent downloads, preview access, and CLI installations, it cannot erase source code or files that an authorized developer already downloaded onto their local machine prior to revocation.
