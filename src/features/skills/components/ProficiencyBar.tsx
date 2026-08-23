export function ProficiencyBar({ level }: { level: number }) {
  const segments = Math.round(level / 20);
  return (
    <div className="flex gap-[5px] items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="block h-1 w-[18px] rounded-sm bg-violet"
          style={{ opacity: i < segments ? 1 : 0.15 }}
        />
      ))}
      <span className="font-mono text-[11px] text-text-muted ml-2">{level}%</span>
    </div>
  );
}
