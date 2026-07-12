"use client";

import { usePathname } from "next/navigation";
import CategoryMenu from "./CategoryMenu";
import HeaderLink from "./HeaderLink";

export default function ViewerNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-5 md:flex">
      <HeaderLink
        href="/browse"
        label="Home"
        active={pathname === "/browse"}
      />

      <HeaderLink
        href="/films"
        label="Films"
        active={pathname.startsWith("/films")}
      />

      <HeaderLink
        href="/shows"
        label="Shows"
        active={pathname.startsWith("/shows")}
      />

      <HeaderLink
        href="/animation"
        label="Animation"
        active={pathname.startsWith(
          "/animation"
        )}
      />

      <HeaderLink
        href="/documentaries"
        label="Documentaries"
        active={pathname.startsWith(
          "/documentaries"
        )}
      />

      <CategoryMenu />
    </nav>
  );
}