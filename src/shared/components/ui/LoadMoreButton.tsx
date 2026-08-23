export function LoadMoreButton({
  onClick,
  loading,
  label,
}: {
  onClick: () => void;
  loading: boolean;
  label: string;
}) {
  return (
    <div className="flex justify-center pt-2">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="rounded-full border border-border-glow-soft bg-surface px-6 py-2.5 font-mono text-[11px] tracking-[1px] text-text-secondary transition-[color,border-color,transform] hover:border-violet hover:text-text-primary active:scale-95 disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? "LOADING..." : label}
      </button>
    </div>
  );
}
