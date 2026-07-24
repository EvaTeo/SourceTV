export default function StatusMessage({
  type,
  title,
  message,
}: {
  type: "success" | "error";
  title: string;
  message: string;
}) {
  const success = type === "success";

  return (
    <section
      className={`mx-auto max-w-5xl rounded-2xl border px-5 py-4 shadow-[0_16px_50px_rgba(0,0,0,0.16)] ${
        success
          ? "border-emerald-300/20 bg-emerald-300/[0.07]"
          : "border-red-300/20 bg-red-300/[0.07]"
      }`}
    >
      <p
        className={`text-sm font-semibold ${
          success
            ? "text-emerald-100"
            : "text-red-100"
        }`}
      >
        {title}
      </p>

      <p
        className={`mt-1 text-xs leading-5 ${
          success
            ? "text-emerald-100/55"
            : "text-red-100/55"
        }`}
      >
        {message}
      </p>
    </section>
  );
}
