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

export interface UploadedImage {
  readonly id: string;
  readonly file: File;
  readonly url: string;
  readonly name: string;
}

export interface Card {
  readonly id: number;
  readonly symbol: string;
  readonly state: CardState;
  readonly imageUrl?: string;
}

export interface GameState {
  readonly phase: GamePhase;
  readonly config: BoardConfig;
  readonly cards: readonly Card[];
  readonly selectedIndices: readonly number[];
  readonly moveCount: number;
}

export type GameAction =
  | { readonly type: "START_GAME"; readonly payload: { config: BoardConfig; imageUrls?: readonly string[] } }
  | { readonly type: "SELECT_CARD"; readonly payload: { index: number } }
  | { readonly type: "CHECK_MATCH" }
  | { readonly type: "FLIP_BACK" }
  | { readonly type: "RESET" };

export interface ValidationResult {
  readonly valid: boolean;
  readonly error?: string;
}

export type ValidateBoardConfig = (config: BoardConfig) => ValidationResult;

export type GenerateBoard = (config: BoardConfig, imageUrls?: readonly string[]) => readonly Card[];
