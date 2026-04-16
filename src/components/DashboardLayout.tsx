import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { 
  Bell, Search, Settings, LogOut, LayoutDashboard, 
  Network, GitBranch, RefreshCw, Zap, Shield, 
  Activity, AlertTriangle, FileText, BarChart3, 
  ClipboardList, ScrollText, MessageSquare, Users 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const searchItems = [
  { group: "Platform", items: [
    { title: "Overview", url: "/", icon: LayoutDashboard },
    { title: "Integrations", url: "/integrations", icon: Network },
    { title: "Workflows", url: "/workflows", icon: GitBranch },
    { title: "Data Sync", url: "/data-sync", icon: RefreshCw },
    { title: "Automations", url: "/automations", icon: Zap },
    { title: "API Gateway", url: "/api-gateway", icon: Shield },
  ]},
  { group: "Monitor", items: [
    { title: "System Health", url: "/system-health", icon: Activity },
    { title: "Incidents", url: "/incidents", icon: AlertTriangle },
    { title: "Activity Log", url: "/activity-log", icon: FileText },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Reports", url: "/reports", icon: ClipboardList },
    { title: "Audit Trail", url: "/audit-trail", icon: ScrollText },
  ]},
  { group: "Management", items: [
    { title: "Chat", url: "/chat", icon: MessageSquare },
    { title: "Team", url: "/team", icon: Users },
    { title: "Notifications", url: "/notifications", icon: Bell },
    { title: "Settings", url: "/settings", icon: Settings },
  ]}
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Scroll main container to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.firstName
    ? user.firstName[0].toUpperCase()
    : "ST";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-hierarchy-3 hover:text-hierarchy-1" />
              <div 
                onClick={() => setOpen(true)}
                className="relative hidden md:flex items-center w-72 h-8 bg-secondary border border-border rounded-md px-3 text-hierarchy-4 hover:border-primary/50 cursor-text transition-colors group"
              >
                <Search className="h-4 w-4 mr-2 text-hierarchy-4 group-hover:text-primary transition-colors" />
                <span className="text-sm">Search platform...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-hierarchy-4 opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/notifications")}
                className="relative p-2 rounded-md hover:bg-secondary text-hierarchy-3 hover:text-hierarchy-1 transition-colors"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 rounded-full bg-secondary overflow-hidden flex items-center justify-center text-hierarchy-3 text-xs font-medium border border-border hover:border-primary/30 transition-all">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                      <AvatarFallback className="bg-primary/20 text-primary font-medium text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-card border-border p-1" align="end" sideOffset={8}>
                  <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-hierarchy-1">{user?.fullName || "User"}</p>
                      <p className="text-xs leading-none text-hierarchy-4 truncate">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem 
                      onClick={() => navigate("/settings")}
                      className="text-hierarchy-2 hover:bg-secondary cursor-pointer focus:bg-secondary focus:text-hierarchy-1"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    onClick={() => signOut(() => navigate("/login"))}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList className="bg-card">
              <CommandEmpty>No results found.</CommandEmpty>
              {searchItems.map((group) => (
                <CommandGroup key={group.group} heading={group.group}>
                  {group.items.map((item) => (
                    <CommandItem
                      key={item.title}
                      onSelect={() => {
                        navigate(item.url);
                        setOpen(false);
                      }}
                      className="cursor-pointer hover:bg-secondary flex gap-2 items-center"
                    >
                      <item.icon className="h-4 w-4 text-primary" />
                      <span>{item.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </CommandDialog>
          <main ref={mainRef} className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
