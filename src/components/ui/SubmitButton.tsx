"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="press-hard w-full border-2 border-ink bg-brick px-4 py-2.5 text-sm font-medium text-paper shadow-hard-sm disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-60 disabled:shadow-hard-sm"
    >
      {pending ? "Un instant…" : children}
    </button>
  );
}
