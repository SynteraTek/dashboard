import { useState } from "react";
import { AlertTriangle, CheckCircle, Clock, XCircle, Plus, ChevronDown, ChevronRight, ExternalLink, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Incident {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "investigating" | "identified" | "resolved";
  service: string;
  opened: string;
  updated: string;
  assignee: string;
  description: string;
  timeline: { time: string; event: string; user: string }[];
}

const initialIncidents: Incident[] = [
  {
    id: "INC-2847",
    title: "Queue Processor Latency Spike",
    severity: "high",
    status: "investigating",
    service: "Queue Processor",
    opened: "Mar 30, 2026 — 10:23 AM",
    updated: "12 min ago",
    assignee: "Sarah Chen",
    description: "Queue processing latency exceeded 200ms threshold. Affecting webhook delivery and async data sync operations.",
    timeline: [
      { time: "10:23 AM", event: "Alert triggered: Queue latency >200ms", user: "System" },
      { time: "10:25 AM", event: "Incident opened and assigned to on-call", user: "PagerDuty" },
      { time: "10:28 AM", event: "Investigating — reviewing queue depth metrics", user: "Sarah Chen" },
      { time: "10:35 AM", event: "Root cause identified: connection pool exhaustion on worker nodes", user: "Sarah Chen" },
    ],
  },
  {
    id: "INC-2846",
    title: "HubSpot API Rate Limit Exceeded",
    severity: "medium",
    status: "identified",
    service: "HubSpot Connector",
    opened: "Mar 29, 2026 — 3:45 PM",
    updated: "1 hr ago",
    assignee: "James Rodriguez",
    description: "HubSpot API returning 429 responses. Backoff strategy engaged but sync delays reported.",
    timeline: [
      { time: "3:45 PM", event: "Rate limit errors detected on HubSpot connector", user: "System" },
      { time: "3:50 PM", event: "Exponential backoff activated", user: "System" },
      { time: "4:10 PM", event: "Root cause: batch sync job running concurrently with real-time sync", user: "James Rodriguez" },
    ],
  },
  {
    id: "INC-2845",
    title: "Salesforce OAuth Token Refresh Failure",
    severity: "critical",
    status: "resolved",
    service: "Salesforce Connector",
    opened: "Mar 28, 2026 — 9:12 AM",
    updated: "Mar 28",
    assignee: "Emily Watson",
    description: "Salesforce integration stopped syncing due to OAuth token refresh failure. All dependent workflows halted.",
    timeline: [
      { time: "9:12 AM", event: "Salesforce sync failed — 401 Unauthorized", user: "System" },
      { time: "9:15 AM", event: "Incident escalated to P1", user: "System" },
      { time: "9:22 AM", event: "Token refresh endpoint returning 503", user: "Emily Watson" },
      { time: "9:45 AM", event: "Salesforce status page confirms outage", user: "Emily Watson" },
      { time: "11:30 AM", event: "Salesforce services restored, tokens refreshed", user: "System" },
      { time: "11:35 AM", event: "All syncs resumed, data backfill initiated", user: "Emily Watson" },
      { time: "12:00 PM", event: "Incident resolved — no data loss confirmed", user: "Emily Watson" },
    ],
  },
  {
    id: "INC-2844",
    title: "Scheduled Backup Timeout",
    severity: "low",
    status: "resolved",
    service: "Backup Service",
    opened: "Mar 27, 2026 — 2:00 AM",
    updated: "Mar 27",
    assignee: "Michael Park",
    description: "Nightly backup job timed out due to large dataset. Retry succeeded on second attempt.",
    timeline: [
      { time: "2:00 AM", event: "Backup job started", user: "Cron" },
      { time: "2:45 AM", event: "Job timed out after 45 min", user: "System" },
      { time: "3:00 AM", event: "Automatic retry initiated with extended timeout", user: "System" },
      { time: "3:38 AM", event: "Backup completed successfully", user: "System" },
    ],
  },
];

const severityColor: Record<string, string> = {
  critical: "border-destructive/40 text-destructive bg-destructive/10",
  high: "border-warning/40 text-warning bg-warning/10",
  medium: "border-info/40 text-info bg-info/10",
  low: "border-border text-hierarchy-4 bg-secondary",
};

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string }> = {
  open: { icon: XCircle, color: "text-destructive" },
  investigating: { icon: Clock, color: "text-warning" },
  identified: { icon: AlertTriangle, color: "text-info" },
  resolved: { icon: CheckCircle, color: "text-primary" },
};

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [expanded, setExpanded] = useState<string | null>("INC-2847");
  const [filter, setFilter] = useState("all");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSeverity, setNewSeverity] = useState("medium");
  const { toast } = useToast();

  const filtered = filter === "all" ? incidents : incidents.filter((i) => i.status === filter);

  const createIncident = () => {
    if (!newTitle.trim()) return;
    const inc: Incident = {
      id: `INC-${2848 + incidents.length}`,
      title: newTitle,
      severity: newSeverity as Incident["severity"],
      status: "open",
      service: "Manual Report",
      opened: "Just now",
      updated: "Just now",
      assignee: "Unassigned",
      description: newDesc || newTitle,
      timeline: [{ time: "Now", event: "Incident created manually", user: "Admin User" }],
    };
    setIncidents((prev) => [inc, ...prev]);
    setNewTitle("");
    setNewDesc("");
    toast({ title: "Incident created", description: `${inc.id} has been logged` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
            Incident <em className="font-serif">Management</em>
          </h1>
          <p className="text-sm text-hierarchy-4 mt-1">{incidents.filter((i) => i.status !== "resolved").length} active incidents</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 w-full sm:w-auto"><Plus className="h-4 w-4" /> Report Incident</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border w-[95vw] max-w-lg p-4 sm:p-6">
            <DialogHeader><DialogTitle className="text-hierarchy-1 font-display">Report New Incident</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-4">
              <Input placeholder="Incident title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-secondary border-border text-hierarchy-2" />
              <Textarea placeholder="Describe the issue..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="bg-secondary border-border text-hierarchy-2 min-h-[80px]" />
              <Select value={newSeverity} onValueChange={setNewSeverity}>
                <SelectTrigger className="bg-secondary border-border text-hierarchy-2"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={createIncident} className="w-full">Create Incident</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {["all", "open", "investigating", "identified", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs rounded-md capitalize transition-colors font-display shrink-0 ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-hierarchy-4 hover:text-hierarchy-2"}`}
          >
            {f === "all" ? `All (${incidents.length})` : `${f} (${incidents.filter((i) => i.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Incident list */}
      <div className="space-y-3">
        {filtered.map((inc) => {
          const StatusIcon = statusConfig[inc.status].icon;
          const isExpanded = expanded === inc.id;
          return (
            <div key={inc.id} className="glass-card overflow-hidden">
              <button
                onClick={() => setExpanded(isExpanded ? null : inc.id)}
                className="w-full flex items-start sm:items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <StatusIcon className={`h-5 w-5 shrink-0 mt-1 sm:mt-0 ${statusConfig[inc.status].color}`} />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] sm:text-xs text-hierarchy-4 font-mono">{inc.id}</span>
                      <Badge className={`text-[9px] sm:text-[10px] ${severityColor[inc.severity]}`}>{inc.severity}</Badge>
                    </div>
                    <p className="text-sm text-hierarchy-1 mt-0.5 font-medium leading-tight">{inc.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-hierarchy-3">{inc.assignee}</p>
                    <p className="text-[10px] text-hierarchy-4">Updated {inc.updated}</p>
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-hierarchy-4" /> : <ChevronRight className="h-4 w-4 text-hierarchy-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border/50 pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div><span className="text-hierarchy-4">Service:</span> <span className="text-hierarchy-2 ml-1">{inc.service}</span></div>
                    <div><span className="text-hierarchy-4">Opened:</span> <span className="text-hierarchy-2 ml-1">{inc.opened}</span></div>
                    <div><span className="text-hierarchy-4">Assignee:</span> <span className="text-hierarchy-2 ml-1">{inc.assignee}</span></div>
                  </div>
                  <p className="text-sm text-hierarchy-3 leading-relaxed">{inc.description}</p>

                  <div>
                    <h4 className="text-xs text-hierarchy-4 uppercase tracking-wider font-display mb-3">Timeline</h4>
                    <div className="space-y-3 relative">
                      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                      {inc.timeline.map((entry, i) => (
                        <div key={i} className="flex items-start gap-3 relative">
                          <div className="h-4 w-4 rounded-full bg-secondary border-2 border-border z-10 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm text-hierarchy-2">{entry.event}</p>
                            <p className="text-[10px] text-hierarchy-4">{entry.time} · {entry.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <Button size="sm" variant="outline" className="text-xs gap-1 h-8 flex-1 sm:flex-none"><MessageSquare className="h-3 w-3" /> Note</Button>
                    <Button size="sm" variant="outline" className="text-xs gap-1 h-8 flex-1 sm:flex-none"><ExternalLink className="h-3 w-3" /> Logs</Button>
                    {inc.status !== "resolved" && (
                      <Button size="sm" className="text-xs w-full sm:w-auto sm:ml-auto h-8" onClick={() => {
                        setIncidents((prev) => prev.map((i) => i.id === inc.id ? { ...i, status: "resolved", updated: "Just now", timeline: [...i.timeline, { time: "Now", event: "Incident resolved", user: "Admin User" }] } : i));
                        toast({ title: "Incident resolved", description: `${inc.id} marked as resolved` });
                      }}>
                        Resolve Incident
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
