import { useState } from "react";
import { Shield, Search, Filter, Download, User, Settings, Key, Database, GitBranch, Network, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: "auth" | "config" | "data" | "integration" | "team" | "api";
  resource: string;
  ip: string;
  details: string;
  risk: "low" | "medium" | "high";
}

const auditLog: AuditEntry[] = [
  { id: "AUD-9847", timestamp: "2026-03-30 10:42:15", user: "admin@synteratek.com", action: "api_key.regenerated", category: "api", resource: "API Key: prod-gateway-key", ip: "192.168.1.42", details: "Production API key regenerated. Old key invalidated.", risk: "high" },
  { id: "AUD-9846", timestamp: "2026-03-30 10:38:02", user: "sarah@synteratek.com", action: "integration.connected", category: "integration", resource: "Salesforce CRM", ip: "10.0.0.15", details: "New OAuth connection established with Salesforce production org.", risk: "medium" },
  { id: "AUD-9845", timestamp: "2026-03-30 10:22:44", user: "james@synteratek.com", action: "workflow.modified", category: "config", resource: "Workflow: Lead Routing v3", ip: "10.0.0.22", details: "Modified trigger conditions and added Slack notification step.", risk: "low" },
  { id: "AUD-9844", timestamp: "2026-03-30 09:58:31", user: "admin@synteratek.com", action: "team.role_changed", category: "team", resource: "User: michael@synteratek.com", ip: "192.168.1.42", details: "Role changed from Viewer to Editor.", risk: "medium" },
  { id: "AUD-9843", timestamp: "2026-03-30 09:45:12", user: "emily@synteratek.com", action: "data.export", category: "data", resource: "Integration Metrics - Q1 2026", ip: "10.0.0.18", details: "Exported 12,450 records as CSV file (2.4 MB).", risk: "medium" },
  { id: "AUD-9842", timestamp: "2026-03-30 09:30:00", user: "system", action: "backup.completed", category: "data", resource: "Full Database Backup", ip: "internal", details: "Automated backup completed. 847 MB compressed.", risk: "low" },
  { id: "AUD-9841", timestamp: "2026-03-30 09:15:22", user: "admin@synteratek.com", action: "auth.login", category: "auth", resource: "Admin Dashboard", ip: "192.168.1.42", details: "Successful login with MFA verification.", risk: "low" },
  { id: "AUD-9840", timestamp: "2026-03-30 08:55:18", user: "unknown", action: "auth.login_failed", category: "auth", resource: "Admin Dashboard", ip: "203.0.113.45", details: "Failed login attempt — invalid credentials. 3rd attempt from this IP.", risk: "high" },
  { id: "AUD-9839", timestamp: "2026-03-29 23:45:00", user: "system", action: "cert.renewed", category: "config", resource: "TLS Certificate", ip: "internal", details: "SSL certificate auto-renewed. Valid until Mar 29, 2027.", risk: "low" },
  { id: "AUD-9838", timestamp: "2026-03-29 22:10:33", user: "james@synteratek.com", action: "integration.disconnected", category: "integration", resource: "Legacy FTP Server", ip: "10.0.0.22", details: "FTP integration decommissioned as part of migration.", risk: "medium" },
  { id: "AUD-9837", timestamp: "2026-03-29 18:30:00", user: "admin@synteratek.com", action: "settings.updated", category: "config", resource: "Rate Limiting", ip: "192.168.1.42", details: "Global rate limit increased from 1000 to 2000 req/min.", risk: "high" },
  { id: "AUD-9836", timestamp: "2026-03-29 16:22:14", user: "sarah@synteratek.com", action: "data.sync_manual", category: "data", resource: "HubSpot → Salesforce", ip: "10.0.0.15", details: "Manual sync triggered for 2,340 contact records.", risk: "low" },
];

const categoryIcons: Record<string, typeof Shield> = {
  auth: Key,
  config: Settings,
  data: Database,
  integration: Network,
  team: User,
  api: Shield,
};

const riskColors: Record<string, string> = {
  low: "border-primary/30 text-primary",
  medium: "border-warning/30 text-warning",
  high: "border-destructive/30 text-destructive",
};

export default function AuditTrailPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const { toast } = useToast();

  const filtered = auditLog.filter((entry) => {
    const matchSearch = !search || entry.action.includes(search) || entry.user.includes(search) || entry.details.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || entry.category === categoryFilter;
    const matchRisk = riskFilter === "all" || entry.risk === riskFilter;
    return matchSearch && matchCategory && matchRisk;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
            Audit <em className="font-serif">Trail</em>
          </h1>
          <p className="text-sm text-hierarchy-4 mt-1">Complete security & compliance log</p>
        </div>
        <Button size="sm" variant="outline" className="gap-2 text-xs w-full sm:w-auto" onClick={() => toast({ title: "Exporting...", description: "Audit log export initiated" })}>
          <Download className="h-3.5 w-3.5" /> Export Log
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hierarchy-4" />
          <Input
            placeholder="Search actions, users, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-secondary border-border text-hierarchy-2 text-sm placeholder:text-hierarchy-4 w-full"
          />
        </div>
        <div className="flex items-center gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="flex-1 md:w-36 h-9 bg-secondary border-border text-hierarchy-2 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="config">Configuration</SelectItem>
              <SelectItem value="data">Data</SelectItem>
              <SelectItem value="integration">Integration</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="api">API</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="flex-1 md:w-28 h-9 bg-secondary border-border text-hierarchy-2 text-xs"><SelectValue placeholder="Risk" /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-[10px] text-hierarchy-4 uppercase tracking-wider">Total Events</p>
          <p className="text-xl font-medium text-hierarchy-1 font-display mt-1">{auditLog.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-[10px] text-hierarchy-4 uppercase tracking-wider">High Risk</p>
          <p className="text-xl font-medium text-destructive font-display mt-1">{auditLog.filter((e) => e.risk === "high").length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-[10px] text-hierarchy-4 uppercase tracking-wider">Failed Logins</p>
          <p className="text-xl font-medium text-warning font-display mt-1">{auditLog.filter((e) => e.action.includes("failed")).length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-[10px] text-hierarchy-4 uppercase tracking-wider">Users Active</p>
          <p className="text-xl font-medium text-hierarchy-1 font-display mt-1">{new Set(auditLog.map((e) => e.user)).size}</p>
        </div>
      </div>

      {/* Audit entries */}
      <div className="space-y-2">
        {filtered.map((entry) => {
          const Icon = categoryIcons[entry.category] || Shield;
          return (
            <div key={entry.id} className="glass-card p-4 hover:bg-secondary/20 transition-colors">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-hierarchy-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-hierarchy-4 font-mono">{entry.id}</span>
                    <Badge variant="outline" className={`text-[10px] capitalize ${riskColors[entry.risk]}`}>{entry.risk}</Badge>
                    <Badge variant="outline" className="text-[10px] border-border text-hierarchy-4 capitalize">{entry.category}</Badge>
                  </div>
                  <p className="text-sm text-hierarchy-1 mt-1 font-mono">{entry.action}</p>
                  <p className="text-xs text-hierarchy-3 mt-0.5">{entry.details}</p>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-[10px] text-hierarchy-4">
                    <span className="flex items-center gap-1.5 shrink-0"><User className="h-3 w-3" /> {entry.user}</span>
                    <span className="flex items-center gap-1.5 shrink-0"><Clock className="h-3 w-3" /> {entry.timestamp}</span>
                    <span className="shrink-0">IP: {entry.ip}</span>
                    <span className="text-hierarchy-4 line-clamp-1">{entry.resource}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
