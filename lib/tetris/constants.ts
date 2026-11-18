import type { PieceType, Shape } from "./types";

export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;

export const PIECE_TYPES: PieceType[] = ["I", "O", "T", "S", "Z", "J", "L"];

// 블록별 초기 모양
export const SHAPES: Record<PieceType, Shape> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

// Tailwind는 완성된 클래스 문자열만 인식하므로 리터럴로 작성
export const PIECE_COLORS: Record<PieceType, string> = {
  I: "bg-cyan-400",
  O: "bg-yellow-400",
  T: "bg-purple-500",
  S: "bg-green-500",
  Z: "bg-red-500",
  J: "bg-blue-500",
  L: "bg-orange-500",
};

// 줄 삭제 수(0~4)에 따른 기본 점수 (레벨을 곱해서 사용)
export const LINE_SCORES = [0, 100, 300, 500, 800];

export const LINES_PER_LEVEL = 10;

// 레벨별 낙하 간격(ms)
export const getDropInterval = (level: number): number =>
  Math.max(100, 1000 - (level - 1) * 80);

export const HIGH_SCORE_KEY = "tetris-high-score";
