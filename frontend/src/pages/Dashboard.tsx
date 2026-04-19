import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanSearch, Activity, Bug, Clock } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, diseases: 0 });
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .single();
      if (profile?.display_name) setDisplayName(profile.display_name);

      const { data: scans } = await supabase
        .from("scans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (scans) {
        setRecentScans(scans);
        setStats({
          total: scans.length,
          diseases: scans.filter((s) => s.disease_name && s.disease_name !== "Healthy").length,
        });
      }
    };

    fetchData();
  }, [user]);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {displayName || "Plant Lover"}! 🌿</h1>
            <p className="text-muted-foreground">Monitor your plants and detect diseases early.</p>
          </div>
          <Link to="/detect">
            <Button size="lg" className="gap-2">
              <ScanSearch className="h-5 w-5" />
              New Scan
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Activity, label: "Total Scans", value: stats.total, color: "text-primary" },
            { icon: Bug, label: "Diseases Found", value: stats.diseases, color: "text-destructive" },
            { icon: Clock, label: "Last Scan", value: recentScans[0] ? new Date(recentScans[0].created_at).toLocaleDateString() : "Never", color: "text-muted-foreground" },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Scans */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Scans</CardTitle>
            <Link to="/history">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentScans.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <ScanSearch className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p>No scans yet. Start by scanning your first plant!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="flex items-center gap-4 rounded-lg border p-3">
                    <img
                      src={scan.image_url}
                      alt="Plant scan"
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{scan.disease_name || "Analyzing..."}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {scan.confidence && (
                      <span className="text-sm font-medium text-primary">{scan.confidence}%</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
