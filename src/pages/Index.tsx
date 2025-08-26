import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroWomanModel from "@/assets/hero-woman-model.png";

export default function IndexPage() {
  const navigate = useNavigate();

  const handleAuthRedirect = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/20 bg-transparent backdrop-blur relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
            <span>𝒢</span>
          </div>
          <span className="font-semibold text-xl tracking-tight text-white">GlamFlow</span>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <a className="text-white/80 text-sm hover:text-white transition-colors" href="#features">Feature</a>
          <a className="text-white/80 text-sm hover:text-white transition-colors" href="#faq">FAQs</a>
          <a className="text-white/80 text-sm hover:text-white transition-colors" href="#pricing">Pricing</a>
          <a className="text-white/80 text-sm hover:text-white transition-colors" href="#about">About</a>
        </nav>
        <div className="flex gap-4 items-center">
          <Button className="px-6 bg-white text-purple-600 hover:bg-white/90" onClick={handleAuthRedirect}>JOIN US</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Make Your Make<br />
                Up Flawless.
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-lg">
                Beauty begins when you decide to be yourself. GlamFlow will assist you in giving a beautiful touch that will fill your happy day.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Button size="lg" className="w-48 bg-white text-purple-600 hover:bg-white/90 font-semibold" onClick={handleAuthRedirect}>
                  Start for free
                </Button>
                <Button size="lg" variant="outline" className="w-48 border-white text-white hover:bg-white/10">
                  Connect with Us
                </Button>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src={heroWomanModel}
                  alt="Professional makeup model"
                  className="w-full max-w-md lg:max-w-lg h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is GlamFlow Section */}
      <section className="flex flex-col md:items-center py-16 px-4 md:px-0 text-center space-y-6 max-w-2xl mx-auto relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold leading-snug text-white" id="about">
          What is GlamFlow?
        </h1>
        <p className="text-white/90 text-lg center">
          GlamFlow is an all-in-one salon and beauty business management platform designed for freelancers, independent makeup artists, personal trainers, spas, and salons. It helps you book more clients, manage appointments, collect payments, and grow your business online – all from a simple app or web dashboard.
        </p>
      </section>
    </div>
  );
}