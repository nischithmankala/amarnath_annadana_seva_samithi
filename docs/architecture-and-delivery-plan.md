# Amarnath Annadana Seva Samithi - Architecture and Delivery Plan

## 1. Architecture Decision Record (ADR)
- **Monorepo Layout**: pnpm workspace
  - `apps/web`: React + Vite + TypeScript + Tailwind
  - `apps/api`: Node.js + Express + TypeScript + Prisma
  - `packages/contracts`: Shared Zod schemas, DTOs, Enums
  - `packages/config`: ESLint, Prettier, TypeScript configs
  - `packages/ui`: Shared React components
- **Deployment Boundaries**: Separate deployments for Web (static/CDN) and API (Node container). PostgreSQL database. Docker Compose for local dev.
- **Database**: PostgreSQL (via Prisma ORM).
- **Provider Abstractions**:
  - `PaymentGateway`: Interfaces for mocking local and real payment webhooks.
  - `NotificationService`: Interfaces for SMS/Email with a local stub provider.
  - `MediaStorage`: S3-compatible interface (local disk implementation for dev).
- **Authentication/Session Design**: OTP verification via `NotificationService`. Issues a JWT containing roles and scopes. API enforces via RBAC middleware.
- **File Storage**: S3 interface. Publicly readable for approved media, protected for private documents.
- **Payment Webhooks**: Source of truth for transactions. Idempotent webhook handlers.
- **Audit Logging**: Immutable `AuditLog` table for sensitive actions.

## 2. Dependency Map
1. **Foundation**: `packages/config`, `packages/contracts`, initial `apps/api` and `apps/web`.
2. **Database & Auth**: Prisma schema, OTP flows, JWT issuing.
3. **Content/Media**: Media storage abstractions, events, board publishing.
4. **Payments**: Webhooks, receipts.
5. **Memberships**: Dependent on Auth & Payments.
6. **Reporting & Observability**: Dependent on all domains.

## 3. Role/Permission Matrix
- **Public Visitor**: View public pages, donate, volunteer, sponsor. View public directory (limited fields).
- **Member**: Access Member Portal, view ID card, search full directory (consented fields), manage profile.
- **Admin**: Review assigned records (memberships, volunteers, media). Restricted by assignment scope. Cannot modify system settings or unassigned data.
- **Super Admin**: Full access. Manage users, Admins, role assignments, system settings, full reporting, and payment configs.

## 4. Public-Data Classification Policy
- **Public**: Member photo, name, city (only if consented). Published events, galleries, and board members.
- **Authenticated Directory**: Additional fields based strictly on per-field consent by the member.
- **Private**: Phone numbers, exact payment details, unconsented profile data, ID documents.

## 5. Prioritized Release Plan
- **MVP**: Auth, Member Portal, basic directory, public content, donations. English initially (with i18n structure for Telugu/Hindi).
- **Operational Release**: Admin portals, volunteer workflows, event management.
- **Later Enhancements**: Advanced reporting, multi-language translation rollout, export features.

## 6. External Decisions Needed
- Payment gateway provider (e.g., Razorpay, Stripe)
- SMS/Email provider (e.g., AWS SNS, Twilio, SendGrid)
- Hosting platform for production (e.g., AWS, Vercel, Railway)
- Legal receipt/PAN rules for tax compliance
- Privacy retention policy
- Branding assets (fonts, high-res logos)
- Final Admin role permission breakdown
