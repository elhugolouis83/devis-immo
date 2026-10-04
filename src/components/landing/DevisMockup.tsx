"use client";

import { useRef, useState } from "react";
import { CornerMarks } from "@/components/ui/CornerMarks";

export function DevisMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div
      className="relative mx-auto w-full max-w-sm"
      style={{ perspective: "1000px" }}
    >
      {/* Stacked sheets behind the main card — reinforces "archive" + adds depth */}
      <div className="absolute inset-0 translate-x-3 translate-y-5 rotate-6 border-2 border-ink/40 bg-white" />
      <div className="absolute inset-0 translate-x-1.5 translate-y-2.5 rotate-3 border-2 border-ink/70 bg-white" />

      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative border-2 border-ink bg-white p-5 shadow-hard transition-transform duration-150 ease-out"
        style={{
          transform: `rotate(-2deg) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <CornerMarks />
        <div className="flex items-center justify-between border-b border-line pb-3">
          <span className="font-display text-sm font-semibold text-ink">
            DEV-2026-014
          </span>
          <span className="border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-soft">
            Brouillon
          </span>
        </div>
        <div className="mt-3 space-y-1.5 text-xs text-ink-soft">
          <p className="text-ink">Mme Lefèvre — 12 rue des Lilas</p>
          <div className="flex justify-between border-t border-line pt-2">
            <span>Remplacement chaudière gaz</span>
            <span className="tabular-nums text-ink">2 500,00 €</span>
          </div>
          <div className="flex justify-between">
            <span>TVA 5,5 %</span>
            <span className="tabular-nums text-ink">137,50 €</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t-2 border-ink pt-2">
          <span className="font-display text-sm font-semibold text-ink">
            Total TTC
          </span>
          <span className="font-display text-lg font-semibold text-brick">
            2 637,50 €
          </span>
        </div>
      </div>
    </div>
  );
}
