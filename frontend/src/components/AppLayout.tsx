import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Leaf, LayoutDashboard, ScanSearch, History, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/detect", label: "New Scan", icon: ScanSearch },
    { to: "/history", label: "History", icon: History },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Top navbar */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-foreground">Leaf Guard</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button
                  variant={isActive(item.to) ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button variant="ghost" size="sm" className="gap-2 ml-2" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>

          {/* Mobile toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="flex flex-col gap-1 border-t bg-card p-4 md:hidden">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={isActive(item.to) ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
};

export default AppLayout;
