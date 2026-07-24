type ArtworkPlaceholderProps = {
  label: string;
  compact?: boolean;
};

export default function ArtworkPlaceholder({
  label,
  compact = false,
}: ArtworkPlaceholderProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(255,255,255,0.025),rgba(255,255,255,0.005))]">
      <span
        className={`text-center font-semibold text-white/20 ${
          compact
            ? "px-1 text-[8px]"
            : "px-3 text-xs"
        }`}
      >
        {label}
      </span>
    </div>
  );
}