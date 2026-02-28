<!--
Sync Impact Report
===================
Version change: N/A → 1.0.0 (initial ratification)
Modified principles: N/A (first version)
Added sections:
  - Core Principles (5): Simplicity First, Test-Driven Development,
    Type Safety, Offline-First, Progressive Web App
  - Technology Constraints
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no updates needed
    (Constitution Check section is dynamically filled)
  - .specify/templates/spec-template.md — ✅ no updates needed
    (generic template, no constitution-specific references)
  - .specify/templates/tasks-template.md — ✅ no updates needed
    (generic template, no constitution-specific references)
Follow-up TODOs: none
-->

# Concentration Constitution

## Core Principles

### I. Simplicity First

Every design decision MUST favor the simplest viable approach.

- YAGNI: features and abstractions MUST NOT be added until a concrete
  need is demonstrated in the current scope.
- No premature abstractions: three similar lines of code are preferred
  over a generalized helper until a clear pattern emerges across three
  or more call sites.
- Dependencies MUST be justified: each new runtime dependency requires
  a brief rationale (size, maintenance status, alternatives rejected).
- Rationale: a card-matching game is inherently simple; the codebase
  MUST reflect that simplicity to stay maintainable by a solo
  developer or small team.

### II. Test-Driven Development (NON-NEGOTIABLE)

All feature code MUST follow the Red-Green-Refactor cycle.

- Tests MUST be written and approved before implementation begins.
- Tests MUST fail (Red) before any production code is written.
- Implementation MUST make failing tests pass (Green) with the
  minimum code required.
- Refactoring MUST only occur after all tests pass and MUST NOT
  change observable behavior.
- Untested code MUST NOT be merged into the main branch.
- Rationale: TDD prevents regressions and ensures every behavior is
  captured as a living specification.

### III. Type Safety

TypeScript strict mode MUST be enabled; no escape hatches allowed.

- `strict: true` in `tsconfig.json` is mandatory and MUST NOT be
  weakened per-file or per-line.
- `any` type MUST NOT appear in production code. Use `unknown` with
  type narrowing when the type is genuinely uncertain.
- All public function signatures MUST have explicit return types.
- Third-party libraries without type definitions MUST have a
  corresponding `.d.ts` declaration file before use.
- Rationale: strict typing catches an entire class of runtime errors
  at compile time, which is critical for a game where state
  transitions must be predictable.

### IV. Offline-First

Core gameplay MUST function without any network connectivity.

- All game logic, state management, and asset loading MUST work
  entirely client-side after the initial load.
- Persistent data (scores, settings, progress) MUST be stored in
  browser-local storage (IndexedDB or localStorage).
- Network requests are permitted only for optional features
  (e.g., leaderboards, analytics) and MUST degrade gracefully
  when offline.
- Rationale: a card game should be playable anywhere — on a plane,
  in a tunnel, or on a spotty connection.

### V. Progressive Web App

The application MUST be installable as a PWA on mobile and desktop.

- A valid Web App Manifest MUST be present with appropriate icons,
  theme color, and display mode (`standalone`).
- A service worker MUST cache all critical assets for offline use
  on first visit.
- The app MUST score 90+ on Lighthouse PWA audit.
- MUST be responsive: playable on viewports from 320px to 2560px
  wide.
- Rationale: PWA distribution removes app-store friction and
  aligns with the Offline-First principle.

## Technology Constraints

- **Language**: TypeScript (strict mode, ES2022+ target)
- **Framework**: React 18+ with functional components and hooks only;
  class components MUST NOT be used.
- **Build tool**: Vite (or equivalent zero-config bundler).
- **Styling**: CSS Modules or a utility-first CSS framework (e.g.,
  Tailwind). No CSS-in-JS runtime libraries.
- **State management**: React built-in state (`useState`,
  `useReducer`, `useContext`) MUST be tried first. External state
  libraries require justification per Principle I.
- **Testing**: Vitest for unit/integration tests; Playwright or
  Cypress for end-to-end tests if needed.
- **Package manager**: npm or pnpm (lock file MUST be committed).
- **Node version**: LTS (>=20).

## Development Workflow

- **Branching**: feature branches off `main`; merge via pull request.
- **Commits**: conventional commits format
  (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).
- **Quality gates before merge**:
  1. All tests pass (`npm test`).
  2. TypeScript compiles with zero errors (`tsc --noEmit`).
  3. Linter passes with zero warnings (`eslint`).
  4. Lighthouse PWA score >= 90 (checked on release branches).
- **Code review**: at least one review (self-review acceptable for
  solo development) with constitution compliance verified.

## Governance

This constitution is the highest-authority document for the
Concentration project. All implementation decisions, code reviews,
and architectural choices MUST comply with the principles above.

- **Amendments** require: (1) a written proposal describing the
  change and rationale, (2) an update to this file with version
  bump, and (3) a review of all dependent templates for consistency.
- **Versioning**: this constitution follows semantic versioning —
  MAJOR for principle removals/redefinitions, MINOR for new
  principles or material expansions, PATCH for clarifications.
- **Compliance review**: every pull request MUST include a brief
  constitution compliance note (can be a single line confirming
  no violations).
- **Conflict resolution**: when a principle conflicts with another,
  Simplicity First (Principle I) takes precedence unless safety or
  correctness is at stake.

**Version**: 1.0.0 | **Ratified**: 2026-02-28 | **Last Amended**: 2026-02-28
