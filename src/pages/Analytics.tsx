import Navbar from "@/components/general/Navbar";

export default function AnalyticsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Analytics</h1>
        <p className="text-muted-foreground">Your analytics will appear here soon.</p>
      </div>
    </>
  );
}
