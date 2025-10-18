export default function Box({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground p-4">
      <div className="text-sm font-medium mb-2">{title}</div>
      <ul className="text-xs text-muted-foreground space-y-1">
        {lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
