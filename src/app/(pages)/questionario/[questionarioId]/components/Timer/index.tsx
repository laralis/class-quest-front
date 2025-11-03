export function Timer({ timeLeft }: { timeLeft: number }) {
  return (
    <div className="flex items-center gap-6 rounded-b-lg bg-white mb-6 p-4 text-blue-logo">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-blue-logo h-2 rounded-full"
          style={{ width: `${(timeLeft / 45) * 100}%` }}
        />
      </div>

      <div className="text-right mb-4">
        <span className="text-2xl">{`${String(
          Math.floor(timeLeft / 60)
        ).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`}</span>
      </div>
    </div>
  );
}
