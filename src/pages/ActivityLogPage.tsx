import { useState } from "react";
import { FileText, CheckCircle, AlertTriangle, Activity, Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  source: string;
  message: string;
  details?: string;
}

const logs: LogEntry[] = [
  { id: "1", timestamp: "2024-03-15 14:32:05", type: "success", source: "Data Sync", message: "Salesforce → HubSpot sync completed successfully", details: "3,400 records processed in 1m 42s" },
  { id: "2", timestamp: "2024-03-15 14:30:12", type: "info", source: "Workflow", message: "Lead Routing workflow triggered", details: "New lead: john@acme.com" },
  { id: "3", timestamp: "2024-03-15 14:28:45", type: "warning", source: "API Gateway", message: "Rate limit approaching for Slack connector", details: "Current: 850/1000 requests per minute" },
  { id: "4", timestamp: "2024-03-15 14:25:30", type: "success", source: "Automation", message: "Invoice reconciliation completed", details: "45 invoices matched" },
  { id: "5", timestamp: "2024-03-15 14:20:15", type: "error", source: "Data Sync", message: "Stripe → QuickBooks sync failed", details: "Connection timeout after 30s" },
  { id: "6", timestamp: "2024-03-15 14:18:00", type: "info", source: "System", message: "Scheduled backup initiated" },
  { id: "7", timestamp: "2024-03-15 14:15:22", type: "success", source: "Auth", message: "New API key generated: Production API v2" },
  { id: "8", timestamp: "2024-03-15 14:10:05", type: "info", source: "Team", message: "User j.smith@corp.com invited to workspace" },
  { id: "9", timestamp: "2024-03-15 14:05:44", type: "warning", source: "System", message: "Queue processor latency elevated", details: "Current: 156ms (threshold: 100ms)" },
  { id: "10", timestamp: "2024-03-15 14:00:00", type: "success", source: "Data Sync", message: "PostgreSQL → Salesforce sync completed", details: "5,600 records in 3m 12s" },
];

const typeIcon = (type: string) => {
  switch (type) {
    case "success": return <CheckCircle className="h-4 w-4 text-success" />;
    case "warning": return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "error": return <AlertTriangle className="h-4 w-4 text-destructive" />;
    default: return <Activity className="h-4 w-4 text-info" />;
  }
};

export default function ActivityLogPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = logs.filter((log) => {
    const matchSearch = log.message.toLowerCase().includes(search.toLowerCase()) || log.source.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || log.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
            Activity <em className="font-serif">Log</em>
          </h1>
          <p className="text-sm text-hierarchy-4 mt-1">System event timeline</p>
        </div>
        <Button size="sm" variant="outline" className="gap-2 border-border text-hierarchy-3">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hierarchy-4" />
          <Input placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-border text-hierarchy-2 placeholder:text-hierarchy-4" />
        </div>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {["all", "info", "success", "warning", "error"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs rounded-md capitalize transition-colors ${filterType === t ? "bg-primary text-primary-foreground" : "text-hierarchy-4 hover:text-hierarchy-2"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {filtered.map((log) => (
          <button
            key={log.id}
            onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
            className="w-full text-left glass-card p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {typeIcon(log.type)}
              <span className="text-[10px] text-hierarchy-4 font-mono w-36 shrink-0">{log.timestamp}</span>
              <Badge variant="outline" className="text-[10px] border-border text-hierarchy-4 shrink-0">{log.source}</Badge>
              <span className="text-sm text-hierarchy-2 truncate">{log.message}</span>
            </div>
            {expandedId === log.id && log.details && (
              <p className="text-xs text-hierarchy-4 mt-2 ml-7 pl-36">{log.details}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
