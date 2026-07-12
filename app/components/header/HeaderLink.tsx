import Link from "next/link";

export default function HeaderLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "text-sm font-bold text-sky-300"
          : "text-sm font-medium text-white/68 transition hover:text-white"
      }
    >
      {label}
    </Link>
  );
}