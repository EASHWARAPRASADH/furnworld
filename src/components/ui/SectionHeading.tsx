import { Reveal, SplitWords } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  dark = false,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "text-center mx-auto" : ""} max-w-3xl ${className}`}>
      {eyebrow ? (
        <Reveal>
          <p className={`eyebrow mb-4 ${dark ? "text-white/60" : ""}`}>{eyebrow}</p>
        </Reveal>
      ) : null}
      <SplitWords
        text={title}
        as="h2"
        className={`font-display display-soft text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.02em] ${dark ? "text-white" : "text-ink"}`}
      />
      {text ? (
        <Reveal delay={0.15}>
          <p className={`mt-5 text-[1.05rem] leading-relaxed ${dark ? "text-white/70" : "text-muted"} ${align === "center" ? "mx-auto" : ""} max-w-xl`}>{text}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
