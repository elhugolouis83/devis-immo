"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-brick px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-brick-dark disabled:opacity-60"
    >
      {pending ? "Un instant…" : children}
    </button>
  );
}
