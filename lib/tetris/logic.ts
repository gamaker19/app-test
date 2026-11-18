import { BOARD_COLS, BOARD_ROWS, PIECE_TYPES, SHAPES } from "./constants";
import type { Board, Piece, PieceType, Shape } from "./types";

export const createBoard = (): Board =>
  Array.from({ length: BOARD_ROWS }, () =>
    Array.from({ length: BOARD_COLS }, () => null),
  );

// 새 블록을 보드 상단 중앙에 생성
export const createPiece = (type: PieceType): Piece => {
  const shape = SHAPES[type];
  return {
    type,
    shape,
    x: Math.floor((BOARD_COLS - shape[0].length) / 2),
    y: 0,
  };
};

// 시계 방향 90도 회전
export const rotateShape = (shape: Shape): Shape =>
  shape[0].map((_, col) => shape.map((row) => row[col]).reverse());

// 블록이 보드 안에서 다른 블록과 겹치지 않는지 검사
export const isValidPosition = (board: Board, piece: Piece): boolean =>
  piece.shape.every((row, dy) =>
    row.every((filled, dx) => {
      if (!filled) return true;
      const x = piece.x + dx;
      const y = piece.y + dy;
      return (
        x >= 0 && x < BOARD_COLS && y >= 0 && y < BOARD_ROWS && !board[y][x]
      );
    }),
  );

// 회전 시도: 제자리 → 좌우로 밀어보는 단순 월킥
const WALL_KICKS = [0, -1, 1, -2, 2];

export const tryRotate = (board: Board, piece: Piece): Piece | null => {
  const shape = rotateShape(piece.shape);
  for (const kick of WALL_KICKS) {
    const candidate: Piece = { ...piece, shape, x: piece.x + kick };
    if (isValidPosition(board, candidate)) return candidate;
  }
  return null;
};

export const mergePiece = (board: Board, piece: Piece): Board => {
  const next = board.map((row) => [...row]);
  piece.shape.forEach((row, dy) =>
    row.forEach((filled, dx) => {
      if (!filled) return;
      const y = piece.y + dy;
      const x = piece.x + dx;
      if (y >= 0 && y < BOARD_ROWS && x >= 0 && x < BOARD_COLS) {
        next[y][x] = piece.type;
      }
    }),
  );
  return next;
};

// 가득 찬 줄을 제거하고 위에서 빈 줄을 채움
export const clearLines = (board: Board): { board: Board; cleared: number } => {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const cleared = BOARD_ROWS - remaining.length;
  const emptyRows: Board = Array.from({ length: cleared }, () =>
    Array.from({ length: BOARD_COLS }, () => null),
  );
  return { board: [...emptyRows, ...remaining], cleared };
};

// 하드 드롭 시 블록이 도달할 y 좌표 (고스트 블록에도 사용)
export const getGhostY = (board: Board, piece: Piece): number => {
  let y = piece.y;
  while (isValidPosition(board, { ...piece, y: y + 1 })) y += 1;
  return y;
};

// 7-bag 랜덤: 7종을 한 번씩 섞어서 사용
export const createBag = (): PieceType[] => {
  const bag = [...PIECE_TYPES];
  for (let i = bag.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
};

export const drawFromBag = (
  bag: PieceType[],
): { type: PieceType; bag: PieceType[] } => {
  const source = bag.length > 0 ? bag : createBag();
  const [type, ...rest] = source;
  return { type, bag: rest };
};
