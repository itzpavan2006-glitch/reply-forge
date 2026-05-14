import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  STAGES,
  useClient,
  useUpdateClient,
  useDeleteClient,
  useClientActivities,
  useAddActivity,
  type ClientStage,
} from "@/hooks/useclients";
import { Building2, Mail, Trash2, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function initials(name: string) {
  return name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
}

export default function ClientDrawer({
  clientId,
  open,
  onOpenChange,
}: {
  clientId: string | null;
  open: boolean;
  onOpenChange: (b: boolean) => void;
}) {
  const { data: client } = useClient(clientId ?? undefined);
  const { data: activities } = useClientActivities(clientId ?? undefined);
  const update = useUpdateClient();
  const del = useDeleteClient();
  const addActivity = useAddActivity();
  const [note, setNote] = useState("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        {!client ? (
          <div className="text-sm text-muted-foreground p-4">Loading…</div>
        ) : (
          <>
            <SheetHeader className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-foreground text-background font-display">
                    {initials(client.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <SheetTitle className="font-display text-2xl tracking-tight">
                    {client.name}
                  </SheetTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {client.company && (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" /> {client.company}
                      </span>
                    )}
                    {client.email && (
                      <a
                        href={`mailto:${client.email}`}
                        className="inline-flex items-center gap-1.5 hover:text-foreground"
                      >
                        <Mail className="h-3.5 w-3.5" /> {client.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Stage
                  </Label>
                  <Select
                    value={client.stage}
                    onValueChange={(v) =>
                      update.mutate({ id: client.id, stage: v as ClientStage })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Deal value
                  </Label>
                  <Input
                    type="number"
                    defaultValue={client.value}
                    onBlur={(e) =>
                      update.mutate({ id: client.id, value: Number(e.target.value) || 0 })
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" className="rounded-full">
                  <Link to={`/generate?kind=proposal&client=${client.id}`}>
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Draft proposal
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link to={`/generate?kind=reply&client=${client.id}`}>
                    <Send className="h-3.5 w-3.5 mr-1.5" /> Draft reply
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full ml-auto text-destructive hover:text-destructive"
                  onClick={async () => {
                    if (!confirm(`Remove ${client.name}?`)) return;
                    await del.mutateAsync(client.id);
                    onOpenChange(false);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Remove
                </Button>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <section>
                <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Notes
                </h4>
                <Textarea
                  rows={4}
                  defaultValue={client.notes ?? ""}
                  placeholder="Add context, decision-maker info, recent meetings…"
                  onBlur={(e) =>
                    update.mutate({ id: client.id, notes: e.target.value })
                  }
                  className="rounded-xl"
                />
              </section>

              <section>
                <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Activity
                </h4>
                <div className="flex gap-2">
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Log a call, meeting, or update…"
                    className="rounded-xl"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && note.trim()) {
                        addActivity.mutate({
                          client_id: client.id,
                          type: "note",
                          body: note.trim(),
                        });
                        setNote("");
                      }
                    }}
                  />
                  <Button
                    className="rounded-full"
                    onClick={() => {
                      if (!note.trim()) return;
                      addActivity.mutate({
                        client_id: client.id,
                        type: "note",
                        body: note.trim(),
                      });
                      setNote("");
                    }}
                  >
                    Log
                  </Button>
                </div>

                <ol className="mt-4 relative border-l border-border ml-2 space-y-4">
                  {(activities ?? []).length === 0 ? (
                    <li className="pl-4 text-sm text-muted-foreground">
                      No activity yet — log your first interaction.
                    </li>
                  ) : (
                    activities!.map((a) => (
                      <li key={a.id} className="pl-4 relative">
                        <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-background" />
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="rounded-full text-[10px] uppercase">
                            {a.type.replace("_", " ")}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(a.created_at).toLocaleString()}
                          </span>
                        </div>
                        {a.body && (
                          <p className="text-sm mt-1 whitespace-pre-wrap">{a.body}</p>
                        )}
                      </li>
                    ))
                  )}
                </ol>
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}