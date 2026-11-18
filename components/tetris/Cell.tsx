import { PIECE_COLORS } from "@/lib/tetris/constants";
import type { PieceType } from "@/lib/tetris/types";

interface CellProps {
  type: PieceType | null;
  // 고스트 블록(착지 위치 미리보기) 여부
  ghost?: boolean;
}

export const Cell = ({ type, ghost = false }: CellProps) => {
  if (!type) {
    return <div className="border border-white/5 bg-neutral-900" />;
  }
  if (ghost) {
    return <div className="border border-white/30 bg-white/10" />;
  }
  return (
    <div
      className={`${PIECE_COLORS[type]} border border-black/30 shadow-[inset_0_0_4px_rgba(255,255,255,0.4)]`}
    />
  );
};
