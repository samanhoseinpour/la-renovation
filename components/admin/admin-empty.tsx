import { adminInbox } from "@/content/admin";

export function AdminEmpty({ variant }: { variant: "all" | "filtered" }) {
  const copy = adminInbox.empty[variant];
  return (
    <div className="py-24 text-center">
      <p className="text-h3">{copy.title}</p>
      <p className="mt-3 text-muted-foreground">{copy.body}</p>
    </div>
  );
}
