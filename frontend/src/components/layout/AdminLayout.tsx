import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { to: "/admin/messages", icon: Mail, label: "Messages" },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex h-full flex-col bg-[#111111] text-white">
      <div className="px-6 py-5">
        <h1 className="text-lg font-bold tracking-tight">Rasta Collections</h1>
        <p className="text-xs text-white/50">Admin Panel</p>
      </div>

      <Separator className="bg-white/10" />

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Separator className="bg-white/10" />

      <div className="px-3 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-white/60 hover:bg-white/5 hover:text-white"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 md:block">
        <SidebarContent />
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-14 items-center border-b bg-white px-4 md:px-6">
          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent onNavClick={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="ml-auto text-sm text-muted-foreground">
            Admin
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
