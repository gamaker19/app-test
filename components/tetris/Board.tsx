import { useMemo } from "react";
import { BOARD_COLS } from "@/lib/tetris/constants";
import { getGhostY } from "@/lib/tetris/logic";
import type { PieceType } from "@/lib/tetris/types";
import { useTetrisStore } from "@/store/useTetrisStore";
import { Cell } from "./Cell";
import { GameOverlay } from "./GameOverlay";

interface DisplayCell {
  type: PieceType | null;
  ghost: boolean;
}

export const Board = () => {
  const board = useTetrisStore((s) => s.board);
  const current = useTetrisStore((s) => s.current);

  // 고정된 블록 + 고스트 + 현재 블록을 합쳐서 표시용 격자를 만든다
  const cells = useMemo<DisplayCell[][]>(() => {
    const grid: DisplayCell[][] = board.map((row) =>
      row.map((type) => ({ type, ghost: false })),
    );
    if (current) {
      const ghostY = getGhostY(board, current);
      current.shape.forEach((row, dy) =>
        row.forEach((filled, dx) => {
          if (!filled) return;
          const x = current.x + dx;
          const ghostRow = grid[ghostY + dy];
          if (ghostRow) ghostRow[x] = { type: current.type, ghost: true };
        }),
      );
      current.shape.forEach((row, dy) =>
        row.forEach((filled, dx) => {
          if (!filled) return;
          const currentRow = grid[current.y + dy];
          if (currentRow) {
            currentRow[current.x + dx] = { type: current.type, ghost: false };
          }
        }),
      );
    }
    return grid;
  }, [board, current]);

  return (
    <div className="relative aspect-[1/2] w-[min(60vw,300px)] overflow-hidden rounded-lg border-2 border-neutral-700 bg-neutral-900">
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`,
          gridAutoRows: "1fr",
        }}
      >
        {cells.flat().map((cell, i) => (
          <Cell key={i} type={cell.type} ghost={cell.ghost} />
        ))}
      </div>
      <GameOverlay />
    </div>
  );
};
