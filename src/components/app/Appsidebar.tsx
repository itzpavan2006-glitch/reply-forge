import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  LayoutTemplate,
  Sparkles,
  Plug,
  UsersRound,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

const main: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/crm", label: "CRM", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/generate", label: "Generate", icon: Sparkles },
];

const workspace: NavItem[] = [
  { to: "/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/team", label: "Team", icon: UsersRound },
  { to: "/integrations", label: "Integrations", icon: Plug },
];

export default function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (p: string) => pathname === p || pathname.startsWith(p + "/");

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item.to);
    return (
      <SidebarMenuItem key={item.to}>
        <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
          <NavLink
            to={item.to}
            className={cn(
              "flex items-center gap-3 rounded-xl transition-smooth",
              active && "bg-accent-soft text-accent font-medium"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="px-3 py-4">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-foreground text-background grid place-items-center font-display font-semibold shadow-soft">
            R
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-tight">
                ReplyForge
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Agency OS
              </span>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Main</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{main.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Workspace</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{workspace.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <NavLink to="/settings" className="flex items-center gap-3 rounded-xl">
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}