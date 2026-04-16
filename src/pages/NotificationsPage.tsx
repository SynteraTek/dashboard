import { useState } from "react";
import { Bell, CheckCheck, Trash2, AlertTriangle, CheckCircle, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: "1", title: "Sync Completed", message: "Salesforce → HubSpot synchronization finished with 3,400 records", type: "success", time: "2 min ago", read: false },
  { id: "2", title: "Rate Limit Warning", message: "Slack API approaching rate limit: 850/1000 requests per minute", type: "warning", time: "12 min ago", read: false },
  { id: "3", title: "Sync Failed", message: "Stripe → QuickBooks sync failed due to connection timeout", type: "error", time: "25 min ago", read: false },
  { id: "4", title: "Workflow Triggered", message: "Lead Routing workflow processed 15 new leads automatically", type: "info", time: "30 min ago", read: true },
  { id: "5", title: "New Team Member", message: "Lisa Johnson has been invited to the workspace", type: "info", time: "1 hr ago", read: true },
  { id: "6", title: "Automation Success", message: "Invoice reconciliation completed: 45 invoices matched", type: "success", time: "2 hrs ago", read: true },
  { id: "7", title: "System Update", message: "Platform update v2.4.1 deployed successfully", type: "info", time: "5 hrs ago", read: true },
  { id: "8", title: "Backup Complete", message: "Scheduled nightly backup finished — 89,000 records archived", type: "success", time: "8 hrs ago", read: true },
];

const typeIcon = (type: string) => {
  switch (type) {
    case "success": return <CheckCircle className="h-5 w-5 text-success" />;
    case "warning": return <AlertTriangle className="h-5 w-5 text-warning" />;
    case "error": return <AlertTriangle className="h-5 w-5 text-destructive" />;
    default: return <Activity className="h-5 w-5 text-info" />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
            <em className="font-serif">Notifications</em>
          </h1>
          <p className="text-sm text-hierarchy-4 mt-1">{unread} unread</p>
        </div>
        <Button size="sm" variant="outline" onClick={markAllRead} className="gap-2 border-border text-hierarchy-3">
          <CheckCheck className="h-4 w-4" /> Mark all read
        </Button>
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => (
          <div key={notif.id} className={`glass-card p-4 flex items-start gap-4 transition-colors ${!notif.read ? "border-primary/20 bg-primary/5" : ""}`}>
            <div className="mt-0.5">{typeIcon(notif.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-hierarchy-1">{notif.title}</p>
                {!notif.read && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <p className="text-sm text-hierarchy-3 mt-0.5">{notif.message}</p>
              <p className="text-xs text-hierarchy-4 mt-1">{notif.time}</p>
            </div>
            <button onClick={() => dismiss(notif.id)} className="p-1 rounded hover:bg-secondary text-hierarchy-4 hover:text-hierarchy-2 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
