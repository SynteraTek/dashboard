import { useState } from "react";
import { Network, CheckCircle, AlertCircle, Plus, Search, MoreVertical, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Integration {
  id: string;
  name: string;
  category: string;
  status: "connected" | "disconnected" | "error";
  enabled: boolean;
  lastSync: string;
  records: number;
}

const initialIntegrations: Integration[] = [
  { id: "1", name: "Salesforce CRM", category: "CRM", status: "connected", enabled: true, lastSync: "2 min ago", records: 12400 },
  { id: "2", name: "HubSpot", category: "CRM", status: "connected", enabled: true, lastSync: "5 min ago", records: 8900 },
  { id: "3", name: "SAP ERP", category: "ERP", status: "connected", enabled: true, lastSync: "12 min ago", records: 45200 },
  { id: "4", name: "QuickBooks", category: "Accounting", status: "connected", enabled: true, lastSync: "18 min ago", records: 6700 },
  { id: "5", name: "Slack", category: "Communication", status: "connected", enabled: true, lastSync: "1 min ago", records: 0 },
  { id: "6", name: "Microsoft Teams", category: "Communication", status: "disconnected", enabled: false, lastSync: "3 days ago", records: 0 },
  { id: "7", name: "Jira", category: "Project Management", status: "connected", enabled: true, lastSync: "8 min ago", records: 3200 },
  { id: "8", name: "Stripe", category: "Payments", status: "error", enabled: true, lastSync: "1 hr ago", records: 15800 },
  { id: "9", name: "PostgreSQL", category: "Database", status: "connected", enabled: true, lastSync: "Just now", records: 89000 },
  { id: "10", name: "Google Sheets", category: "Productivity", status: "connected", enabled: false, lastSync: "2 days ago", records: 450 },
];

const availableIntegrations = [
  { name: "Zendesk", category: "Support" },
  { name: "Mailchimp", category: "Marketing" },
  { name: "Shopify", category: "E-commerce" },
  { name: "Notion", category: "Productivity" },
  { name: "GitHub", category: "Development" },
  { name: "Twilio", category: "Communication" },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", ...new Set(integrations.map((i) => i.category))];

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, enabled: !i.enabled, status: !i.enabled ? "connected" : "disconnected" }
          : i
      )
    );
  };

  const addIntegration = (name: string, category: string) => {
    const newInt: Integration = {
      id: String(Date.now()),
      name,
      category,
      status: "connected",
      enabled: true,
      lastSync: "Just now",
      records: 0,
    };
    setIntegrations((prev) => [...prev, newInt]);
  };

  const filtered = integrations.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "All" || i.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
            Connected <em className="font-serif">Systems</em>
          </h1>
          <p className="text-sm text-hierarchy-4 mt-1">{integrations.filter((i) => i.enabled).length} active integrations</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-hierarchy-1 font-display">Add Integration</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {availableIntegrations.map((ai) => (
                <button
                  key={ai.name}
                  onClick={() => addIntegration(ai.name, ai.category)}
                  className="glass-card p-4 text-left hover:border-primary/50 transition-colors"
                >
                  <p className="text-sm text-hierarchy-1 font-medium">{ai.name}</p>
                  <p className="text-xs text-hierarchy-4 mt-1">{ai.category}</p>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hierarchy-4" />
          <Input
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-border text-hierarchy-2 placeholder:text-hierarchy-4"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-[10px] sm:text-xs rounded-md transition-colors ${
                filterCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-hierarchy-4 hover:text-hierarchy-2"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((integration) => (
          <div key={integration.id} className="glass-card p-5 hover:glow-accent transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Network className="h-5 w-5 text-hierarchy-3" />
                </div>
                <div>
                  <p className="text-sm font-medium text-hierarchy-1">{integration.name}</p>
                  <p className="text-xs text-hierarchy-4">{integration.category}</p>
                </div>
              </div>
              <Switch
                checked={integration.enabled}
                onCheckedChange={() => toggleIntegration(integration.id)}
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {integration.status === "connected" && (
                  <Badge variant="outline" className="border-success/30 text-success text-[10px] gap-1">
                    <CheckCircle className="h-3 w-3" /> Connected
                  </Badge>
                )}
                {integration.status === "disconnected" && (
                  <Badge variant="outline" className="border-muted-foreground/30 text-hierarchy-4 text-[10px]">
                    Disconnected
                  </Badge>
                )}
                {integration.status === "error" && (
                  <Badge variant="outline" className="border-destructive/30 text-destructive text-[10px] gap-1">
                    <AlertCircle className="h-3 w-3" /> Error
                  </Badge>
                )}
              </div>
              <p className="text-[10px] text-hierarchy-4">{integration.lastSync}</p>
            </div>
            {integration.records > 0 && (
              <p className="text-xs text-hierarchy-4 mt-2">{integration.records.toLocaleString()} records synced</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
