import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white font-sans">
      {/* Navbar */}
      <header className="w-full fixed top-0 left-0 bg-white/70 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <div className="text-2xl font-extrabold tracking-wider">
            <span className="text-green-900">FINANCE</span>
            <span className="text-gray-700">.COM</span>
          </div>

          {/* Links */}
          <nav className="hidden md:flex space-x-10 text-gray-700 font-medium">
            <a href="#" className="hover:text-green-900 transition-colors">Home</a>
            <a href="#" className="hover:text-green-900 transition-colors">About Us</a>
            <a href="#" className="hover:text-green-900 transition-colors">Become Seller</a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex space-x-3">
            {/* <Button
              variant="outline"
              className="rounded-full px-6 py-2 border-gray-300 hover:border-green-900 hover:text-green-900 transition-colors"
            >
              Sign IN
            </Button> */}
            <Button
              className="rounded-full bg-green-900 text-white px-7 py-2 border border-green-900 hover:bg-yellow-400 hover:text-green-900 hover:border-yellow-400 hover:border-black transition-colors"
              onClick={() => window.location.href = "/auth"}
            >
              Join
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-700 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center px-6 gap-12">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
              Find the perfect freelance <br /> service for your business
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed">
              Connect with Expert Freelancers Worldwide for High-Quality, Affordable Solutions to All Your Project Needs
            </p>

            {/* Popular Tags */}
            <div className="flex flex-wrap items-center mt-6 gap-3 text-sm font-medium">
              <span className="text-gray-300">Popular:</span>
              <span className="bg-white text-green-900 px-4 py-1.5 rounded-full shadow-md hover:scale-105 transition-transform">Website Design</span>
              <span className="bg-gray-800 px-4 py-1.5 rounded-full hover:bg-gray-700 transition-colors">WordPress</span>
              <span className="bg-gray-800 px-4 py-1.5 rounded-full hover:bg-gray-700 transition-colors">Logo Design</span>
              <span className="bg-gray-800 px-4 py-1.5 rounded-full hover:bg-gray-700 transition-colors">UI/UX Design</span>
            </div>
          </div>

          {/* Right Side Hero Image */}
          <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center">
            <img
              src="/hero-img.png"
              alt="Freelancer working illustration"
              className="w-full h-full object-contain drop-shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
