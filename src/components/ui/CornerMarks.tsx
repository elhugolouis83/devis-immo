export function CornerMarks({ color = "var(--color-ink)" }: { color?: string }) {
  const arm = "absolute h-2.5 w-2.5 border-current";
  return (
    <div className="pointer-events-none absolute inset-0" style={{ color }}>
      <span className={`${arm} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${arm} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${arm} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${arm} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
  );
}
