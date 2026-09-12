export function PlayPauseIcon({
  playing,
}: {
  playing: boolean;
}) {
  return playing ? (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <rect
        x="6"
        y="4"
        width="4"
        height="16"
        rx="1"
      />
      <rect
        x="14"
        y="4"
        width="4"
        height="16"
        rx="1"
      />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M8 5.8v12.4c0 .9 1 1.4 1.7.9l9.5-6.2c.7-.4.7-1.4 0-1.8L9.7 4.9C9 4.4 8 4.9 8 5.8z" />
    </svg>
  );
}

export function RewindIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[2.2]"
    >
      <path
        d="M7.5 8H4V4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.4 8A8 8 0 1 1 4 16"
        strokeLinecap="round"
      />
      <text
        x="9"
        y="15.5"
        fill="currentColor"
        stroke="none"
        fontSize="6"
        fontWeight="900"
      >
        10
      </text>
    </svg>
  );
}

export function ForwardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[2.2]"
    >
      <path
        d="M16.5 8H20V4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.6 8A8 8 0 1 0 20 16"
        strokeLinecap="round"
      />
      <text
        x="9"
        y="15.5"
        fill="currentColor"
        stroke="none"
        fontSize="6"
        fontWeight="900"
      >
        10
      </text>
    </svg>
  );
}

export function VolumeIcon({
  muted,
}: {
  muted: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[2.25]"
    >
      <path
        d="M4.5 9.5v5h3.1L12 18V6L7.6 9.5H4.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {muted ? (
        <>
          <path
            d="M16 9l4 4"
            strokeLinecap="round"
          />
          <path
            d="M20 9l-4 4"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M16 9.5c.8.7 1.2 1.6 1.2 2.5s-.4 1.8-1.2 2.5"
            strokeLinecap="round"
          />
          <path
            d="M18.5 7.2c1.4 1.2 2.2 2.9 2.2 4.8s-.8 3.6-2.2 4.8"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

export function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[2.2]"
    >
      <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z" />

      <path
        d="M19.4 13.4c.1-.5.1-.9.1-1.4s0-.9-.1-1.4l2-1.5-2-3.4-2.4 1a8 8 0 0 0-2.4-1.4L14.3 2h-4.6l-.4 3.3A8 8 0 0 0 7 6.7l-2.4-1-2 3.4 2 1.5c-.1.5-.1.9-.1 1.4s0 .9.1 1.4l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 2.3 1.4l.4 3.3h4.6l.4-3.3a8 8 0 0 0 2.3-1.4l2.4 1 2-3.4-2-1.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}