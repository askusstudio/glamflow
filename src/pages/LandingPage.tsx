import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Users, X, Download, Menu, CreditCard, Mail, Phone, BarChart3, Shield, Clock, Image} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

// GLOBAL ANIMATION VARIANTS
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};

// REUSABLE ANIMATION COMPONENTS
const AnimatedSection = ({ children, className = "", id = "" }) => (
  <motion.section
    id={id}
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    transition={{ staggerChildren: 0.15 }}
  >
    {children}
  </motion.section>
);

const AnimatedItem = ({ children, className = "" }) => (
  <motion.div variants={itemVariants} className={className}>
    {children}
  </motion.div>
);

// OPTIMIZED UI COMPONENTS
const FloatingIcon = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={`absolute ${className}`}
    style={{ willChange: 'transform' }}
    animate={{ y: [0, -15, 0] }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const AppointmentCard = ({ name, service, time, color }) => (
  <motion.div
    className="flex items-center justify-between p-3 rounded-lg bg-white/90 shadow-sm mb-3"
    whileHover={{ scale: 1.02, y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
  >
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <div>
        <div className="font-medium text-gray-800 text-sm">{name}</div>
        <div className="text-gray-500 text-xs">{service}</div>
      </div>
    </div>
    <div className={`text-xs font-medium ${color.replace('bg-', 'text-')}`}>
      {time}
    </div>
  </motion.div>
);

// MAIN LANDING PAGE COMPONENT
export default function LandingPage() {

  const phoneVariants = {
    hidden: { x: 100, opacity: 0, scale: 0.95 },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, damping: 25, stiffness: 80, delay: 0.4 }
    }
  };

  const navVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 20, stiffness: 150 }
    }
  };

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    // FIX: Removed the `overflow-hidden` class from this div to enable scrolling
    <div className="min-h-screen relative" style={{ background: 'oklch(.969 .015 12.422)' }}>
      {/* Background Floating Elements */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <FloatingIcon className="top-20 left-10" delay={0}><div className="w-8 h-8 rounded-full opacity-20" style={{ background: 'oklch(.71 .117 11.638)' }}></div></FloatingIcon>
        <FloatingIcon className="top-40 right-20" delay={1}><div className="w-6 h-6 rounded-full opacity-30" style={{ background: 'oklch(.61 .117 11.638)' }}></div></FloatingIcon>
        <FloatingIcon className="bottom-32 left-20" delay={2}><div className="w-10 h-10 rounded-full opacity-25" style={{ background: 'oklch(.91 .117 11.638)' }}></div></FloatingIcon>
      </motion.div>

      {/* <div className="min-h-screen bg-white"> */}
      {/* Responsive Navigation */}
      <motion.nav className="fixed top-0 left-0 right-0 z-50 my-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-1 bg-white/90 shadow-lg border-b border-white/20 rounded-2xl">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Link to="/" className="flex items-center gap-2">
        <img src="/logo-1.png" alt="GlamFlow Logo" className="h-14 w-auto object-contain" />
      </Link>
          </motion.div>
          {/* Desktop Nav Menu */}
          <div className="hidden md:flex items-center gap-8 text-gray-600">
            {[
              { label: 'About', href: '/about' },
              // { label: 'Features', href: '#features' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Talk to Manno', href: 'https://kaya-eight.vercel.app/', external: true },
              { label: 'Contact', href: '/contactpage' },
            ].map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="relative font-medium transition-colors duration-300 hover:text-pink-600"
                whileHover={{ y: -2 }}
                rel={item.external ? 'noopener noreferrer' : ''}
              >
                {item.label}
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-purple-600"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="hidden md:block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = "/auth"}
              >
                Join Us
              </Button>
            </motion.div>
            <motion.div
              className="md:hidden"
              whileHover={{ rotate: 90 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 cursor-pointer" /> : <Menu className="w-6 h-6 cursor-pointer" />}
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu (Animated dropdown) */}
        <motion.div
          initial={{ opacity: 0, y: -20, display: 'none' }}
          animate={{
            opacity: mobileMenuOpen ? 1 : 0,
            y: mobileMenuOpen ? 0 : -20,
            display: mobileMenuOpen ? 'block' : 'none',
          }}
          className="absolute top-14 left-0 right-0 z-40 px-4 pb-4 pt-2 bg-white/95 rounded-b-2xl shadow-lg shadow-pink-100/40"
        >
          {[
            { label: 'About', href: '/about' },
            // { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Talk to Manno', href: 'https://kaya-eight.vercel.app/', external: true },
            { label: 'Contact', href: '/contactpage' },
          ].map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors"
              whileHover={{ x: 5 }}
              whileTap={{ opacity: 0.7 }}
              rel={item.external ? 'noopener noreferrer' : ''}
            >
              {item.label}
            </motion.a>
          ))}
        </motion.div>
      </motion.nav>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-4 md:px-8 lg:px-16 pt-24 md:pt-28 lg:pt-32 max-w-7xl mx-auto">
        <AnimatedSection className="flex-1 lg:pr-12 text-center lg:text-left">
          <AnimatedItem className="flex items-center justify-center lg:justify-start gap-2 mb-8">
            <Star className="w-5 h-5 text-pink-500" />
            <span className="text-rose-600 font-medium text-sm bg-rose-100 rounded-lg gap-3 px-2 py-1">Trusted by 10,000+ Beauty Professionals</span>
          </AnimatedItem>
          <AnimatedItem className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">Your Beauty</h1>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-4 leading-tight">Business,</h1>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">Simplified</h1>
          </AnimatedItem>
          <AnimatedItem><p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">GlamFlow is the all-in-one workflow app designed for beauty freelancers. Manage bookings, showcase your portfolio, and get paid seamlessly.</p></AnimatedItem>
          <AnimatedItem className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
              <Button
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-700 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = "/auth"}
              >
                <Download className="w-5 h-5 mr-2" />
                Get started →
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
              {/* <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-medium border-2 border-pink-200 hover:border-pink-300 text-pink-600 hover:bg-pink-50 transition-all duration-300">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button> */}
            </motion.div>
          </AnimatedItem>
        </AnimatedSection>

        <motion.div className="flex-1 flex justify-center lg:justify-end mt-12 lg:mt-0 relative" style={{ willChange: 'transform, opacity' }} variants={phoneVariants} initial="hidden" animate="visible">
        <div className="relative">
          <FloatingIcon className="-top-8 -left-8" delay={0.5}><div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"><Calendar className="w-6 h-6 text-white" /></div></FloatingIcon>
          <FloatingIcon className="top-20 -right-12" delay={1.5}><div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg"><Users className="w-5 h-5 text-white" /></div></FloatingIcon>
          <FloatingIcon className="-bottom-4 -left-12" delay={2.5}><div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"><Star className="w-7 h-7 text-white" /></div></FloatingIcon>
          <motion.div className="relative w-80 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
            <div className="w-full h-full bg-gradient-to-br from-pink-50 to-purple-50 rounded-[2.5rem] overflow-hidden relative">
              <div className="p-6">
                <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }}>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Good morning, Divya!</h2>
                  <p className="text-gray-600 text-sm flex items-center gap-2">You have 3 appointments today<div className="w-3 h-3 bg-pink-500 rounded-full"></div></p>
                </motion.div>

                {/* --- Added Section Starts Here --- */}
                <motion.div className="flex gap-4 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.6 }}>
                  <div className="flex-1 bg-white p-4 rounded-xl shadow-md">
                    <p className="text-2xl font-bold text-gray-800">₹22,450</p>
                    <p className="text-gray-500 text-sm">This Month</p>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-xl shadow-md">
                    <p className="text-2xl font-bold text-gray-800">28</p>
                    <p className="text-gray-500 text-sm">Appointments</p>
                  </div>
                </motion.div>
                <motion.h3 className="text-md font-semibold text-gray-700 mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35, duration: 0.6 }}>Today's Schedule</motion.h3>
                {/* --- Added Section Ends Here --- */}
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.6 }}>
                  <AppointmentCard name="Priya" service="Bridal Makeup" time="10:00 AM" color="bg-pink-500" />
                  <AppointmentCard name="jaya" service="Photoshoot Look" time="2:00 PM" color="bg-purple-500" />
                  <AppointmentCard name="Ayushi" service="Evening Glam" time="5:30 PM" color="bg-pink-400" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      </div>
      {/* About Section (Why GlamFlow?) */}
      <AnimatedSection className="py-20 px-4 bg-white" id="about">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Column: Content */}
            <div className="text-left">
              <AnimatedItem>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Why Choose GlamFlow?
                </h2>
              </AnimatedItem>

              <AnimatedItem>
                <p className="text-lg text-gray-600 mb-8">
                  Beauty professionals need more than talent—they need smart tools to manage their business.
                </p>
              </AnimatedItem>

              <AnimatedItem className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">GlamFlow is designed for:</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                      <span><b>Freelancers & Makeup Artists</b> – Manage clients, track payments, and grow your personal brand.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                      <span><b>Salons & Spas</b> – Handle staff schedules, billing, and loyalty programs.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                      <span><b>Wellness Professionals</b> – Automate bookings and keep clients engaged.</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Highlights:</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                      <span><b>Affordable Pricing:</b> Flexible plans for small businesses & freelancers.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                      <span><b>Smart Automation:</b> Reduce no-shows with auto reminders and payment links.</span>
                    </li>
                  </ul>
                </div>
              </AnimatedItem>
            </div>

            {/* Right Column: Image */}
            <AnimatedItem>
              <div className="relative w-full h-96">
                <img
                  src="/girt-pic.jpeg"
                  alt="GlamFlow dashboard preview"
                  className="w-full h-full object-cover rounded-3xl shadow-xl"
                />
              </div>
            </AnimatedItem>

          </div>
        </div>
      </AnimatedSection>
      {/* How It Works Section */}
      <AnimatedSection className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedItem className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How GlamFlow Transforms Your Beauty Business</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">From booking to payment, streamline every aspect of your freelance beauty business.</p>
          </AnimatedItem>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <AnimatedItem className="relative flex flex-col items-center text-center">
              <div className="absolute -top-8 right-0 md:right-4 text-8xl font-bold text-gray-100 z-0">01</div>
              <div className="relative z-10 w-24 h-24 bg-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg"><Users className="w-12 h-12 text-white" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Set Up Your Profile</h3>
              <p className="text-gray-600 leading-relaxed max-w-xs">Create your professional portfolio with stunning before/after photos and service offerings.</p>
            </AnimatedItem>
            <AnimatedItem className="relative flex flex-col items-center text-center">
              <div className="absolute -top-8 right-0 md:right-4 text-8xl font-bold text-gray-100 z-0">02</div>
              <div className="relative z-10 w-24 h-24 bg-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg"><Calendar className="w-12 h-12 text-white" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Manage Bookings</h3>
              <p className="text-gray-600 leading-relaxed max-w-xs">Let clients book appointments seamlessly while you control your availability.</p>
            </AnimatedItem>
            <AnimatedItem className="relative flex flex-col items-center text-center">
              <div className="absolute -top-8 right-0 md:right-4 text-8xl font-bold text-gray-100 z-0">03</div>
              <div className="relative z-10 w-24 h-24 bg-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg"><CreditCard className="w-12 h-12 text-white" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Paid Instantly</h3>
              <p className="text-gray-600 leading-relaxed max-w-xs">Secure payments processed automatically with detailed financial tracking.</p>
            </AnimatedItem>
          </div>
        </div>
      </AnimatedSection>

      {/* Features Section - Restored */}
      {/* Features Section - Restored & Updated */}
