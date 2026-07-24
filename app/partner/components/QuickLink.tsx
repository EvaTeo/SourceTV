import Link from "next/link";

type QuickLinkProps = {
  title: string;
  description: string;
  href: string;
};

export default function QuickLink({
  title,
  description,
  href,
}: QuickLinkProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-sky-300/30 hover:bg-sky-300/[0.035]"
    >
      <div>
        <p className="text-sm font-black">
          {title}
        </p>

        <p className="mt-1 text-xs text-white/38">
          {description}
        </p>
      </div>

      <span className="text-lg text-white/30 transition group-hover:translate-x-1 group-hover:text-sky-200">
        →
      </span>
    </Link>
  );
}