import { BarChart3 } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Network, GitBranch, RefreshCw, Zap, Users, Clock } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const weeklyData = [
  { week: "W1", syncs: 8200, workflows: 320, automations: 1200 },
  { week: "W2", syncs: 9100, workflows: 380, automations: 1450 },
  { week: "W3", syncs: 8800, workflows: 350, automations: 1380 },
  { week: "W4", syncs: 10200, workflows: 420, automations: 1600 },
];

const categoryData = [
  { name: "CRM Syncs", value: 42 },
  { name: "ERP Ops", value: 28 },
  { name: "Finance", value: 18 },
  { name: "Communication", value: 12 },
];

const COLORS = ["hsl(153,55%,21%)", "hsl(0,0%,35%)", "hsl(0,0%,50%)", "hsl(0,0%,65%)"];

const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  requests: Math.floor(Math.random() * 500 + 100),
}));

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
          Platform <em className="font-serif">Analytics</em>
        </h1>
        <p className="text-sm text-hierarchy-4 mt-1">Performance metrics & insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Syncs" value="36,300" change="↑ 14% this month" changeType="positive" icon={RefreshCw} />
        <MetricCard title="Workflows Run" value="1,470" change="↑ 8% this month" changeType="positive" icon={GitBranch} />
        <MetricCard title="Automations" value="5,630" change="↑ 22% this month" changeType="positive" icon={Zap} />
        <MetricCard title="Avg Latency" value="52ms" change="↓ 15% improvement" changeType="positive" icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-medium text-hierarchy-2 mb-4">Weekly Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
              <XAxis dataKey="week" stroke="hsl(0,0%,40%)" fontSize={11} />
              <YAxis stroke="hsl(0,0%,40%)" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 8, color: "hsl(0,0%,80%)", fontSize: 12 }} />
              <Bar dataKey="syncs" fill="hsl(153,55%,21%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="workflows" fill="hsl(0,0%,40%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="automations" fill="hsl(0,0%,60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-hierarchy-2 mb-4">By Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 8, color: "hsl(0,0%,80%)", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {categoryData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-hierarchy-3">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {item.name}
                </span>
                <span className="text-hierarchy-4">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-medium text-hierarchy-2 mb-4">24h Request Volume</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={hourlyActivity}>
            <defs>
              <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(153,55%,21%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(153,55%,21%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
            <XAxis dataKey="hour" stroke="hsl(0,0%,40%)" fontSize={10} interval={3} />
            <YAxis stroke="hsl(0,0%,40%)" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 8, color: "hsl(0,0%,80%)", fontSize: 12 }} />
            <Area type="monotone" dataKey="requests" stroke="hsl(153,55%,21%)" fill="url(#reqGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
