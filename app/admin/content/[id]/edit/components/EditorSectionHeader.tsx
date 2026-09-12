type EditorSectionHeaderProps = {
  title: string;
  description: string;
  bordered?: boolean;
};

export default function EditorSectionHeader({
  title,
  description,
  bordered = false,
}: EditorSectionHeaderProps) {
  return (
    <div
      className={
        bordered
          ? "md:col-span-2 border-t border-white/10 pt-6"
          : "md:col-span-2"
      }
    >
      <h2 className="text-2xl font-black">
        {title}
      </h2>

      <p className="mt-2 text-white/50">
        {description}
      </p>
    </div>
  );
}