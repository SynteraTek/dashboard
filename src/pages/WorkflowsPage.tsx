import { useState } from "react";
import { GitBranch, Play, Pause, Plus, Trash2, ChevronRight, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  trigger: string;
  steps: number;
  lastRun: string;
  runs: number;
  successRate: number;
}

const initialWorkflows: Workflow[] = [
  { id: "1", name: "Lead Routing", description: "Route new leads from CRM to sales team", status: "active", trigger: "New Lead Created", steps: 5, lastRun: "2 min ago", runs: 1234, successRate: 98.5 },
  { id: "2", name: "Invoice Sync", description: "Sync invoices between QuickBooks and ERP", status: "active", trigger: "Invoice Generated", steps: 3, lastRun: "15 min ago", runs: 892, successRate: 99.1 },
  { id: "3", name: "Onboarding Flow", description: "Automated employee onboarding across systems", status: "active", trigger: "New Employee Added", steps: 8, lastRun: "1 hr ago", runs: 156, successRate: 97.2 },
  { id: "4", name: "Support Escalation", description: "Escalate critical tickets to engineering", status: "paused", trigger: "Ticket Priority = Critical", steps: 4, lastRun: "3 hrs ago", runs: 445, successRate: 95.8 },
  { id: "5", name: "Data Backup", description: "Nightly backup of all synced records", status: "active", trigger: "Scheduled: 2:00 AM", steps: 2, lastRun: "8 hrs ago", runs: 365, successRate: 100 },
  { id: "6", name: "Report Generation", description: "Weekly performance reports to stakeholders", status: "draft", trigger: "Scheduled: Monday 9:00 AM", steps: 6, lastRun: "Never", runs: 0, successRate: 0 },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTrigger, setNewTrigger] = useState("");

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: w.status === "active" ? "paused" : "active" }
          : w
      )
    );
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
  };

  const addWorkflow = () => {
    if (!newName.trim()) return;
    const wf: Workflow = {
      id: String(Date.now()),
      name: newName,
      description: newDesc,
      status: "draft",
      trigger: newTrigger || "Manual",
      steps: 1,
      lastRun: "Never",
      runs: 0,
      successRate: 0,
    };
    setWorkflows((prev) => [...prev, wf]);
    setNewName("");
    setNewDesc("");
    setNewTrigger("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
            Workflow <em className="font-serif">Orchestration</em>
          </h1>
          <p className="text-sm text-hierarchy-4 mt-1">{workflows.filter((w) => w.status === "active").length} active workflows</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" /> New Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-hierarchy-1 font-display">Create Workflow</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              <Input placeholder="Workflow name" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-secondary border-border text-hierarchy-2" />
              <Input placeholder="Description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="bg-secondary border-border text-hierarchy-2" />
              <Select value={newTrigger} onValueChange={setNewTrigger}>
                <SelectTrigger className="bg-secondary border-border text-hierarchy-2">
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="schedule">Scheduled</SelectItem>
                  <SelectItem value="event">Event-based</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addWorkflow} className="w-full">Create Workflow</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {workflows.map((wf) => (
          <div key={wf.id} className="glass-card p-5 hover:glow-accent transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <GitBranch className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-hierarchy-1 truncate">{wf.name}</p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        wf.status === "active"
                          ? "border-success/30 text-success"
                          : wf.status === "paused"
                          ? "border-warning/30 text-warning"
                          : "border-muted-foreground/30 text-hierarchy-4"
                      }`}
                    >
                      {wf.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-hierarchy-4 mt-0.5 line-clamp-1">{wf.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start border-t sm:border-t-0 border-border/10 pt-2 sm:pt-0 mt-2 sm:mt-0">
                <button
                  onClick={() => toggleWorkflow(wf.id)}
                  className="p-2 rounded-md hover:bg-secondary text-hierarchy-3 hover:text-hierarchy-1 transition-colors"
                >
                  {wf.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => deleteWorkflow(wf.id)}
                  className="p-2 rounded-md hover:bg-secondary text-hierarchy-4 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-[10px] sm:text-xs text-hierarchy-4 pt-4 border-t border-border/5">
              <span className="flex items-center gap-1 min-w-fit"><ChevronRight className="h-3 w-3" /> {wf.trigger}</span>
              <span className="min-w-fit">{wf.steps} steps</span>
              <span className="flex items-center gap-1 min-w-fit"><Clock className="h-3 w-3" /> {wf.lastRun}</span>
              <span className="min-w-fit">{wf.runs.toLocaleString()} runs</span>
              {wf.successRate > 0 && (
                <span className="flex items-center gap-1 min-w-fit"><CheckCircle className="h-3 w-3 text-success" /> {wf.successRate}%</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
