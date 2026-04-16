import { useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import {
  Network, GitBranch, RefreshCw, Zap, Activity, AlertTriangle,
  CheckCircle, ArrowUpRight, ArrowDownRight, Clock
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const syncData = [
  { time: "00:00", syncs: 120, errors: 3 },
  { time: "04:00", syncs: 80, errors: 1 },
  { time: "08:00", syncs: 230, errors: 5 },
  { time: "12:00", syncs: 340, errors: 8 },
  { time: "16:00", syncs: 290, errors: 4 },
  { time: "20:00", syncs: 180, errors: 2 },
  { time: "Now", syncs: 260, errors: 3 },
];

const workflowData = [
  { name: "Mon", completed: 45, failed: 2 },
  { name: "Tue", completed: 52, failed: 3 },
  { name: "Wed", completed: 48, failed: 1 },
  { name: "Thu", completed: 61, failed: 4 },
  { name: "Fri", completed: 55, failed: 2 },
  { name: "Sat", completed: 30, failed: 1 },
  { name: "Sun", completed: 25, failed: 0 },
];

const systemPieData = [
  { name: "CRM", value: 35 },
  { name: "ERP", value: 25 },
  { name: "Comms", value: 20 },
  { name: "Analytics", value: 15 },
  { name: "Storage", value: 5 },
];

const PIE_COLORS = ["hsl(153,55%,21%)", "hsl(0,0%,30%)", "hsl(0,0%,40%)", "hsl(0,0%,50%)", "hsl(0,0%,60%)"];

const recentActivity = [
  { id: 1, action: "Salesforce → HubSpot sync completed", time: "2 min ago", status: "success" },
  { id: 2, action: "Workflow 'Lead Routing' triggered", time: "5 min ago", status: "success" },
  { id: 3, action: "API rate limit warning on Slack connector", time: "12 min ago", status: "warning" },
  { id: 4, action: "QuickBooks data reconciliation finished", time: "18 min ago", status: "success" },
  { id: 5, action: "New team member invited: j.smith@corp.com", time: "25 min ago", status: "info" },
  { id: 6, action: "Scheduled backup completed", time: "1 hr ago", status: "success" },
];

export default function OverviewPage() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
            Dashboard <em className="font-serif">Overview</em>
          </h1>
          <p className="text-sm text-hierarchy-4 mt-1">Real-time platform intelligence</p>
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          {(["24h", "7d", "30d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors font-display ${
                timeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "text-hierarchy-4 hover:text-hierarchy-2"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Integrations"
          value="24"
          change="↑ 3 this week"
          changeType="positive"
          icon={Network}
        />
        <MetricCard
          title="Workflows Running"
          value="18"
          change="↑ 12% vs last period"
          changeType="positive"
          icon={GitBranch}
        />
        <MetricCard
          title="Data Syncs Today"
          value="1,847"
          change="↓ 5% vs yesterday"
          changeType="negative"
          icon={RefreshCw}
        />
        <MetricCard
          title="Automations Fired"
          value="342"
          change="On track"
          changeType="neutral"
          icon={Zap}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-medium text-hierarchy-2 mb-4 font-display">Sync Activity</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={syncData}>
              <defs>
                <linearGradient id="syncGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(153,55%,21%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(153,55%,21%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
              <XAxis dataKey="time" stroke="hsl(0,0%,40%)" fontSize={11} />
              <YAxis stroke="hsl(0,0%,40%)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0,0%,10%)",
                  border: "1px solid hsl(0,0%,18%)",
                  borderRadius: 8,
                  color: "hsl(0,0%,80%)",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="syncs" stroke="hsl(153,55%,21%)" fill="url(#syncGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="errors" stroke="hsl(0,62%,50%)" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-hierarchy-2 mb-4 font-display">System Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={systemPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                {systemPieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0,0%,10%)",
                  border: "1px solid hsl(0,0%,18%)",
                  borderRadius: 8,
                  color: "hsl(0,0%,80%)",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {systemPieData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-xs text-hierarchy-3">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                {item.name} ({item.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-hierarchy-2 mb-4 font-display">Workflow Execution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={workflowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
              <XAxis dataKey="name" stroke="hsl(0,0%,40%)" fontSize={11} />
              <YAxis stroke="hsl(0,0%,40%)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0,0%,10%)",
                  border: "1px solid hsl(0,0%,18%)",
                  borderRadius: 8,
                  color: "hsl(0,0%,80%)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="completed" fill="hsl(153,55%,21%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="hsl(0,62%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-hierarchy-2 font-display">Recent Activity</h3>
            <button className="text-xs text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="mt-0.5">
                  {item.status === "success" && <CheckCircle className="h-4 w-4 text-success" />}
                  {item.status === "warning" && <AlertTriangle className="h-4 w-4 text-warning" />}
                  {item.status === "info" && <Activity className="h-4 w-4 text-info" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-hierarchy-2 truncate">{item.action}</p>
                  <p className="text-xs text-hierarchy-4 flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" /> {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
