import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function DiffCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}
