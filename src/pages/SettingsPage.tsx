import { useState } from "react";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("SynteraTek Inc.");
  const [timezone, setTimezone] = useState("UTC");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(true);
  const [syncAlerts, setSyncAlerts] = useState(true);
  const [autoRetry, setAutoRetry] = useState(true);
  const [retryCount, setRetryCount] = useState("3");
  const [logRetention, setLogRetention] = useState("30");
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.synteratek.com/events");
  const [twoFactor, setTwoFactor] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState(false);

  const save = () => toast.success("Settings saved successfully");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
          Platform <em className="font-serif">Settings</em>
        </h1>
        <p className="text-sm text-hierarchy-4 mt-1">Configure your workspace</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <TabsList className="bg-secondary border border-border w-fit sm:w-auto">
            <TabsTrigger value="general" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">General</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Notifications</TabsTrigger>
            <TabsTrigger value="sync" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sync & Data</TabsTrigger>
            <TabsTrigger value="security" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Security</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="space-y-4">
          <div className="glass-card p-4 sm:p-5 space-y-4">
            <h3 className="text-sm font-medium text-hierarchy-2">Organization</h3>
            <div className="space-y-3 max-w-md">
              <div><Label className="text-xs text-hierarchy-4">Organization Name</Label><Input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="mt-1 bg-secondary border-border text-sm text-hierarchy-2" /></div>
              <div><Label className="text-xs text-hierarchy-4">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="mt-1 bg-secondary border-border text-sm text-hierarchy-2"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="CET">Central European</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button onClick={save} className="w-full sm:w-auto gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="glass-card p-4 sm:p-5 space-y-4">
            <h3 className="text-sm font-medium text-hierarchy-2">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm text-hierarchy-2">Email Notifications</p><p className="text-xs text-hierarchy-4">Receive alerts via email</p></div><Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} className="shrink-0" /></div>
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm text-hierarchy-2">Slack Notifications</p><p className="text-xs text-hierarchy-4">Post alerts to Slack channels</p></div><Switch checked={slackNotifs} onCheckedChange={setSlackNotifs} className="shrink-0" /></div>
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm text-hierarchy-2">Sync Failure Alerts</p><p className="text-xs text-hierarchy-4">Immediate alerts on sync errors</p></div><Switch checked={syncAlerts} onCheckedChange={setSyncAlerts} className="shrink-0" /></div>
            </div>
          </div>
          <Button onClick={save} className="w-full sm:w-auto gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <div className="glass-card p-4 sm:p-5 space-y-4">
            <h3 className="text-sm font-medium text-hierarchy-2">Sync Configuration</h3>
            <div className="space-y-4 max-w-md">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm text-hierarchy-2">Auto-retry on failure</p><p className="text-xs text-hierarchy-4">Automatically retry failed syncs</p></div><Switch checked={autoRetry} onCheckedChange={setAutoRetry} className="shrink-0" /></div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="text-xs text-hierarchy-4 sm:w-32 shrink-0">Max Retry Count</Label>
                <Input type="number" value={retryCount} onChange={(e) => setRetryCount(e.target.value)} className="bg-secondary border-border text-sm text-hierarchy-2 w-full sm:w-24 h-9" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="text-xs text-hierarchy-4 sm:w-32 shrink-0">Log Retention (days)</Label>
                <Input type="number" value={logRetention} onChange={(e) => setLogRetention(e.target.value)} className="bg-secondary border-border text-sm text-hierarchy-2 w-full sm:w-24 h-9" />
              </div>
              <div><Label className="text-xs text-hierarchy-4">Webhook URL</Label><Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className="mt-1 bg-secondary border-border text-sm text-hierarchy-2" /></div>
            </div>
          </div>
          <Button onClick={save} className="w-full sm:w-auto gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="glass-card p-4 sm:p-5 space-y-4">
            <h3 className="text-sm font-medium text-hierarchy-2">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm text-hierarchy-2">Two-Factor Authentication</p><p className="text-xs text-hierarchy-4">Require 2FA for all team members</p></div><Switch checked={twoFactor} onCheckedChange={setTwoFactor} className="shrink-0" /></div>
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm text-hierarchy-2">IP Whitelist</p><p className="text-xs text-hierarchy-4">Restrict access to approved IPs only</p></div><Switch checked={ipWhitelist} onCheckedChange={setIpWhitelist} className="shrink-0" /></div>
            </div>
          </div>
          <Button onClick={save} className="w-full sm:w-auto gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
