import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import EmailCheckModal from "@/components/EmailCheckModal";
import Features from "@/components/ui/Features";
import Pricing from "@/components/ui/Pricing";
import FAQs from "@/components/ui/Faqs";
import FooterSection from "@/components/ui/FooterSection";

export default function IndexPage() {
  const navigate = useNavigate();
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleAuthRedirect = () => {
    setShowEmailModal(true);
  };

  const handleEmailContinue = (email: string) => {
    // User doesn't exist, redirect to signup with email pre-filled
    navigate("/auth?email=" + encodeURIComponent(email) + "&mode=signup");
  };

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section with Navbar */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative"
      >
        {/* Navbar */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-between px-6 py-4 border-b border-white/20 bg-gradient-to-r from-violet-600/80 to-purple-600/80 backdrop-blur relative z-10"
        >
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
              <span>𝒢</span>
            </div>
            <span className="font-semibold text-xl tracking-tight text-white">GlamFlow</span>
          </motion.div>
          <motion.nav 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="hidden md:flex gap-8 items-center"
          >
            <a className="text-white/80 text-sm hover:text-white transition-colors" href="#features">Features</a>
            <a className="text-white/80 text-sm hover:text-white transition-colors" href="#faq">FAQs</a>
            <a className="text-white/80 text-sm hover:text-white transition-colors" href="#pricing">Pricing</a>
            <a className="text-white/80 text-sm hover:text-white transition-colors" href="#about">About</a>
          </motion.nav>
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-4 items-center"
          >
            <Button className="px-6 bg-white text-purple-600 hover:bg-white/90" onClick={handleAuthRedirect}>JOIN US</Button>
          </motion.div>
        </motion.header>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-8 text-center lg:text-left"
            >
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
              >
                Make Your Make<br />
                Up Flawless.
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-lg md:text-xl text-white/90 max-w-lg mx-auto lg:mx-0"
              >
                Beauty begins when you decide to be yourself. GlamFlow will assist you in giving a beautiful touch that will fill your happy day.
              </motion.p>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <Button size="lg" className="w-48 bg-white text-purple-600 hover:bg-white/90 font-semibold" onClick={handleAuthRedirect}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="w-48 border-white text-white hover:bg-white/10">
                  Connect with Us
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Right Image */}
            <motion.div 
              initial={{ x: 100, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <img
                  src="/hero-img.png"
                  alt="Professional makeup model"
                  className="w-full max-w-md lg:max-w-lg h-auto object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* What is GlamFlow Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 px-4 text-center max-w-7xl mx-auto"
        id="about"
      >
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold leading-snug mb-6"
        >
          What is GlamFlow?
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-muted-foreground text-lg max-w-4xl mx-auto"
        >
          GlamFlow is an all-in-one salon and beauty business management platform designed for freelancers, independent makeup artists, personal trainers, spas, and salons. It helps you book more clients, manage appointments, collect payments, and grow your business online – all from a simple app or web dashboard.
        </motion.p>
      </motion.section>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="features"
      >
        <Features />
      </motion.div>

      {/* Pricing Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="pricing"
      >
        <Pricing />
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="faq"
      >
        <FAQs />
      </motion.div>

      {/* Footer Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <FooterSection />
      </motion.div>

      <EmailCheckModal 
        isOpen={showEmailModal} 
        onClose={() => setShowEmailModal(false)}
        onContinue={handleEmailContinue}
      />
    </div>
  );
}