import { useTetrisStore } from "@/store/useTetrisStore";

interface ControlButtonProps {
  label: string;
  ariaLabel: string;
  onPress: () => void;
}

const ControlButton = ({ label, ariaLabel, onPress }: ControlButtonProps) => (
  <button
    type="button"
    aria-label={ariaLabel}
    // 터치 시 즉시 반응하고 포커스를 가져가지 않도록 처리
    onPointerDown={(e) => {
      e.preventDefault();
      onPress();
    }}
    className="flex h-12 flex-1 touch-manipulation select-none items-center justify-center rounded-lg bg-neutral-700 text-lg font-bold active:bg-neutral-600"
  >
    {label}
  </button>
);

// 모바일용 터치 버튼 (md 이상에서는 키보드를 사용하므로 숨김)
export const Controls = () => {
  const moveHorizontal = useTetrisStore((s) => s.moveHorizontal);
  const rotate = useTetrisStore((s) => s.rotate);
  const softDrop = useTetrisStore((s) => s.softDrop);
  const hardDrop = useTetrisStore((s) => s.hardDrop);
  const holdPiece = useTetrisStore((s) => s.holdPiece);
  const togglePause = useTetrisStore((s) => s.togglePause);

  return (
    <div className="flex w-full max-w-sm flex-col gap-2 md:hidden">
      <div className="flex gap-2">
        <ControlButton label="⟲" ariaLabel="회전" onPress={rotate} />
        <ControlButton label="Hold" ariaLabel="블록 보관" onPress={holdPiece} />
        <ControlButton label="⏯" ariaLabel="일시정지" onPress={togglePause} />
      </div>
      <div className="flex gap-2">
        <ControlButton
          label="←"
          ariaLabel="왼쪽 이동"
          onPress={() => moveHorizontal(-1)}
        />
        <ControlButton label="↓" ariaLabel="아래로" onPress={softDrop} />
        <ControlButton
          label="→"
          ariaLabel="오른쪽 이동"
          onPress={() => moveHorizontal(1)}
        />
        <ControlButton label="⤓" ariaLabel="즉시 낙하" onPress={hardDrop} />
      </div>
    </div>
  );
};
