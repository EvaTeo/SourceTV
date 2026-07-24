"use client";

import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";

import { formatFileSize } from "../utils/formatFileSize";

import {
  CheckIcon,
  UploadTypeIcon,
} from "./Icons";

import type {
  UploadIconType,
} from "./Icons";

import { FieldLabel } from "./FormFields";

export default function FileUpload({
  icon,
  label,
  description,
  accept,
  file,
  required = false,
  large = false,
  buttonLabel,
  onFile,
}: {
  icon: UploadIconType;
  label: string;
  description: string;
  accept: string;
  file: File | null;
  required?: boolean;
  large?: boolean;
  buttonLabel: string;
  onFile: (file: File | null) => void;
}) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [dragging, setDragging] =
    useState(false);

  function chooseFile() {
    inputRef.current?.click();
  }

  function handleInput(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0] || null;

    onFile(selectedFile);
    event.target.value = "";
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setDragging(false);

    const selectedFile =
      event.dataTransfer.files?.[0];

    if (selectedFile) {
      onFile(selectedFile);
    }
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`group relative overflow-hidden rounded-2xl border p-4 transition duration-300 sm:p-5 ${
        dragging
          ? "border-sky-300/65 bg-sky-300/[0.085] shadow-[0_0_0_4px_rgba(125,211,252,0.04)]"
          : file
            ? "border-emerald-300/22 bg-gradient-to-br from-emerald-300/[0.055] to-transparent shadow-[0_16px_45px_rgba(0,0,0,0.15)]"
            : "border-white/10 bg-black/15 hover:-translate-y-0.5 hover:border-white/18 hover:bg-black/23 hover:shadow-[0_18px_50px_rgba(0,0,0,0.2)]"
      } ${large ? "min-h-[175px]" : ""}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px transition ${
          file
            ? "bg-gradient-to-r from-transparent via-emerald-300/45 to-transparent"
            : "bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
        }`}
      />

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInput}
      />

      <div className="flex h-full flex-col justify-between gap-5">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition ${
                  file
                    ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                    : "border-white/10 bg-white/[0.035] text-white/36 group-hover:border-sky-300/20 group-hover:bg-sky-300/[0.055] group-hover:text-sky-200"
                }`}
              >
                {file ? (
                  <CheckIcon />
                ) : (
                  <UploadTypeIcon type={icon} />
                )}
              </div>

              <div className="min-w-0">
                <FieldLabel
                  label={label}
                  required={required}
                />

                <p className="mt-2 text-xs leading-5 text-white/35">
                  {description}
                </p>
              </div>
            </div>

            <div
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full transition ${
                file
                  ? "bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.55)]"
                  : "bg-white/14"
              }`}
            />
          </div>

          {file && (
            <div className="mt-4 rounded-xl border border-white/[0.07] bg-black/25 px-3 py-3">
              <p className="truncate text-sm font-semibold text-white/72">
                {file.name}
              </p>

              <div className="mt-1.5 flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-white/28">
                  {formatFileSize(file.size)}
                </p>

                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-emerald-300/75">
                  Ready
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={chooseFile}
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-black shadow-[0_8px_24px_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 hover:bg-sky-100"
          >
            {file
              ? "Replace File"
              : buttonLabel}
          </button>

          {file && (
            <button
              type="button"
              onClick={() => onFile(null)}
              className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-bold text-white/50 transition hover:border-red-300/25 hover:bg-red-300/[0.06] hover:text-red-200"
            >
              Remove
            </button>
          )}

          {!file && (
            <span className="text-[10px] font-semibold text-white/22">
              or drag and drop
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
