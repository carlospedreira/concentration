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
  /** CSS color shown when revealed; two cards match when their colors are equal. */
  readonly color: string;
  /** Accessible label describing the color. */
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
