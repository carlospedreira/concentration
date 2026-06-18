export type CardState = "faceDown" | "faceUp" | "matched";

export type GamePhase =
  | "setup"
  | "playing"
  | "checking"
  | "revealing"
  | "complete";

export interface BoardConfig {
  readonly rows: number;
  readonly cols: number;
}

export interface Card {
  readonly id: number;
  /** Swatch identity — two cards match when their keys are equal. */
  readonly colorKey: string;
  /** One CSS color (solid) or two (diagonal split) shown when revealed. */
  readonly colors: readonly string[];
  /** Accessible label describing the swatch. */
  readonly colorName: string;
  readonly state: CardState;
}

export interface GameState {
  readonly phase: GamePhase;
  readonly config: BoardConfig;
  readonly cards: readonly Card[];
  readonly selectedIndices: readonly number[];
  readonly moveCount: number;
}

export type GameAction =
  | { readonly type: "START_GAME"; readonly payload: { config: BoardConfig } }
  | { readonly type: "SELECT_CARD"; readonly payload: { index: number } }
  | { readonly type: "CHECK_MATCH" }
  | { readonly type: "FLIP_BACK" }
  | { readonly type: "RESET" };

export interface ValidationResult {
  readonly valid: boolean;
  readonly error?: string;
}

export type ValidateBoardConfig = (config: BoardConfig) => ValidationResult;

export type GenerateBoard = (config: BoardConfig) => readonly Card[];
