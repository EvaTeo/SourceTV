"use client";

export default function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("sourcetvUser");
    window.location.href = "/login";
  }

  return (
    <button
      onClick={logout}
      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-white/60 transition hover:border-red-300/40 hover:text-red-200"
    >
      Logout
    </button>
  );
}