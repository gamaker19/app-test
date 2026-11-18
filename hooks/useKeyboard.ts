import { useEffect } from "react";
import { useTetrisStore } from "@/store/useTetrisStore";

// 키보드 입력을 게임 액션에 연결
export const useKeyboard = (): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const s = useTetrisStore.getState();

      // 시작/재시작
      if (e.key === "Enter" && (s.status === "idle" || s.status === "gameover")) {
        e.preventDefault();
        s.start();
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          s.moveHorizontal(-1);
          break;
        case "ArrowRight":
          s.moveHorizontal(1);
          break;
        case "ArrowUp":
          s.rotate();
          break;
        case "ArrowDown":
          s.softDrop();
          break;
        case " ":
          s.hardDrop();
          break;
        case "c":
        case "C":
          s.holdPiece();
          break;
        case "p":
        case "P":
          s.togglePause();
          break;
        default:
          return;
      }
      // 방향키/스페이스로 페이지가 스크롤되지 않도록 방지
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
};
