import { useState } from "react";
import { RefreshCw, CheckCircle, AlertCircle, Clock, Play, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SyncJob {
  id: string;
  source: string;
  destination: string;
  status: "syncing" | "completed" | "failed" | "queued";
  progress: number;
  records: number;
  startedAt: string;
  duration: string;
}

const initialJobs: SyncJob[] = [
  { id: "1", source: "Salesforce", destination: "HubSpot", status: "syncing", progress: 67, records: 3400, startedAt: "2 min ago", duration: "1m 42s" },
  { id: "2", source: "SAP ERP", destination: "PostgreSQL", status: "syncing", progress: 34, records: 12800, startedAt: "5 min ago", duration: "4m 12s" },
  { id: "3", source: "QuickBooks", destination: "Google Sheets", status: "completed", progress: 100, records: 890, startedAt: "12 min ago", duration: "2m 5s" },
  { id: "4", source: "Jira", destination: "Slack", status: "completed", progress: 100, records: 45, startedAt: "18 min ago", duration: "12s" },
  { id: "5", source: "Stripe", destination: "QuickBooks", status: "failed", progress: 45, records: 2300, startedAt: "25 min ago", duration: "3m 20s" },
  { id: "6", source: "PostgreSQL", destination: "Salesforce", status: "queued", progress: 0, records: 5600, startedAt: "Pending", duration: "—" },
  { id: "7", source: "HubSpot", destination: "Mailchimp", status: "completed", progress: 100, records: 1200, startedAt: "45 min ago", duration: "1m 8s" },
  { id: "8", source: "Google Sheets", destination: "SAP ERP", status: "completed", progress: 100, records: 320, startedAt: "1 hr ago", duration: "45s" },
];

export default function DataSyncPage() {
  const [jobs, setJobs] = useState(initialJobs);
  const [filter, setFilter] = useState<string>("all");

  const retryJob = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => j.id === id ? { ...j, status: "syncing" as const, progress: 0 } : j)
    );
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        setJobs((prev) =>
          prev.map((j) => j.id === id ? { ...j, status: "completed" as const, progress: 100 } : j)
        );
      } else {
        setJobs((prev) =>
          prev.map((j) => j.id === id ? { ...j, progress } : j)
        );
      }
    }, 500);
  };

  const triggerSync = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => j.id === id ? { ...j, status: "syncing" as const, progress: 10, startedAt: "Just now" } : j)
    );
  };

  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  const statusIcon = (status: string) => {
    switch (status) {
      case "syncing": return <RefreshCw className="h-4 w-4 text-info animate-spin" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-success" />;
      case "failed": return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "queued": return <Clock className="h-4 w-4 text-hierarchy-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
            Data <em className="font-serif">Synchronization</em>
          </h1>
          <p className="text-sm text-hierarchy-4 mt-1">{jobs.filter((j) => j.status === "syncing").length} syncs in progress</p>
        </div>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {["all", "syncing", "completed", "failed", "queued"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-md capitalize transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "text-hierarchy-4 hover:text-hierarchy-2"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((job) => (
          <div key={job.id} className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {statusIcon(job.status)}
                <div>
                  <p className="text-sm font-medium text-hierarchy-1">
                    {job.source} <span className="text-hierarchy-4 mx-2">→</span> {job.destination}
                  </p>
                  <p className="text-xs text-hierarchy-4 mt-0.5">{job.records.toLocaleString()} records · {job.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {job.status === "failed" && (
                  <Button size="sm" variant="outline" onClick={() => retryJob(job.id)} className="gap-1 text-xs border-border text-hierarchy-3">
                    <RefreshCw className="h-3 w-3" /> Retry
                  </Button>
                )}
                {job.status === "queued" && (
                  <Button size="sm" variant="outline" onClick={() => triggerSync(job.id)} className="gap-1 text-xs border-border text-hierarchy-3">
                    <Play className="h-3 w-3" /> Start
                  </Button>
                )}
                <Badge
                  variant="outline"
                  className={`text-[10px] capitalize ${
                    job.status === "syncing" ? "border-info/30 text-info" :
                    job.status === "completed" ? "border-success/30 text-success" :
                    job.status === "failed" ? "border-destructive/30 text-destructive" :
                    "border-muted-foreground/30 text-hierarchy-4"
                  }`}
                >
                  {job.status}
                </Badge>
              </div>
            </div>
            {(job.status === "syncing") && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-hierarchy-4 mb-1">
                  <span>Progress</span>
                  <span>{job.progress}%</span>
                </div>
                <Progress value={job.progress} className="h-1.5 bg-secondary [&>div]:bg-primary" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
