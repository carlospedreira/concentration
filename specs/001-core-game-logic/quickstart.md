# Quickstart: Core Game Logic

**Feature Branch**: `001-core-game-logic`

## Prerequisites

- Node.js >= 20 (LTS)
- npm

## Project Setup

```bash
# Scaffold from Vite template
npm create vite@latest concentration -- --template react-ts
cd concentration

# Install dev dependencies
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
npm install -D vite-plugin-pwa
npm install -D tailwindcss @tailwindcss/vite

# Verify setup
npm run dev     # Dev server at localhost:5173
npm test        # Run Vitest in watch mode
```

## Project Structure

```
src/
├── reducers/
│   └── game-reducer.ts        # Pure game state machine (reducer + actions)
├── hooks/
│   └── use-game-state.ts      # React hook wrapping useReducer
├── components/
│   ├── setup-screen.tsx        # Board config form
│   ├── game-board.tsx          # Card grid layout
│   ├── card.tsx                # Single card (flip animation)
│   ├── move-counter.tsx        # Move count display
│   └── completion-screen.tsx   # Game over / play again
├── utils/
│   ├── board.ts                # Board generation + shuffle
│   ├── validation.ts           # BoardConfig validation
│   └── symbols.ts              # Unicode symbol pool constant
├── types/
│   └── game.ts                 # Shared TypeScript types
├── App.tsx                     # Root: routes between setup/game/complete
├── main.tsx                    # Entry point
└── index.css                   # Tailwind imports

tests/
├── reducers/
│   └── game-reducer.test.ts    # Pure function tests (no React)
├── utils/
│   ├── board.test.ts           # Board generation tests
│   └── validation.test.ts      # Config validation tests
├── hooks/
│   └── use-game-state.test.ts  # Hook integration tests
└── components/
    ├── setup-screen.test.tsx   # Config form tests
    ├── game-board.test.tsx     # Board rendering tests
    └── card.test.tsx           # Card flip behavior tests
```

## TDD Workflow (Constitution Mandate)

For every piece of functionality:

```bash
# 1. RED: Write failing test
npm test -- --run reducers/game-reducer.test.ts

# 2. GREEN: Write minimum code to pass
npm test -- --run reducers/game-reducer.test.ts

# 3. REFACTOR: Clean up (all tests must still pass)
npm test
```

## Key Files to Implement First

1. **`src/types/game.ts`** — Type definitions (CardState, GamePhase, GameAction, etc.)
2. **`src/utils/validation.ts`** — Board config validation (pure function, easy to TDD)
3. **`src/utils/symbols.ts`** — Symbol pool constant (trivial)
4. **`src/utils/board.ts`** — Board generation + Fisher-Yates shuffle
5. **`src/reducers/game-reducer.ts`** — Core state machine
6. **`src/hooks/use-game-state.ts`** — React integration hook
7. **Components** — UI layer consuming the hook

## Config Files

### vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({ registerType: "autoUpdate" }),
  ],
});
```

### vitest setup (in vite.config.ts or vitest.config.ts)
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
  },
});
```

### tsconfig.json (strict mode)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true
  },
  "include": ["src"]
}
```
