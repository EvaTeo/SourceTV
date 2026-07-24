export default function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[0.025]"
        />
      ))}
    </div>
  );
}