export function ChevronIcon({
  open,
}: {
  open: boolean;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      className={`h-3.5 w-3.5 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <path
        d="m5.5 7.5 4.5 4.5 4.5-4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function SwitchProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[1.8]"
      aria-hidden="true"
    >
      <path
        d="M7 7h11l-3-3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M17 17H6l3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ManageProfilesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[1.8]"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3" />

      <path
        d="M3.5 19c.5-3.2 2.3-5 5.5-5s5 1.8 5.5 5"
        strokeLinecap="round"
      />

      <path
        d="M17.5 10.5v5"
        strokeLinecap="round"
      />

      <path
        d="M15 13h5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BillingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[1.8]"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="6"
        width="17"
        height="12"
        rx="2"
      />

      <path d="M3.5 10h17" />

      <path
        d="M7 14h4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AccountIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[1.8]"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />

      <path
        d="M5 20c.7-4 3-6 7-6s6.3 2 7 6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[1.8]"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />

      <path
        d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.5 1a8 8 0 0 0-2-1.2L14 3h-4l-.4 2.7a8 8 0 0 0-2 1.2l-2.5-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.5-1a8 8 0 0 0 2 1.2L10 21h4l.4-2.7a8 8 0 0 0 2-1.2l2.5 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}