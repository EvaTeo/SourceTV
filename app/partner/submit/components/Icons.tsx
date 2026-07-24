export type UploadIconType =
  | "video"
  | "trailer"
  | "poster"
  | "image"
  | "logo";

export function MetadataDot() {
  return (
    <span
      aria-hidden="true"
      className="h-1 w-1 rounded-full bg-white/35"
    />
  );
}

export function UploadTypeIcon({
  type,
}: {
  type: UploadIconType;
}) {
  if (
    type === "video" ||
    type === "trailer"
  ) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect
          x="3"
          y="5"
          width="14"
          height="14"
          rx="2.5"
        />
        <path d="m17 10 4-2v8l-4-2" />
        <path d="m9 9 4 3-4 3V9Z" />
      </svg>
    );
  }

  if (type === "logo") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 18 9.5 6h5L20 18" />
        <path d="M7 14h10" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2.5"
      />
      <circle
        cx="8.5"
        cy="9"
        r="1.5"
      />
      <path d="m4 17 5-5 3.5 3.5 2-2L20 19" />
    </svg>
  );
}

export function CloudIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 text-sky-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M7 18a4 4 0 0 1-.8-7.92A6 6 0 0 1 17.7 8.3 4.5 4.5 0 0 1 17.5 18H7Z" />
      <path d="m12 15 0-6" />
      <path d="m9.5 11.5 2.5-2.5 2.5 2.5" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
