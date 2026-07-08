import type { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

export default function ModalField({
  label,
  children,
}: Props) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
        {label}
      </span>

      {children}
    </label>
  );
}