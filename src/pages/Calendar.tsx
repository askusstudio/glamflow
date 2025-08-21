import Navbar from "@/components/general/Navbar";

export default function CalendarPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Calendar</h1>
        <p className="text-muted-foreground">Your Calendar will appear here soon.</p>
      </div>
    </>
  );
}
