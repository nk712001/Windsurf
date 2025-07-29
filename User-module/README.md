# User Management System

## Overview
A full-stack user management application with modern best practices for API, frontend, backend, CI/CD, observability, and documentation.

## Architecture
- **Frontend:** React + Ant Design + Styled Components (TypeScript)
- **Backend:** Node.js + Express + TypeORM (TypeScript)
- **Database:** PostgreSQL
- **Infrastructure:** IaC (Terraform/Pulumi), Docker

### Diagram
```
[User] -> [React Frontend] -> [Express API] -> [PostgreSQL]
                             ^
                             |
                        [Prometheus, Grafana, OTEL]
```

## API Documentation
- OpenAPI/Swagger docs are available at `/api-docs` when running the backend.
- API spec is versioned in `backend/swagger.json`.
- Update docs with every API change and review as part of PRs.

## Operational Procedures
- See `infrastructure/README.md` for provisioning, deployment, and compliance.
- Use CI/CD pipeline for all deployments (see `.github/workflows/ci-cd.yml`).
- All monitoring and alerting is handled via Prometheus/Grafana (see observability epic).

## Onboarding
- Clone the repo and follow the setup in `frontend/README.md` and `backend/README.md` (add if missing).
- For architecture or troubleshooting, refer to this document and the `docs/` folder.

---

For any changes, update this README and associated documentation to keep knowledge up to date.
