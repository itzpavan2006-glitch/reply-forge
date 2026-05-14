import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import { STAGES, useUpdateClient, type Client, type ClientStage } from "@/hooks/useclients";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function initials(n: string) {
  return n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
}

function ClientCard({
  client,
  onOpen,
}: {
  client: Client;
  onOpen: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: client.id,
  });
  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      className={cn(
        "group rounded-2xl border border-border bg-card p-4 shadow-soft cursor-grab active:cursor-grabbing transition-smooth hover:shadow-card",
        isDragging && "opacity-50"
      )}
      onClick={(e) => {
        // only open on a real click (not a drag end)
        if (!isDragging) onOpen(client.id);
        e.stopPropagation();
      }}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-foreground text-background text-xs">
            {initials(client.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">{client.name}</p>
          {client.company && (
            <p className="text-xs text-muted-foreground truncate">
              {client.company}
            </p>
          )}
        </div>
      </div>
      {client.value > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="secondary" className="rounded-full text-[10px]">
            ${Number(client.value).toLocaleString()}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {new Date(client.updated_at).toLocaleDateString()}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function Column({
  stage,
  label,
  tone,
  clients,
  onOpen,
}: {
  stage: ClientStage;
  label: string;
  tone: string;
  clients: Client[];
  onOpen: (id: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: stage });
  const total = clients.reduce((s, c) => s + Number(c.value || 0), 0);
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-secondary/40 p-3 min-h-[420px] transition-smooth",
        isOver && "bg-accent-soft border-accent/40"
      )}
    >
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", tone)}>
            {label}
          </span>
          <span className="text-xs text-muted-foreground">{clients.length}</span>
        </div>
        {total > 0 && (
          <span className="text-[10px] text-muted-foreground font-mono">
            ${total.toLocaleString()}
          </span>
        )}
      </div>
      <div className="space-y-2 flex-1">
        {clients.length === 0 ? (
          <div className="text-xs text-muted-foreground/70 text-center py-10">
            Drop clients here
          </div>
        ) : (
          clients.map((c) => <ClientCard key={c.id} client={c} onOpen={onOpen} />)
        )}
      </div>
    </div>
  );
}

export default function Pipeline({
  clients,
  onOpen,
}: {
  clients: Client[];
  onOpen: (id: string) => void;
}) {
  const update = useUpdateClient();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );
  const onDragEnd = (e: DragEndEvent) => {
    const id = e.active.id as string;
    const newStage = e.over?.id as ClientStage | undefined;
    if (!newStage) return;
    const c = clients.find((x) => x.id === id);
    if (!c || c.stage === newStage) return;
    update.mutate({ id, stage: newStage });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map((s) => (
          <Column
            key={s.id}
            stage={s.id}
            label={s.label}
            tone={s.tone}
            clients={clients.filter((c) => c.stage === s.id)}
            onOpen={onOpen}
          />
        ))}
      </div>
    </DndContext>
  );
}