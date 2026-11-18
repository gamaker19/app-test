"use client";

import { useEffect } from "react";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useTetrisStore } from "@/store/useTetrisStore";
import { Board } from "./Board";
import { Controls } from "./Controls";
import { PiecePreview } from "./PiecePreview";
import { ScorePanel } from "./ScorePanel";

export const TetrisGame = () => {
  const next = useTetrisStore((s) => s.next);
  const hold = useTetrisStore((s) => s.hold);
  const status = useTetrisStore((s) => s.status);
  const loadHighScore = useTetrisStore((s) => s.loadHighScore);

  useGameLoop();
  useKeyboard();

  // 최고 점수는 localStorage에서 클라이언트 마운트 후에 읽는다
  useEffect(() => {
    loadHighScore();
  }, [loadHighScore]);

  const showPreview = status !== "idle";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">테트리스</h1>

      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        {/* 데스크톱: 왼쪽 Hold */}
        <div className="hidden md:block">
          <PiecePreview label="Hold" type={hold} />
        </div>

        <div className="flex flex-col gap-3">
          {/* 모바일: 보드 위에 요약 정보 */}
          <div className="flex items-center justify-between gap-2 md:hidden">
            <PiecePreview label="Hold" type={hold} />
            <PiecePreview label="Next" type={showPreview ? next : null} />
          </div>
          <Board />
        </div>

        {/* 데스크톱: 오른쪽 Next + 점수 */}
        <div className="hidden flex-col gap-3 md:flex">
          <PiecePreview label="Next" type={showPreview ? next : null} />
          <ScorePanel />
        </div>

        {/* 모바일: 보드 아래 점수 */}
        <div className="w-full max-w-sm md:hidden">
          <ScorePanel />
        </div>
      </div>

      <Controls />

      <p className="hidden text-sm text-neutral-400 md:block">
        ←/→ 이동 · ↑ 회전 · ↓ 소프트 드롭 · Space 하드 드롭 · C 보관 · P 일시정지
      </p>
    </main>
  );
};
