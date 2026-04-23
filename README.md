# Rick Travel

Rick Travel is a tourism web platform focused on presenting travel experiences and supporting a modern booking flow for public users.

This project is being developed as a real-world MVP with a strong delivery and validation process, using a structured execution framework called **Protocolo Rick**.

## Project Status

**Current stage:** MVP publicly deployed and under active stabilization.

Current focus:
- public experience
- tours catalog
- booking core
- authentication base
- deployment hardening
- technical cleanup after first deployment

Temporarily out of scope for this public MVP stage:
- admin module
- Mercado Pago integration
- E2E pipeline in deployment flow

## Goals

The project aims to provide:
- a public travel and tours experience
- multilingual content support
- a booking-oriented user flow
- a scalable base for future operational and payment features

## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Prisma**
- **PostgreSQL**
- **Vercel**

## Main Features

### Public MVP
- public pages for travel experiences
- multilingual routing structure
- tour listing and presentation
- core booking flow
- sitemap generation
- deployment on Vercel

### In Progress / Planned
- stronger runtime validation
- admin redesign and reintroduction
- payment integration reactivation
- technical cleanup and architecture hardening
- broader automated validation coverage

## Development Approach

This project follows a disciplined execution model with emphasis on:
- evidence-based delivery
- minimal, reversible changes
- scope control
- validation before claiming completion
- separation between active MVP scope and deferred modules

That means the repository may contain modules that are intentionally frozen or temporarily excluded from the active deployment scope while the public MVP is stabilized.

## Deployment Notes

The project is currently deployed on Vercel.

The first public deployment focused on getting the **public MVP** online while isolating unstable or incomplete modules that should not block delivery.

## Repository Philosophy

This is not just a demo repository.  
It is being treated as a real product foundation.

The strategy is:
1. deploy the public core
2. validate the runtime
3. stabilize the technical base
4. reintroduce frozen modules with better quality standards

## Roadmap

### Short Term
- stabilize public runtime
- improve environment handling
- clean up remaining warnings
- validate booking flows more deeply

### Mid Term
- redesign and re-enable admin
- re-enable payment integration
- improve data and operational flows

### Long Term
- evolve into a more complete travel operations platform
- strengthen observability, testing, and maintainability
- improve business-facing workflows

## Local Development

Clone the repository and install dependencies:

```bash
npm install
Run Prisma generation:

npx prisma generate

Run the development server:

npm run dev

Build locally:

npm run build

Type check:

npm run typecheck

Lint:

npm run lint
Environment Variables

The project uses environment variables for runtime services such as:

database connection
authentication
email provider
deployment-specific configuration

A local .env is required for full runtime behavior.

Important Note

Some modules may exist in the repository but may not be part of the active public deployment scope at a given moment.
This is intentional and follows the current MVP stabilization strategy.

Author

Built by Ricardo Souza as part of a real-world product and portfolio journey focused on shipping structured, maintainable digital products.
