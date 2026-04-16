import { useState } from "react";
import { Users, Plus, Trash2, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "active" | "pending";
  lastActive: string;
}

const initialMembers: Member[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@synteratek.com", role: "Admin", status: "active", lastActive: "Just now" },
  { id: "2", name: "James Rodriguez", email: "james@synteratek.com", role: "Editor", status: "active", lastActive: "5 min ago" },
  { id: "3", name: "Emily Watson", email: "emily@synteratek.com", role: "Editor", status: "active", lastActive: "1 hr ago" },
  { id: "4", name: "Michael Park", email: "michael@synteratek.com", role: "Viewer", status: "active", lastActive: "3 hrs ago" },
  { id: "5", name: "Lisa Johnson", email: "lisa@corp.com", role: "Viewer", status: "pending", lastActive: "Invited" },
];

export default function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<string>("Viewer");

  const addMember = () => {
    if (!newEmail.trim()) return;
    setMembers((prev) => [...prev, {
      id: String(Date.now()), name: newName || newEmail.split("@")[0], email: newEmail, role: newRole as Member["role"], status: "pending", lastActive: "Invited"
    }]);
    setNewName(""); setNewEmail(""); setNewRole("Viewer");
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const changeRole = (id: string, role: string) => {
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, role: role as Member["role"] } : m));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
            Team <em className="font-serif">Management</em>
          </h1>
          <p className="text-sm text-hierarchy-4 mt-1">{members.length} members</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 w-full sm:w-auto"><Plus className="h-4 w-4" /> Invite Member</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="text-hierarchy-1 font-display">Invite Team Member</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-4">
              <Input placeholder="Full name" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-secondary border-border text-hierarchy-2" />
              <Input placeholder="Email address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="bg-secondary border-border text-hierarchy-2" />
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="bg-secondary border-border text-hierarchy-2"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addMember} className="w-full">Send Invitation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {members.map((member) => (
          <div key={member.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-secondary text-hierarchy-3 text-xs font-medium">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-hierarchy-1 truncate">{member.name}</p>
                  {member.status === "pending" && (
                    <Badge variant="outline" className="text-[10px] border-warning/30 text-warning h-4 px-1.5">Pending</Badge>
                  )}
                </div>
                <p className="text-xs text-hierarchy-4 flex items-center gap-1.5 truncate"><Mail className="h-3 w-3 shrink-0" /> {member.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/10 mt-1 sm:mt-0">
              <div className="sm:hidden text-[10px] text-hierarchy-4">
                Active: {member.lastActive}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-hierarchy-4 hidden sm:block">{member.lastActive}</span>
                <Select value={member.role} onValueChange={(v) => changeRole(member.id, v)}>
                  <SelectTrigger className="w-24 h-8 bg-secondary border-border text-hierarchy-3 text-[11px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <button onClick={() => removeMember(member.id)} className="p-2 rounded-md hover:bg-secondary text-hierarchy-4 hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
