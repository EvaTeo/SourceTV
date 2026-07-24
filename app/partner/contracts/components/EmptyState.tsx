type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="px-6 py-14 text-center">
      <h3 className="text-lg font-black text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
        {description}
      </p>
    </div>
  );
}