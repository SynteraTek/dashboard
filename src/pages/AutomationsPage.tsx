import { useState } from "react";
import { Zap, Plus, Trash2, Power, PowerOff, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  executions: number;
  lastTriggered: string;
}

const initialAutomations: Automation[] = [
  { id: "1", name: "Auto-assign leads", trigger: "New lead in Salesforce", action: "Assign to sales rep in HubSpot", enabled: true, executions: 3421, lastTriggered: "3 min ago" },
  { id: "2", name: "Slack alert on errors", trigger: "Sync failure detected", action: "Send alert to #ops-alerts", enabled: true, executions: 89, lastTriggered: "2 hrs ago" },
  { id: "3", name: "Invoice reconciliation", trigger: "New invoice in Stripe", action: "Create entry in QuickBooks", enabled: true, executions: 1567, lastTriggered: "15 min ago" },
  { id: "4", name: "Ticket escalation", trigger: "Jira ticket P1 created", action: "Page on-call engineer", enabled: true, executions: 34, lastTriggered: "1 day ago" },
  { id: "5", name: "Weekly report email", trigger: "Every Monday 9:00 AM", action: "Generate & email report", enabled: false, executions: 52, lastTriggered: "7 days ago" },
  { id: "6", name: "Data cleanup", trigger: "Daily at midnight", action: "Remove duplicate records", enabled: true, executions: 365, lastTriggered: "8 hrs ago" },
  { id: "7", name: "New user provisioning", trigger: "Employee added to HR system", action: "Create accounts in all systems", enabled: true, executions: 156, lastTriggered: "2 days ago" },
];

export default function AutomationsPage() {
  const [automations, setAutomations] = useState(initialAutomations);
  const [newName, setNewName] = useState("");
  const [newTrigger, setNewTrigger] = useState("");
  const [newAction, setNewAction] = useState("");

  const toggle = (id: string) => {
    setAutomations((prev) => prev.map((a) => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const remove = (id: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
  };

  const add = () => {
    if (!newName.trim()) return;
    setAutomations((prev) => [...prev, {
      id: String(Date.now()), name: newName, trigger: newTrigger || "Manual", action: newAction || "Log event", enabled: true, executions: 0, lastTriggered: "Never"
    }]);
    setNewName(""); setNewTrigger(""); setNewAction("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
            Automation <em className="font-serif">Rules</em>
          </h1>
          <p className="text-sm text-hierarchy-4 mt-1">{automations.filter((a) => a.enabled).length} active rules</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Rule</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="text-hierarchy-1 font-display">Create Automation</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-4">
              <Input placeholder="Rule name" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-secondary border-border text-hierarchy-2" />
              <Input placeholder="When this happens..." value={newTrigger} onChange={(e) => setNewTrigger(e.target.value)} className="bg-secondary border-border text-hierarchy-2" />
              <Input placeholder="Do this..." value={newAction} onChange={(e) => setNewAction(e.target.value)} className="bg-secondary border-border text-hierarchy-2" />
              <Button onClick={add} className="w-full">Create Rule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {automations.map((auto) => (
          <div key={auto.id} className="glass-card p-5 hover:glow-accent transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${auto.enabled ? "bg-primary/10" : "bg-secondary"}`}>
                  <Zap className={`h-5 w-5 ${auto.enabled ? "text-primary" : "text-hierarchy-4"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-hierarchy-1">{auto.name}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-hierarchy-4">
                    <span>{auto.trigger}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{auto.action}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={auto.enabled} onCheckedChange={() => toggle(auto.id)} />
                <button onClick={() => remove(auto.id)} className="p-2 rounded-md hover:bg-secondary text-hierarchy-4 hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-hierarchy-4">
              <span>{auto.executions.toLocaleString()} executions</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {auto.lastTriggered}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
