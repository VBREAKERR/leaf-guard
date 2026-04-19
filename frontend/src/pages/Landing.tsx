import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Upload, Cpu, FileCheck } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Leaf className="h-6 w-6 text-primary" />
            <span>Leaf Guard</span>
          </div>
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Leaf className="h-4 w-4" />
            AI-Powered Plant Disease Detection
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Keep Your Plants{" "}
            <span className="text-primary">Healthy</span> & Thriving
          </h1>
          <p className="mb-10 text-lg text-muted-foreground">
            Upload a photo of your plant and instantly detect diseases with AI. Get treatment recommendations and prevention tips to keep your garden flourishing.
          </p>
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Detecting — It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Upload, title: "Upload", desc: "Take a photo or upload an image of your plant leaf." },
              { icon: Cpu, title: "AI Analyzes", desc: "Our AI model scans the image to detect diseases in seconds." },
              { icon: FileCheck, title: "Get Results", desc: "Receive a diagnosis with treatment and prevention tips." },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center rounded-xl bg-card p-8 shadow-sm border">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="mb-1 text-sm font-semibold text-primary">Step {i + 1}</div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-12 text-3xl font-bold">Why Leaf Guard?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Instant AI Detection",
              "Treatment Recommendations",
              "Scan History & Tracking",
              "100% Free to Use",
            ].map((feature, i) => (
              <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
                <Leaf className="mx-auto mb-3 h-8 w-8 text-primary" />
                <h3 className="font-semibold">{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Leaf Guard. Built with ❤️ for healthy plants.</p>
      </footer>
    </div>
  );
};

export default Landing;
