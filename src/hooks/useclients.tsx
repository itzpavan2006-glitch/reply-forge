import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export type ClientStage =
  | "new_lead"
  | "proposal_sent"
  | "negotiation"
  | "won"
  | "lost";

export type Client = {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  company: string | null;
  role: string | null;
  stage: ClientStage;
  value: number;
  currency: string;
  tags: string[];
  notes: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export const STAGES: { id: ClientStage; label: string; tone: string }[] = [
  { id: "new_lead", label: "New Lead", tone: "bg-secondary text-foreground" },
  { id: "proposal_sent", label: "Proposal Sent", tone: "bg-accent-soft text-accent" },
  { id: "negotiation", label: "Negotiation", tone: "bg-amber-100 text-amber-900" },
  { id: "won", label: "Won", tone: "bg-emerald-100 text-emerald-900" },
  { id: "lost", label: "Lost", tone: "bg-rose-100 text-rose-900" },
];

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Client[];
    },
  });
}

export function useClient(id?: string) {
  return useQuery({
    queryKey: ["client", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supabase.from("clients") as any
      )
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data as Client | null;
    },
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: Partial<Client> & { name: string }) => {
      const { data, error } = await (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supabase.from("clients") as unknown as any
      )
        .insert({
          user_id: user!.id,
          name: input.name,
          email: input.email ?? null,
          company: input.company ?? null,
          role: input.role ?? null,
          stage: input.stage ?? "new_lead",
          value: input.value ?? 0,
          currency: input.currency ?? "USD",
          tags: input.tags ?? [],
          notes: input.notes ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Client;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client added");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Client> & { id: string }) => {
      const { data, error } = await (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supabase.from("clients") as unknown as any
      )
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Client;
    },
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["client", c.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supabase.from("clients") as unknown as any
      ).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export type ClientActivity = {
  id: string;
  client_id: string;
  user_id: string;
  type: "note" | "email" | "call" | "meeting" | "status_change" | "generation";
  body: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export function useClientActivities(clientId?: string) {
  return useQuery({
    queryKey: ["client_activities", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supabase.from("client_activities") as unknown as any
      )
        .select("*")
        .eq("client_id", clientId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ClientActivity[];
    },
  });
}

export function useAddActivity() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (a: {
      client_id: string;
      type: ClientActivity["type"];
      body: string;
      metadata?: Record<string, unknown>;
    }) => {
      const { error } = await (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supabase.from("client_activities") as unknown as any
      ).insert({
        user_id: user!.id,
        client_id: a.client_id,
        type: a.type,
        body: a.body,
        metadata: a.metadata ?? {},
      });
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["client_activities", vars.client_id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}