import { useEffect } from "react";
import { getDropInterval } from "@/lib/tetris/constants";
import { useTetrisStore } from "@/store/useTetrisStore";

// 플레이 중일 때 레벨에 맞는 간격으로 tick 호출
export const useGameLoop = (): void => {
  const status = useTetrisStore((s) => s.status);
  const level = useTetrisStore((s) => s.level);
  const tick = useTetrisStore((s) => s.tick);

  useEffect(() => {
    if (status !== "playing") return;
    const id = setInterval(tick, getDropInterval(level));
    return () => clearInterval(id);
  }, [status, level, tick]);
};
