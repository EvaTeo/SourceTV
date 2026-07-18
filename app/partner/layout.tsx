import type { ReactNode } from "react";
import PartnerLayout from "@/app/components/partner/PartnerLayout";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return <PartnerLayout>{children}</PartnerLayout>;
}