<AnimatedSection className="bg-gray-50 py-20 px-4 md:px-8 lg:px-16" id="features">
  <div className="max-w-7xl mx-auto">
    <AnimatedItem className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Everything You Need to</h2>
      <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-6">Grow Your Beauty Business</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">GlamFlow combines powerful business tools with an intuitive interface designed specifically for beauty professionals.</p>
    </AnimatedItem>

    {/* UPDATE: The grid is now dynamically generated from the `featuresData` array */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          title: "Smart Scheduling",
          description: "Automated booking system with calendar sync, availability management, and client reminders.",
          icon: <Calendar className="w-8 h-8 text-white" />,
          color: "from-pink-500 to-purple-600"
        },
        {
          title: "Client Management",
          description: "Comprehensive client profiles with service history, preferences, and communication tools.",
          icon: <Users className="w-8 h-8 text-white" />,
          color: "from-pink-500 to-purple-600"
        },
        {
          title: "Secure Payments",
          description: "Instant payment processing with multiple payment methods and automatic invoicing.",
          icon: <CreditCard className="w-8 h-8 text-white" />,
          color: "from-purple-500 to-blue-600"
        },
        {
          title: "Portfolio Showcase",
          description: "Beautiful gallery to display your work with before/after comparisons and client testimonials.",
          icon: <Image className="w-8 h-8 text-white" />,
          color: "from-blue-500 to-cyan-600"
        },
        {
          title: "Business Analytics",
          description: "Detailed insights into your earnings, popular services, and client retention metrics.",
          icon: <BarChart3 className="w-8 h-8 text-white" />,
          color: "from-indigo-500 to-purple-600"
        },
        {
          title: "Professional Protection",
          description: "Liability coverage, contract templates, and dispute resolution support for peace of mind.",
          icon: <Shield className="w-8 h-8 text-white" />,
          color: "from-green-500 to-teal-600"
        },
        {
          title: "Time Tracking",
          description: "Accurate service timing with automatic break calculations and overtime alerts.",
          icon: <Clock className="w-8 h-8 text-white" />,
          color: "from-yellow-500 to-orange-600"
        },
        {
          title: "Client Reviews",
          description: "Integrated review system to build your reputation and attract new clients organically.",
          icon: <Star className="w-8 h-8 text-white" />,
          color: "from-red-500 to-pink-600"
        },
      ].map((feature) => (
        <AnimatedItem key={feature.title}>
          <motion.div 
            className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-pink-200 h-full flex flex-col" 
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed flex-grow">{feature.description}</p>
          </motion.div>
        </AnimatedItem>
      ))}
    </div>
  </div>
