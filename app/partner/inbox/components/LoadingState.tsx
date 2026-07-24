export default function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-28 animate-pulse rounded-2xl border border-white/10 bg-black/20"
        />
      ))}
    </div>
  );
}