import { useState } from "react";
import { FileText, Download, Calendar, Filter, TrendingUp, TrendingDown, BarChart3, PieChart as PieIcon, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 42000, cost: 18000 },
  { month: "Feb", revenue: 48000, cost: 19500 },
  { month: "Mar", revenue: 51000, cost: 20000 },
  { month: "Apr", revenue: 55000, cost: 21000 },
  { month: "May", revenue: 62000, cost: 22500 },
  { month: "Jun", revenue: 68000, cost: 23000 },
];

const integrationUsage = [
  { name: "Salesforce", calls: 125400, growth: 18 },
  { name: "HubSpot", calls: 98200, growth: 24 },
  { name: "QuickBooks", calls: 76800, growth: 12 },
  { name: "Slack", calls: 234500, growth: 8 },
  { name: "SAP", calls: 45600, growth: 32 },
  { name: "Jira", calls: 67300, growth: -5 },
];

const errorDistribution = [
  { name: "Rate Limit", value: 38 },
  { name: "Timeout", value: 25 },
  { name: "Auth Failed", value: 18 },
  { name: "Bad Request", value: 12 },
  { name: "Other", value: 7 },
];

const COLORS = ["hsl(153,55%,21%)", "hsl(0,0%,35%)", "hsl(0,0%,45%)", "hsl(0,0%,55%)", "hsl(0,0%,65%)"];

const savedReports = [
  { id: "1", name: "Monthly Integration Performance", type: "Performance", generated: "Mar 28, 2026", size: "2.4 MB", format: "PDF" },
  { id: "2", name: "Q1 Data Sync Audit Trail", type: "Compliance", generated: "Mar 25, 2026", size: "5.1 MB", format: "CSV" },
  { id: "3", name: "API Usage & Cost Analysis", type: "Financial", generated: "Mar 22, 2026", size: "1.8 MB", format: "PDF" },
  { id: "4", name: "Error Rate Breakdown - March", type: "Technical", generated: "Mar 20, 2026", size: "890 KB", format: "PDF" },
  { id: "5", name: "Team Activity Summary", type: "Operations", generated: "Mar 18, 2026", size: "1.2 MB", format: "XLSX" },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("6m");
  const { toast } = useToast();

  const downloadReport = (name: string) => {
    toast({ title: "Downloading...", description: `${name} is being prepared` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
            Platform <em className="font-serif">Reports</em>
          </h1>
          <p className="text-sm text-hierarchy-4 mt-1">Analytics, audits, and exportable insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 h-9 bg-secondary border-border text-hierarchy-2 text-xs">
              <Calendar className="h-3.5 w-3.5 mr-1" /><SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="gap-2 text-xs"><Filter className="h-3.5 w-3.5" /> Filters</Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total API Calls", value: "647,800", change: "+14.2%", up: true },
          { label: "Avg Response Time", value: "48ms", change: "-12.5%", up: true },
          { label: "Error Rate", value: "0.23%", change: "+0.02%", up: false },
          { label: "Cost Savings", value: "$34,200", change: "+28.1%", up: true },
        ].map((m) => (
          <div key={m.label} className="glass-card p-4">
            <p className="text-[10px] text-hierarchy-4 uppercase tracking-wider">{m.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-xl font-medium text-hierarchy-1 font-display">{m.value}</span>
              <span className={`text-[11px] flex items-center gap-0.5 ${m.up ? "text-primary" : "text-destructive"}`}>
                {m.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-medium text-hierarchy-2 mb-4 font-display">Revenue vs Cost</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(153,55%,21%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(153,55%,21%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
              <XAxis dataKey="month" stroke="hsl(0,0%,40%)" fontSize={11} />
              <YAxis stroke="hsl(0,0%,40%)" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 8, color: "hsl(0,0%,80%)", fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(153,55%,21%)" fill="url(#revGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="cost" stroke="hsl(0,0%,50%)" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Error distribution */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-hierarchy-2 mb-4 font-display">Error Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={errorDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {errorDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 8, color: "hsl(0,0%,80%)", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {errorDistribution.map((item, i) => (
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

      {/* Integration usage table */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-hierarchy-2 font-display">Integration Usage Ranking</h3>
          <Button size="sm" variant="ghost" className="text-xs text-hierarchy-4 gap-1"><ArrowUpRight className="h-3 w-3" /> Export</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Integration", "API Calls", "Growth", "Status"].map((h) => (
                  <th key={h} className="text-left text-[10px] text-hierarchy-4 uppercase tracking-wider font-display py-2 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {integrationUsage.map((item) => (
                <tr key={item.name} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-3 text-sm text-hierarchy-1">{item.name}</td>
                  <td className="py-3 px-3 text-sm text-hierarchy-2">{item.calls.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs flex items-center gap-1 ${item.growth >= 0 ? "text-primary" : "text-destructive"}`}>
                      {item.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {item.growth >= 0 ? "+" : ""}{item.growth}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Saved reports */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-hierarchy-2 font-display">Saved Reports</h3>
          <Button size="sm" className="gap-2 text-xs"><FileText className="h-3.5 w-3.5" /> Generate Report</Button>
        </div>
        <div className="space-y-2">
          {savedReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                  <FileText className="h-4 w-4 text-hierarchy-3" />
                </div>
                <div>
                  <p className="text-sm text-hierarchy-1">{report.name}</p>
                  <p className="text-[11px] text-hierarchy-4">{report.type} · {report.generated} · {report.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] border-border text-hierarchy-4">{report.format}</Badge>
                <button onClick={() => downloadReport(report.name)} className="p-2 rounded-md hover:bg-secondary text-hierarchy-4 hover:text-hierarchy-2 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
