import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function ModeCard({
  name,
  tagline,
  bullets,
}: {
  name: string;
  tagline: string;
  bullets: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground">{tagline}</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
