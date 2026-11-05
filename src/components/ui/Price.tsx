import { formatINR } from "@/lib/format";

export function Price({ value, compareAt, show, symbol, className = "", quiet = false }: { value: number | null; compareAt?: number | null; show: boolean; symbol: string; className?: string; quiet?: boolean }) {
  if (!show || value === null) {
    return (
      <span className={`inline-flex items-center gap-2 text-sm ${quiet ? "text-muted" : "text-ink/80"} ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Made to order
      </span>
    );
  }
  return (
    <span className={className}>
      <span className="font-semibold">{formatINR(value, symbol)}</span>
      {compareAt && compareAt > value ? <span className="ml-2 text-muted line-through text-sm">{formatINR(compareAt, symbol)}</span> : null}
    </span>
  );
}
