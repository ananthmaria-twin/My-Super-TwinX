export function TypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm bg-white/[0.06] px-3.5 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-typing rounded-full bg-(--text-muted)"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