</AnimatedSection>
      {/* Pricing Section */}
      <AnimatedSection className="py-20 px-4 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto">
          <AnimatedItem className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple Pricing for Every Beauty Professional.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan to grow with you. All plans come with a 14-day free trial.
            </p>
          </AnimatedItem>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Plan 1: Starter */}
            <AnimatedItem>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 h-full flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
                <p className="text-gray-500 mt-2">Ideal for freelancers starting out</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">₹0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="mt-8 space-y-4 text-gray-600 flex-grow">
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-pink-500" />
                    <span>50 bookings per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-pink-500" />
                    <span>Professional Invoicing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-pink-500" />
                    <span>Client Database</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-8 rounded-full py-6 text-lg font-medium border-2 border-pink-200 hover:border-pink-300 text-pink-600 hover:bg-pink-50 transition-all duration-300">
                  Choose Plan
                </Button>
              </div>
            </AnimatedItem>

            {/* Plan 2: Growth (Highlighted) */}
            <AnimatedItem>
              <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-2xl border-4 border-pink-500 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">MOST POPULAR</div>
                <h3 className="text-2xl font-bold text-white">Growth</h3>
                <p className="text-gray-400 mt-2">Perfect for small salons</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-white">₹999</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="mt-8 space-y-4 text-gray-300 flex-grow">
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-pink-400" />
                    <span>Unlimited bookings</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-pink-400" />
                    <span>Business Analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-pink-400" />
                    <span>Client Loyalty Tools</span>
                  </li>
                </ul>
                <Button className="w-full mt-8 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-pink-600 hover:to-purple-700 text-white rounded-full py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Choose Plan
                </Button>
              </div>
            </AnimatedItem>

            {/* Plan 3: Pro */}
            <AnimatedItem>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 h-full flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                <p className="text-gray-500 mt-2">For large salons & chains</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">₹1,999</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="mt-8 space-y-4 text-gray-600 flex-grow">
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-pink-500" />
                    <span>Multi-branch support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-pink-500" />
                    <span>Full Staff Management</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-pink-500" />
                    <span>Priority Support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-8 rounded-full py-6 text-lg font-medium border-2 border-pink-200 hover:border-pink-300 text-pink-600 hover:bg-pink-50 transition-all duration-300">
                  Choose Plan
                </Button>
              </div>
            </AnimatedItem>
          </div>

          <AnimatedItem className="text-center mt-16">
            <p className="text-lg text-gray-700">
              Start Your Free Trial – No Credit Card Required.
            </p>
          </AnimatedItem>
        </div>
      </AnimatedSection>
      {/* FAQ Section */}
      <AnimatedSection className="py-20 px-4 bg-gray-50" id="faq">
        <div className="max-w-4xl mx-auto">
          <AnimatedItem className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about GlamFlow and how it can help your business.
            </p>
          </AnimatedItem>

          <AnimatedItem>
            <div className="space-y-4">
              {/* Question 1 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800">What is GlamFlow?</h3>
                <p className="mt-2 text-gray-600">
                  GlamFlow is an all-in-one salon and beauty business management platform designed for freelancers, independent makeup artists, personal trainers, spas, and salons.
                </p>
              </div>

              {/* Question 2 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800">Why Choose GlamFlow?</h3>
                <p className="mt-2 text-gray-600">
                  Running a small beauty or wellness business comes with daily challenges:
                </p>
                <ul className="mt-3 list-disc list-inside space-y-2 text-gray-600">
                  <li>Time wasted on manual scheduling and payment tracking.</li>
                  <li>Lack of a professional online presence and marketing support.</li>
                </ul>
                <p className="mt-3 text-gray-600">
                  GlamFlow solves these problems by automating your operations and helping you scale without hiring extra staff. It’s built for freelancers and small businesses who want to compete with big brands.
                </p>
              </div>

              {/* Question 3 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800">How Does GlamFlow Work?</h3>
                <ol className="mt-3 list-decimal list-inside space-y-3 text-gray-600">
                  <li><b>Create your profile:</b> Add your services, prices, and availability.</li>
                  <li><b>Accept online bookings:</b> Share your booking page link on WhatsApp, Instagram, or your website.</li>
                  <li><b>Get automated reminders:</b> Reduce no-shows with SMS/WhatsApp notifications.</li>
                  <li><b>Track payments & packages:</b> Accept UPI/cards, manage memberships, and monitor revenue.</li>
                  <li><b>Market your business:</b> Use built-in tools like referral programs, loyalty points, and email/SMS promotions.</li>
                </ol>
                <p className="mt-3 text-gray-600">
                  Everything is accessible via mobile app or desktop dashboard, making it seamless for you and your clients.
                </p>
              </div>

              {/* Question 4 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800">Why Is GlamFlow Important for You?</h3>
                <ul className="mt-3 list-disc list-inside space-y-2 text-gray-600">
                  <li>Save hours of admin work.</li>
                  <li>Boost revenue by reducing missed appointments.</li>
                  <li>Build a strong digital presence with zero coding skills.</li>
                </ul>
              </div>

              {/* Question 5 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800">How Useful Is GlamFlow?</h3>
                <ul className="mt-3 list-disc list-inside space-y-2 text-gray-600">
                  <li>Automates bookings, payments, and marketing in one place.</li>
                  <li>Provides real-time business analytics (sales, clients, busiest hours).</li>
                  <li>Makes your business look professional and trustworthy online.</li>
                </ul>
              </div>
            </div>
          </AnimatedItem>
        </div>
      </AnimatedSection>
      {/* Contact Section */}
