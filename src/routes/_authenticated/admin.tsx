import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, LogOut, ShieldAlert } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Opp = Database["public"]["Tables"]["opportunities"]["Row"];
type OppInsert = Database["public"]["Tables"]["opportunities"]["Insert"];

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — LevelUp DZ" }] }),
  component: Admin,
});

const empty: OppInsert = {
  title: "",
  description: "",
  organizer: "",
  category: "courses",
  format: "online",
  tag: "",
  link: "",
  deadline: null,
};

function Admin() {
  const router = useRouter();
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [form, setForm] = useState<OppInsert>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return setIsAdmin(false);
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, []);

  const { data: opps } = useQuery({
    queryKey: ["opportunities", "admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("opportunities").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const payload: OppInsert = {
      ...form,
      tag: form.tag?.toString().trim() || null,
      deadline: form.deadline || null,
    };
    const op = editingId
      ? supabase.from("opportunities").update(payload).eq("id", editingId)
      : supabase.from("opportunities").insert(payload);
    const { error } = await op;
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Opportunity updated." : "Opportunity added.");
    setForm(empty);
    setEditingId(null);
    qc.invalidateQueries({ queryKey: ["opportunities"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this opportunity?")) return;
    const { error } = await supabase.from("opportunities").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted.");
    qc.invalidateQueries({ queryKey: ["opportunities"] });
  }

  function startEdit(o: Opp) {
    setEditingId(o.id);
    setForm({
      title: o.title,
      description: o.description,
      organizer: o.organizer,
      category: o.category,
      format: o.format,
      tag: o.tag ?? "",
      link: o.link,
      deadline: o.deadline,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (isAdmin === null) {
    return <div className="mx-auto max-w-3xl px-5 py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-md px-5 py-20 text-center animate-fade-up">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account is signed in but doesn't have the admin role yet. Ask an admin to grant
          you the <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">admin</code> role
          on the <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">user_roles</code> table.
        </p>
        <Button onClick={signOut} variant="outline" className="mt-6">
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add, edit and remove opportunities.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/directory">View directory</Link>
          </Button>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>

      <form onSubmit={save} className="mt-8 rounded-2xl border border-border bg-card p-6 soft-shadow">
        <h2 className="text-lg font-semibold">{editingId ? "Edit opportunity" : "Add an opportunity"}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Title" required>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </Field>
          <Field label="Organizer" required>
            <Input value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} required />
          </Field>
          <Field label="Topic (tag)">
            <Input
              placeholder="e.g. Programming, English, AI, Soft Skills"
              value={form.tag ?? ""}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
            />
          </Field>
          <Field label="Format" required>
            <Select value={form.format ?? "online"} onValueChange={(v) => setForm({ ...form, format: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in_person">In-person</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tag">
            <Input value={form.tag ?? ""} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="e.g. Programming" />
          </Field>
          <Field label="Deadline">
            <Input type="date" value={form.deadline ?? ""} onChange={(e) => setForm({ ...form, deadline: e.target.value || null })} />
          </Field>
          <Field label="Link" required>
            <Input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} required placeholder="https://…" />
          </Field>
          <Field label="Description" required className="md:col-span-2">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} />
          </Field>
        </div>
        <div className="mt-5 flex gap-2">
          <Button type="submit" disabled={busy}>
            <Plus className="mr-2 h-4 w-4" /> {editingId ? "Save changes" : "Add opportunity"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(empty); }}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">All opportunities</h2>
        <div className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {(opps ?? []).map((o) => (
            <div key={o.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{o.title}</p>
                <p className="truncate text-xs text-muted-foreground">{o.organizer} · {o.category} · {o.format}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => startEdit(o)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => remove(o.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {opps?.length === 0 && <div className="p-6 text-sm text-muted-foreground">No opportunities yet.</div>}
        </div>
      </div>
    </section>
  );
}

function Field({ label, children, required, className }: { label: string; children: React.ReactNode; required?: boolean; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-xs font-medium text-muted-foreground">
        {label}{required && <span className="text-destructive"> *</span>}
      </Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}