import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScanSearch, CheckCircle, ShieldCheck, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const HistoryPage = () => {
  const { user } = useAuth();
  const [scans, setScans] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("scans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setScans(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Scan History</h1>
            <p className="text-muted-foreground">All your past plant scans.</p>
          </div>
          <Link to="/detect">
            <Button className="gap-2"><ScanSearch className="h-4 w-4" /> New Scan</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : scans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <ScanSearch className="mx-auto mb-3 h-12 w-12 opacity-50" />
              <p>No scans yet. Start by scanning your first plant!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scans.map((scan) => {
              const isHealthy = scan.disease_name === "Healthy";
              return (
                <Card
                  key={scan.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => setSelected(scan)}
                >
                  <CardContent className="p-0">
                    <img
                      src={scan.image_url}
                      alt="Plant scan"
                      className="h-48 w-full rounded-t-lg object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        {isHealthy ? (
                          <ShieldCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                        <p className="font-semibold">{scan.disease_name || "Unknown"}</p>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                        <span>{new Date(scan.created_at).toLocaleDateString()}</span>
                        {scan.confidence && <span>{scan.confidence}%</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Detail dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selected.disease_name === "Healthy" ? (
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    )}
                    {selected.disease_name}
                  </DialogTitle>
                </DialogHeader>
                <img src={selected.image_url} alt="Plant" className="max-h-60 w-full rounded-lg object-contain" />
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">Confidence: {selected.confidence}%</p>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="font-semibold mb-1">Description</p>
                    <p className="text-muted-foreground">{selected.description}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="font-semibold mb-1 flex items-center gap-1"><CheckCircle className="h-3 w-3 text-primary" /> Treatment</p>
                    <p className="text-muted-foreground">{selected.treatment}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="font-semibold mb-1 flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-primary" /> Prevention</p>
                    <p className="text-muted-foreground">{selected.prevention}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Scanned on {new Date(selected.created_at).toLocaleString()}
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default HistoryPage;
