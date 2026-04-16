import { 
  LayoutDashboard, Network, GitBranch, RefreshCw, Zap, 
  Shield, Activity, Users, Bell, Settings, FileText, BarChart3,
  MessageSquare, ClipboardList, AlertTriangle, ScrollText, LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/logo";

const mainItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Integrations", url: "/integrations", icon: Network },
  { title: "Workflows", url: "/workflows", icon: GitBranch },
  { title: "Data Sync", url: "/data-sync", icon: RefreshCw },
  { title: "Automations", url: "/automations", icon: Zap },
  { title: "API Gateway", url: "/api-gateway", icon: Shield },
];

const monitorItems = [
  { title: "System Health", url: "/system-health", icon: Activity },
  { title: "Incidents", url: "/incidents", icon: AlertTriangle },
  { title: "Activity Log", url: "/activity-log", icon: FileText },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Reports", url: "/reports", icon: ClipboardList },
  { title: "Audit Trail", url: "/audit-trail", icon: ScrollText },
];

const manageItems = [
  { title: "Chat", url: "/chat", icon: MessageSquare },
  { title: "Team", url: "/team", icon: Users },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleSignOut = () => {
    signOut(() => navigate("/login"));
  };

  const onItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.firstName
    ? user.firstName[0].toUpperCase()
    : "ST";

  const displayName = user?.fullName || user?.firstName || "Admin User";
  const displayEmail = user?.primaryEmailAddress?.emailAddress || "admin@synteratek.com";

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-hierarchy-4 uppercase text-[10px] tracking-widest font-display">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  onClick={onItemClick}
                  className="text-hierarchy-3 hover:text-hierarchy-1 hover:bg-sidebar-accent transition-colors"
                  activeClassName="bg-primary/15 text-hierarchy-1 border-l-2 border-primary"
                >
                  <item.icon className="mr-2 h-4 w-4 shrink-0" />
                  {!collapsed && <span className="text-sm">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        {!collapsed && (
          <Logo iconOnly className="mx-auto" />
        )}
        {collapsed && (
          <div className="flex justify-center">
            <Logo iconOnly onClick={toggleSidebar} className="cursor-pointer" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="py-2">
        {renderGroup("Platform", mainItems)}
        {renderGroup("Monitor", monitorItems)}
        {renderGroup("Manage", manageItems)}
      </SidebarContent>
      <SidebarFooter className="p-3 border-t border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-medium">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-hierarchy-2 truncate">{displayName}</p>
              <p className="text-[10px] text-hierarchy-4 truncate">{displayEmail}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-md hover:bg-secondary text-hierarchy-4 hover:text-destructive transition-colors"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
