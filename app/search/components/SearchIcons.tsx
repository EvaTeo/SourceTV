export function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[2]"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4 stroke-[2.2]"
      aria-hidden="true"
    >
      <path d="m7 7 10 10" strokeLinecap="round" />
      <path d="m17 7-10 10" strokeLinecap="round" />
    </svg>
  );
}

export function EmptySearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-8 w-8 stroke-[1.7]"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m15 15 4 4" strokeLinecap="round" />
      <path d="M8.5 9h4" strokeLinecap="round" />
      <path d="M10.5 7v4" strokeLinecap="round" />
    </svg>
  );
}