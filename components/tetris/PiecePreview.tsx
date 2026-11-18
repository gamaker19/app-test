import { PIECE_COLORS, SHAPES } from "@/lib/tetris/constants";
import type { PieceType } from "@/lib/tetris/types";

interface PiecePreviewProps {
  label: string;
  type: PieceType | null;
}

// Next / Hold 블록을 4x4 영역에 중앙 정렬해서 표시
export const PiecePreview = ({ label, type }: PiecePreviewProps) => {
  const shape = type ? SHAPES[type] : null;

  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-neutral-800 p-2 sm:p-3">
      <span className="text-xs font-semibold text-neutral-400">{label}</span>
      <div className="flex h-12 w-12 items-center justify-center sm:h-16 sm:w-16">
        {type && shape && (
          <div
            className="grid gap-px"
            style={{
              gridTemplateColumns: `repeat(${shape[0].length}, 1fr)`,
            }}
          >
            {shape.flat().map((filled, i) => (
              <div
                key={i}
                className={`h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 ${
                  filled ? PIECE_COLORS[type] : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
