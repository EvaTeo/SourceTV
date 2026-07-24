"use client";

import Link from "next/link";

import type { PartnerContract } from "../types";
import {
  formatDate,
  needsAction,
  statusClass,
  statusLabel,
} from "../utils";

type ContractRowProps = {
  contract: PartnerContract;
};

export default function ContractRow({
  contract,
}: ContractRowProps) {
  const artwork =
    contract.project?.cardArtUrl ||
    contract.project?.backdropUrl ||
    contract.project?.thumbnailUrl ||
    "";

  const urgent = needsAction(contract);

  return (
    <article className="grid gap-5 p-5 transition duration-200 hover:bg-white/[0.025] md:grid-cols-[128px_1fr_auto] md:items-center md:p-6">
      <div
        className="aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#090d15] bg-cover bg-center"
        style={{
          backgroundImage: artwork
            ? `linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.08)), url(${artwork})`
            : "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.18), transparent 34%), linear-gradient(to right, #06090f, #0b1220)",
        }}
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${statusClass(
              contract.status
            )}`}
          >
            {statusLabel(contract.status)}
          </span>

          {urgent && (
            <span className="rounded-full border border-sky-300/25 bg-sky-300/[0.08] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-sky-200">
              Action Needed
            </span>
          )}
        </div>

        <h3 className="mt-3 truncate text-xl font-black tracking-tight text-white">
          {contract.project?.title || "Untitled Contract"}
        </h3>

        <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/40">
          {contract.project?.description ||
            "Streaming rights agreement for this SourceTV title."}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/35">
          <span>
            License:{" "}
            <strong className="font-semibold text-white/60">
              {contract.licenseType || "Not set"}
            </strong>
          </span>

          <span>
            Revenue Share:{" "}
            <strong className="font-semibold text-white/60">
              {contract.revenueShare ?? 50}%
            </strong>
          </span>

          <span>
            Updated:{" "}
            <strong className="font-semibold text-white/60">
              {formatDate(contract.updatedAt)}
            </strong>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:items-end">
        <Link
          href={`/partner/contracts/${contract.id}`}
          className={`inline-flex min-w-36 justify-center rounded-xl px-4 py-2.5 text-xs font-black shadow-sm transition ${
            urgent
              ? "bg-sky-300 text-black hover:bg-sky-200"
              : "border border-white/10 bg-white/[0.035] text-white/65 hover:border-sky-300/30 hover:text-white"
          }`}
        >
          {urgent ? "Review Contract" : "Open Contract"}
        </Link>

        <p className="text-[11px] text-white/25">
          Signed: {formatDate(contract.signedAt)}
        </p>
      </div>
    </article>
  );
}