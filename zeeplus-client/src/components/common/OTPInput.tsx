import { useRef } from "react";

interface Props {
  length?: number;
  value: string;
  onChange: (v: string) => void;
}

export function OTPInput({ length = 6, value, onChange }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = value.padEnd(length, " ").slice(0, length).split("");

  const update = (i: number, v: string) => {
    const c = v.replace(/\D/g, "").slice(-1);
    const next = chars
      .map((x, idx) => (idx === i ? c || " " : x))
      .join("")
      .trimEnd();
    onChange(next);
    if (c && i < length - 1) refs.current[i + 1]?.focus();
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={chars[i]?.trim() ?? ""}
          onChange={(e) => update(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !chars[i]?.trim() && i > 0)
              refs.current[i - 1]?.focus();
          }}
          className="h-12 w-12 rounded-md border border-input bg-background text-center text-lg font-semibold focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      ))}
    </div>
  );
}
