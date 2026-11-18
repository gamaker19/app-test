import { useTetrisStore } from "@/store/useTetrisStore";

// 시작 전, 일시정지, 게임오버 상태에서 보드 위에 표시
export const GameOverlay = () => {
  const status = useTetrisStore((s) => s.status);
  const score = useTetrisStore((s) => s.score);
  const start = useTetrisStore((s) => s.start);
  const togglePause = useTetrisStore((s) => s.togglePause);

  if (status === "playing") return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 p-4 text-center">
      {status === "idle" && (
        <>
          <p className="text-2xl font-bold">테트리스</p>
          <p className="text-sm text-neutral-300">Enter 키 또는 버튼으로 시작</p>
          <button type="button" onClick={start} className={buttonClass}>
            시작
          </button>
        </>
      )}
      {status === "paused" && (
        <>
          <p className="text-2xl font-bold">일시정지</p>
          <button type="button" onClick={togglePause} className={buttonClass}>
            계속하기
          </button>
        </>
      )}
      {status === "gameover" && (
        <>
          <p className="text-2xl font-bold">게임 오버</p>
          <p className="text-sm text-neutral-300">
            점수 {score.toLocaleString()}
          </p>
          <button type="button" onClick={start} className={buttonClass}>
            다시 시작
          </button>
        </>
      )}
    </div>
  );
};

const buttonClass =
  "rounded-lg bg-indigo-500 px-5 py-2 font-semibold text-white transition hover:bg-indigo-400 active:scale-95";
