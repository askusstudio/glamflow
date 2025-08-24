import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// For Vite+React, use a normal <img> tag
export default function LandingPage() {
  const navigate = useNavigate();

  const handleAuthRedirect = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] relative">
      {/* Top Fade Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />

      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-transparent backdrop-blur relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-white text-2xl font-bold">
            <span>𝒢</span>
          </div>
          <span className="font-semibold text-xl tracking-tight">GlamFlow</span>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <a className="text-muted-foreground text-sm hover:text-foreground" href="#">Feature</a>
          <a className="text-muted-foreground text-sm hover:text-foreground" href="#">Resources</a>
          <a className="text-muted-foreground text-sm hover:text-foreground" href="#">About</a>
          <a className="text-muted-foreground text-sm hover:text-foreground" href="#">Solutions</a>
        </nav>
        <div className="flex gap-4 items-center">
          {/* <Button variant="ghost" className="px-4">Sign In</Button> */}
          <Button className="px-6" onClick={handleAuthRedirect}>JOIN US</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:items-center py-16 px-4 md:px-0 text-center space-y-6 max-w-2xl mx-auto relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold leading-snug">
          Empower Your Work<br />
          with Smarter Solutions        </h1>
        <p className="text-muted-foreground text-lg">
          Smart solutions to hire, manage, and develop top talent seamlessly and efficiently in one intuitive platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Button size="lg" className="w-48" onClick={handleAuthRedirect}>Start for free</Button>
          <Button size="lg" variant="outline" className="w-48">Connect with Us</Button>
        </div>
      </section>

      {/* App Dashboard Image */}
      <section className="flex justify-center px-2 pb-12 relative z-10">
        <Card className="max-w-4xl w-full border shadow-lg bg-white/80">
          <CardContent className="p-0">
            <img
              src="/hero-img.png"
              alt="Product Dashboard"
              className="rounded-lg border-none shadow w-full"
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
