import { Activity, CheckCircle, AlertTriangle, XCircle, Cpu, HardDrive, Wifi, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const latencyData = [
  { time: "00:00", api: 45, db: 12, sync: 89 },
  { time: "04:00", api: 38, db: 10, sync: 72 },
  { time: "08:00", api: 62, db: 15, sync: 120 },
  { time: "12:00", api: 85, db: 22, sync: 145 },
  { time: "16:00", api: 55, db: 14, sync: 98 },
  { time: "20:00", api: 42, db: 11, sync: 76 },
  { time: "Now", api: 48, db: 13, sync: 82 },
];

const services = [
  { name: "API Gateway", status: "operational", uptime: 99.98, latency: 48 },
  { name: "Data Sync Engine", status: "operational", uptime: 99.95, latency: 82 },
  { name: "Workflow Engine", status: "operational", uptime: 99.99, latency: 23 },
  { name: "Auth Service", status: "operational", uptime: 100, latency: 15 },
  { name: "Queue Processor", status: "degraded", uptime: 99.7, latency: 156 },
  { name: "Webhook Delivery", status: "operational", uptime: 99.92, latency: 34 },
  { name: "File Storage", status: "operational", uptime: 99.99, latency: 28 },
  { name: "Cache Layer", status: "operational", uptime: 100, latency: 4 },
];

const statusIcon = (status: string) => {
  if (status === "operational") return <CheckCircle className="h-4 w-4 text-success" />;
  if (status === "degraded") return <AlertTriangle className="h-4 w-4 text-warning" />;
  return <XCircle className="h-4 w-4 text-destructive" />;
};

export default function SystemHealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
          System <em className="font-serif">Health</em>
        </h1>
        <p className="text-sm text-hierarchy-4 mt-1">Infrastructure monitoring & status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 text-hierarchy-4 text-xs mb-2"><Cpu className="h-4 w-4" /> CPU Usage</div>
          <p className="text-2xl font-medium text-hierarchy-1">34%</p>
          <Progress value={34} className="h-1.5 mt-2 bg-secondary [&>div]:bg-primary" />
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 text-hierarchy-4 text-xs mb-2"><HardDrive className="h-4 w-4" /> Memory</div>
          <p className="text-2xl font-medium text-hierarchy-1">6.2 GB</p>
          <Progress value={62} className="h-1.5 mt-2 bg-secondary [&>div]:bg-primary" />
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 text-hierarchy-4 text-xs mb-2"><Wifi className="h-4 w-4" /> Network I/O</div>
          <p className="text-2xl font-medium text-hierarchy-1">1.2 Gbps</p>
          <Progress value={24} className="h-1.5 mt-2 bg-secondary [&>div]:bg-primary" />
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 text-hierarchy-4 text-xs mb-2"><Clock className="h-4 w-4" /> Uptime</div>
          <p className="text-2xl font-medium text-hierarchy-1">99.97%</p>
          <p className="text-xs text-hierarchy-4 mt-2">42 days continuous</p>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-medium text-hierarchy-2 mb-4">Latency (ms)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={latencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
            <XAxis dataKey="time" stroke="hsl(0,0%,40%)" fontSize={11} />
            <YAxis stroke="hsl(0,0%,40%)" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 8, color: "hsl(0,0%,80%)", fontSize: 12 }} />
            <Line type="monotone" dataKey="api" stroke="hsl(153,55%,21%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="db" stroke="hsl(0,0%,50%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="sync" stroke="hsl(0,0%,70%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-6 mt-3">
          <span className="flex items-center gap-2 text-xs text-hierarchy-4"><span className="h-2 w-4 rounded bg-primary inline-block" /> API</span>
          <span className="flex items-center gap-2 text-xs text-hierarchy-4"><span className="h-2 w-4 rounded inline-block" style={{ backgroundColor: "hsl(0,0%,50%)" }} /> Database</span>
          <span className="flex items-center gap-2 text-xs text-hierarchy-4"><span className="h-2 w-4 rounded inline-block" style={{ backgroundColor: "hsl(0,0%,70%)" }} /> Sync</span>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-medium text-hierarchy-2 mb-4">Service Status</h3>
        <div className="space-y-3">
          {services.map((svc) => (
            <div key={svc.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                {statusIcon(svc.status)}
                <span className="text-sm text-hierarchy-2">{svc.name}</span>
              </div>
              <div className="flex items-center gap-6 text-xs text-hierarchy-4">
                <Badge variant="outline" className={`text-[10px] capitalize ${svc.status === "operational" ? "border-success/30 text-success" : "border-warning/30 text-warning"}`}>
                  {svc.status}
                </Badge>
                <span>{svc.uptime}% uptime</span>
                <span>{svc.latency}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
