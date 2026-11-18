import { useTetrisStore } from "@/store/useTetrisStore";

interface StatProps {
  label: string;
  value: number;
}

const Stat = ({ label, value }: StatProps) => (
  <div className="flex flex-col items-center rounded-lg bg-neutral-800 px-3 py-2">
    <span className="text-xs font-semibold text-neutral-400">{label}</span>
    <span className="font-mono text-lg font-bold tabular-nums">
      {value.toLocaleString()}
    </span>
  </div>
);

export const ScorePanel = () => {
  const score = useTetrisStore((s) => s.score);
  const lines = useTetrisStore((s) => s.lines);
  const level = useTetrisStore((s) => s.level);
  const highScore = useTetrisStore((s) => s.highScore);

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
      <Stat label="점수" value={score} />
      <Stat label="최고 점수" value={highScore} />
      <Stat label="줄" value={lines} />
      <Stat label="레벨" value={level} />
    </div>
  );
};
