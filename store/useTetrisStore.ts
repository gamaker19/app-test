import { create } from "zustand";
import {
  HIGH_SCORE_KEY,
  LINES_PER_LEVEL,
  LINE_SCORES,
} from "@/lib/tetris/constants";
import {
  clearLines,
  createBoard,
  createPiece,
  drawFromBag,
  getGhostY,
  isValidPosition,
  mergePiece,
  tryRotate,
} from "@/lib/tetris/logic";
import type { Board, GameStatus, Piece, PieceType } from "@/lib/tetris/types";

interface TetrisState {
  board: Board;
  current: Piece | null;
  next: PieceType;
  hold: PieceType | null;
  canHold: boolean;
  bag: PieceType[];
  score: number;
  lines: number;
  level: number;
  highScore: number;
  status: GameStatus;
  start: () => void;
  togglePause: () => void;
  moveHorizontal: (dir: -1 | 1) => void;
  rotate: () => void;
  softDrop: () => void;
  hardDrop: () => void;
  holdPiece: () => void;
  tick: () => void;
  loadHighScore: () => void;
}

const saveHighScore = (value: number): void => {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(value));
  } catch {
    // 저장소 접근이 막힌 환경에서는 무시
  }
};

// 현재 블록을 보드에 고정하고, 줄 삭제/점수/다음 블록/게임오버를 처리
const lockPiece = (
  s: TetrisState,
  piece: Piece,
  extraScore: number,
): Partial<TetrisState> => {
  const { board, cleared } = clearLines(mergePiece(s.board, piece));
  const lines = s.lines + cleared;
  const level = Math.floor(lines / LINES_PER_LEVEL) + 1;
  const score = s.score + extraScore + LINE_SCORES[cleared] * s.level;

  const { type, bag } = drawFromBag(s.bag);
  const spawned = createPiece(s.next);
  const base: Partial<TetrisState> = {
    board,
    lines,
    level,
    score,
    next: type,
    bag,
    canHold: true,
  };

  // 새 블록이 놓일 자리가 없으면 게임오버
  if (!isValidPosition(board, spawned)) {
    const highScore = Math.max(s.highScore, score);
    if (highScore > s.highScore) saveHighScore(highScore);
    return { ...base, current: null, status: "gameover", highScore };
  }
  return { ...base, current: spawned };
};

export const useTetrisStore = create<TetrisState>()((set, get) => ({
  board: createBoard(),
  current: null,
  next: "I",
  hold: null,
  canHold: true,
  bag: [],
  score: 0,
  lines: 0,
  level: 1,
  highScore: 0,
  status: "idle",

  start: () => {
    const first = drawFromBag([]);
    const second = drawFromBag(first.bag);
    set({
      board: createBoard(),
      current: createPiece(first.type),
      next: second.type,
      bag: second.bag,
      hold: null,
      canHold: true,
      score: 0,
      lines: 0,
      level: 1,
      status: "playing",
    });
  },

  togglePause: () => {
    const { status } = get();
    if (status === "playing") set({ status: "paused" });
    else if (status === "paused") set({ status: "playing" });
  },

  moveHorizontal: (dir) => {
    const { current, board, status } = get();
    if (status !== "playing" || !current) return;
    const moved = { ...current, x: current.x + dir };
    if (isValidPosition(board, moved)) set({ current: moved });
  },

  rotate: () => {
    const { current, board, status } = get();
    if (status !== "playing" || !current) return;
    const rotated = tryRotate(board, current);
    if (rotated) set({ current: rotated });
  },

  // 중력에 의한 한 칸 낙하 (바닥에 닿으면 고정)
  tick: () => {
    const s = get();
    if (s.status !== "playing" || !s.current) return;
    const moved = { ...s.current, y: s.current.y + 1 };
    if (isValidPosition(s.board, moved)) set({ current: moved });
    else set(lockPiece(s, s.current, 0));
  },

  // 소프트 드롭: 한 칸 내리며 1점
  softDrop: () => {
    const s = get();
    if (s.status !== "playing" || !s.current) return;
    const moved = { ...s.current, y: s.current.y + 1 };
    if (isValidPosition(s.board, moved)) {
      set({ current: moved, score: s.score + 1 });
    } else {
      set(lockPiece(s, s.current, 0));
    }
  },

  // 하드 드롭: 바닥까지 즉시 내리며 칸당 2점
  hardDrop: () => {
    const s = get();
    if (s.status !== "playing" || !s.current) return;
    const y = getGhostY(s.board, s.current);
    set(lockPiece(s, { ...s.current, y }, (y - s.current.y) * 2));
  },

  holdPiece: () => {
    const s = get();
    if (s.status !== "playing" || !s.current || !s.canHold) return;

    if (s.hold === null) {
      // 보관 칸이 비어 있으면 다음 블록을 꺼내 사용
      const { type, bag } = drawFromBag(s.bag);
      set({
        hold: s.current.type,
        current: createPiece(s.next),
        next: type,
        bag,
        canHold: false,
      });
    } else {
      set({
        hold: s.current.type,
        current: createPiece(s.hold),
        canHold: false,
      });
    }
  },

  loadHighScore: () => {
    try {
      const saved = Number(localStorage.getItem(HIGH_SCORE_KEY));
      if (Number.isFinite(saved) && saved > 0) set({ highScore: saved });
    } catch {
      // 저장소 접근이 막힌 환경에서는 무시
    }
  },
}));