<AnimatedSection className="py-20 px-4 bg-white" id="contact">
  <div className="max-w-7xl mx-auto">
    <AnimatedItem className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Get In Touch
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Have questions or want to learn more? We'd love to hear from you.
      </p>
    </AnimatedItem>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      
      {/* Left Column: Contact Info */}
      <AnimatedItem className="space-y-8">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Contact Details</h3>
          <p className="text-gray-600 mb-6">
            Fill out the form, or if you prefer, you can reach us through the channels below. Our team will get back to you within 24 hours.
          </p>
          <div className="space-y-4">
            <a href="askusstudio@gmail.com" className="flex items-center gap-4 group">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="font-semibold text-gray-800">Email Us</span>
                <p className="text-gray-600 group-hover:text-pink-600 transition-colors">askusstudio@gmail.com</p>
              </div>
            </a>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="font-semibold text-gray-800">Call Us</span>
                <p className="text-gray-600">+91 8009227002
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedItem>

      {/* Right Column: Contact Form */}
      <AnimatedItem>
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <form action="#" method="POST" className="space-y-6">
                <div>
                    <label htmlFor="name" className="font-medium text-gray-700 sr-only">Your Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name"
                        placeholder="Your Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="font-medium text-gray-700 sr-only">Your Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email"
                        placeholder="Your Email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="font-medium text-gray-700 sr-only">Your Message</label>
                    <textarea 
                        name="message" 
                        id="message"
                        rows={5}
                        placeholder="Your Message"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                    ></textarea>
                </div>
                <div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-700 text-white rounded-full py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                        Send Message
                    </Button>
                </div>
            </form>
        </div>
      </AnimatedItem>

    </div>
  </div>
</AnimatedSection>
      {/* Call to Action Section */}
      <AnimatedSection className="py-20 px-4 md:px-8 lg:px-16 bg-pink-500 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <AnimatedItem className="mb-6">
            <Star className="w-16 h-16 text-white mx-auto mb-4" /> {/* Adjust size as needed */}
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Transform Your Beauty Business?
            </h2>
            <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
              Join thousands of beauty professionals who've already elevated their freelance careers with GlamFlow.
            </p>
          </AnimatedItem>

          <AnimatedItem className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
              <Button
                className="bg-white text-pink-600 hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = "/auth"}
              >
                Try GlamFlow App →
              </Button>
            </motion.div>
            {/* <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
        <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-medium border-2 border-white hover:border-gray-200 text-white hover:bg-white/10 transition-all duration-300">
          Watch Demo
        </Button>
      </motion.div> */}
          </AnimatedItem>
        </div>
      </AnimatedSection>

      
    </div>
  );
}