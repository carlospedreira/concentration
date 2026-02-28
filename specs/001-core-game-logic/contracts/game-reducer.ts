/**
 * Game Reducer Contract
 *
 * This file defines the TypeScript interfaces for the core game logic.
 * It serves as the contract between the game state machine (reducer)
 * and any consumers (React components, tests).
 *
 * This is a DESIGN CONTRACT — not production code. It will be refined
 * during implementation but establishes the type boundaries upfront.
 */

// --- Enums ---

export type CardState = "faceDown" | "faceUp" | "matched";

export type GamePhase =
  | "setup"
  | "playing"
  | "checking"
  | "revealing"
  | "complete";

// --- Entities ---

export interface BoardConfig {
  readonly rows: number;
  readonly cols: number;
}

export interface Card {
  readonly id: number;
  readonly symbol: string;
  readonly state: CardState;
}

export interface GameState {
  readonly phase: GamePhase;
  readonly config: BoardConfig;
  readonly cards: readonly Card[];
  readonly selectedIndices: readonly number[];
  readonly moveCount: number;
}

// --- Actions (Discriminated Union) ---

export type GameAction =
  | { readonly type: "START_GAME"; readonly payload: { config: BoardConfig } }
  | { readonly type: "SELECT_CARD"; readonly payload: { index: number } }
  | { readonly type: "CHECK_MATCH" }
  | { readonly type: "FLIP_BACK" }
  | { readonly type: "RESET" };

// --- Reducer Signature ---

export type GameReducer = (state: GameState, action: GameAction) => GameState;

// --- Validation ---

export interface ValidationResult {
  readonly valid: boolean;
  readonly error?: string;
}

export type ValidateBoardConfig = (config: BoardConfig) => ValidationResult;

// --- Board Generation ---

export type GenerateBoard = (config: BoardConfig) => readonly Card[];
