// 테트로미노 종류
export type PieceType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

// 보드의 한 칸: 비어 있으면 null, 채워져 있으면 블록 종류
export type CellValue = PieceType | null;

export type Board = CellValue[][];

// 0과 1로 이루어진 블록 모양 행렬
export type Shape = number[][];

export interface Piece {
  type: PieceType;
  shape: Shape;
  // 보드 상의 좌상단 좌표
  x: number;
  y: number;
}

export type GameStatus = "idle" | "playing" | "paused" | "gameover";
