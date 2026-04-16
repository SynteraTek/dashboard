import { useState } from "react";
import { Shield, Key, Copy, Eye, EyeOff, Plus, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  created: string;
  lastUsed: string;
  calls: number;
  rateLimit: number;
  active: boolean;
}

const initialKeys: ApiKey[] = [
  { id: "1", name: "Production API", key: "sk_live_xxxxxxxxxxxxxxxxxxxx", permissions: ["read", "write"], created: "Jan 15, 2024", lastUsed: "Just now", calls: 124500, rateLimit: 1000, active: true },
  { id: "2", name: "Staging API", key: "sk_test_xxxxxxxxxxxxxxxxxxxx", permissions: ["read", "write"], created: "Feb 20, 2024", lastUsed: "2 hrs ago", calls: 45200, rateLimit: 500, active: true },
  { id: "3", name: "Read-Only Webhook", key: "sk_ro_xxxxxxxxxxxxxxxxxxxx", permissions: ["read"], created: "Mar 10, 2024", lastUsed: "5 min ago", calls: 89100, rateLimit: 2000, active: true },
  { id: "4", name: "Legacy Integration", key: "sk_legacy_xxxxxxxxxxxxxxxxxxxx", permissions: ["read"], created: "Nov 5, 2023", lastUsed: "30 days ago", calls: 12000, rateLimit: 100, active: false },
];

export default function ApiGatewayPage() {
  const [keys, setKeys] = useState(initialKeys);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newName, setNewName] = useState("");

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const revokeKey = (id: string) => {
    setKeys((prev) => prev.map((k) => k.id === id ? { ...k, active: false } : k));
    toast.success("API key revoked");
  };

  const addKey = () => {
    if (!newName.trim()) return;
    const key: ApiKey = {
      id: String(Date.now()),
      name: newName,
      key: `sk_live_${Math.random().toString(36).slice(2, 22)}`,
      permissions: ["read", "write"],
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastUsed: "Never",
      calls: 0,
      rateLimit: 1000,
      active: true,
    };
    setKeys((prev) => [...prev, key]);
    setNewName("");
    toast.success("New API key generated");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
            API <em className="font-serif">Gateway</em>
          </h1>
          <p className="text-sm text-hierarchy-4 mt-1">Manage API keys and access</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 w-full sm:w-auto"><Plus className="h-4 w-4" /> Generate Key</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="text-hierarchy-1 font-display">Generate API Key</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-4">
              <Input placeholder="Key name" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-secondary border-border text-hierarchy-2" />
              <Button onClick={addKey} className="w-full">Generate</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {keys.map((apiKey) => (
          <div key={apiKey.id} className={`glass-card p-5 ${!apiKey.active ? "opacity-60" : ""}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4 w-full">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-hierarchy-1">{apiKey.name}</p>
                    <Badge variant="outline" className={`text-[10px] ${apiKey.active ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}`}>
                      {apiKey.active ? "Active" : "Revoked"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 w-full">
                    <code className="text-[10px] sm:text-xs text-hierarchy-3 bg-secondary px-2 py-0.5 rounded font-mono truncate max-w-[140px] sm:max-w-none">
                      {visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.key.replace(/(.{7}).*/, "$1••••••••••••")}
                    </code>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => toggleVisibility(apiKey.id)} className="text-hierarchy-4 hover:text-hierarchy-2">
                        {visibleKeys.has(apiKey.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                      <button onClick={() => copyKey(apiKey.key)} className="text-hierarchy-4 hover:text-hierarchy-2">
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {apiKey.active && (
                <Button size="sm" variant="outline" onClick={() => revokeKey(apiKey.id)} className="border-border text-hierarchy-3 text-xs w-full sm:w-auto">
                  Revoke
                </Button>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-[10px] sm:text-xs text-hierarchy-4 pt-4 border-t border-border/5">
              <span className="flex items-center gap-1.5 min-w-fit">Created: {apiKey.created}</span>
              <span className="flex items-center gap-1.5 min-w-fit">Last used: {apiKey.lastUsed}</span>
              <span className="flex items-center gap-1.5 min-w-fit">{apiKey.calls.toLocaleString()} calls</span>
              <span className="flex items-center gap-1.5 min-w-fit">Rate: {apiKey.rateLimit}/min</span>
              <div className="flex gap-1 flex-wrap">
                {apiKey.permissions.map((p) => (
                  <Badge key={p} variant="outline" className="text-[9px] border-border text-hierarchy-4">{p}</Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
