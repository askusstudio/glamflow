import React from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Users, Play, Download, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Improved floating animation with better easing
const FloatingIcon = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{
      y: [0, -15, 0],
      rotate: [0, 3, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

const AppointmentCard = ({ name, service, time, color }) => (
  <motion.div
    className="flex items-center justify-between p-3 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm mb-3"
    whileHover={{ 
      scale: 1.02,
      y: -2,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
    }}
    transition={{ 
      duration: 0.3,
      ease: "easeOut"
    }}
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

export default function LandingPage() {
  // Improved animation variants with better timing and easing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15,
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 30, 
      opacity: 0,
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const phoneVariants = {
    hidden: { 
      x: 100, 
      opacity: 0,
      scale: 0.9,
      rotateY: 15
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 1,
        ease: "easeOut" as const,
        delay: 0.5
      }
    }
  };

  const navVariants = {
    hidden: { 
      y: -50, 
      opacity: 0,
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div
      className="min-h-screen overflow-hidden relative"
      style={{ background: 'oklch(.969 .015 12.422)' }}
    >
      {/* Animated Background Elements */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
      >
        <FloatingIcon className="top-20 left-10" delay={0}>
          <div className="w-8 h-8 rounded-full opacity-20" style={{ background: 'oklch(.71 .117 11.638)' }}></div>
        </FloatingIcon>
        <FloatingIcon className="top-40 right-20" delay={1}>
          <div className="w-6 h-6 rounded-full opacity-30" style={{ background: 'oklch(.61 .117 11.638)' }}></div>
        </FloatingIcon>
        <FloatingIcon className="bottom-32 left-20" delay={2}>
          <div className="w-10 h-10 rounded-full opacity-25" style={{ background: 'oklch(.91 .117 11.638)' }}></div>
        </FloatingIcon>
      </motion.div>

      {/* Navigation - Fixed with proper z-index and spacing */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-3 md:p-4 lg:p-5 bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Cell
          </span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8 text-gray-600">
          {['Features', 'How It Works', 'Testimonials', 'Pricing'].map((item, index) => (
            <motion.a 
              key={item}
              href="#" 
              className="relative font-medium transition-colors duration-300 hover:text-pink-600"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 * index }}
            >
              {item}
              <motion.div
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button className="hidden md:block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started →
            </Button>
          </motion.div>
          <motion.div 
            whileHover={{ rotate: 90 }} 
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.2, delay: 0.5 }}
          >
            <Menu className="md:hidden w-6 h-6 text-gray-600 cursor-pointer" />
          </motion.div>
        </div>
      </motion.nav>

      {/* Main Content - Added proper top padding to avoid navbar overlap */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-4 md:px-8 lg:px-16 py-8 lg:py-16 pt-24 md:pt-28 lg:pt-32 max-w-7xl mx-auto">
        {/* Left Content */}
        <motion.div 
          className="flex-1 lg:pr-12 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex items-center justify-center lg:justify-start gap-2 mb-8"
            variants={itemVariants}
          >
            <Star className="w-5 h-5 text-pink-500" />
            <span className="text-rose-600 font-medium text-sm bg-rose-100 rounded-lg gap-3 px-2 py-1">Trusted by 10,000+ Beauty Professionals</span>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Your Beauty
            </h1>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-4 leading-tight">
              Business,
            </h1>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Simplified
            </h1>
          </motion.div>

          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            variants={itemVariants}
          >
            Cell is the all-in-one workflow app designed specifically for beauty 
            and makeup freelancers. Manage bookings, showcase your 
            portfolio, and get paid seamlessly.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-pink-600 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                <Download className="w-5 h-5 mr-2" />
                Download Cell App →
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-medium border-2 border-pink-200 hover:border-pink-300 text-pink-600 hover:bg-pink-50 transition-all duration-300">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-600"
            variants={itemVariants}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                >
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </motion.div>
              ))}
              <span className="ml-2 font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>10,000+ Downloads</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Phone Mockup */}
        <motion.div 
          className="flex-1 flex justify-center lg:justify-end mt-12 lg:mt-0 relative"
          variants={phoneVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative">
            {/* Floating Icons around phone */}
            <FloatingIcon className="-top-8 -left-8" delay={0.5}>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </FloatingIcon>
            
            <FloatingIcon className="top-20 -right-12" delay={1.5}>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
            </FloatingIcon>

            <FloatingIcon className="-bottom-4 -left-12" delay={2.5}>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-7 h-7 text-white" />
              </div>
            </FloatingIcon>

            {/* Phone Container */}
            <motion.div 
              className="relative w-80 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl"
              whileHover={{ 
                scale: 1.02,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-pink-50 to-purple-50 rounded-[2.5rem] overflow-hidden relative">
                {/* Status Bar */}
                <div className="flex justify-between items-center p-4 text-sm font-medium text-gray-800">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 bg-gray-800 rounded-sm"></div>
                    <div className="w-6 h-2 bg-gray-800 rounded-sm"></div>
                  </div>
                </div>

                {/* App Content */}
                <div className="p-6">
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                  >
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Good morning, Sarah!</h2>
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                      You have 3 appointments today
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    </p>
                  </motion.div>

                  <motion.div 
                    className="grid grid-cols-2 gap-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7, duration: 0.6 }}
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
                      <div className="text-2xl font-bold text-gray-800">$2,450</div>
                      <div className="text-gray-600 text-xs">This Month</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
                      <div className="text-2xl font-bold text-gray-800">28</div>
                      <div className="text-gray-600 text-xs">Appointments</div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.9, duration: 0.6 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h3>
                    
                    <AppointmentCard
                      name="Emma Wilson"
                      service="Bridal Makeup"
                      time="10:00 AM"
                      color="bg-pink-500 text-pink-600"
                    />
                    
                    <AppointmentCard
                      name="Lisa Chen"
                      service="Photoshoot Look"
                      time="2:00 PM"
                      color="bg-purple-500 text-purple-600"
                    />
                    
                    <AppointmentCard
                      name="Maria Garcia"
                      service="Evening Glam"
                      time="5:30 PM"
                      color="bg-pink-400 text-pink-500"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div 
        className="bg-white py-20 px-4 md:px-8 lg:px-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to
            </h2>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Grow Your Beauty Business
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cell combines powerful business tools with an intuitive interface designed specifically for beauty professionals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Smart Scheduling */}
            <motion.div
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-pink-200"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <Calendar className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">
                Automated booking system with calendar sync, availability management, and client reminders
              </p>
            </motion.div>

            {/* Client Management */}
            <motion.div
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-pink-200"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <Users className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Client Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive client profiles with service history, preferences, and communication tools
              </p>
            </motion.div>

            {/* Secure Payments */}
            <motion.div
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-pink-200"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded"></div>
                </div>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Payments</h3>
              <p className="text-gray-600 leading-relaxed">
                Instant payment processing with multiple payment methods and automatic invoicing
              </p>
            </motion.div>

            {/* Portfolio Showcase */}
            <motion.div
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-pink-200"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-sm"></div>
                </div>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Portfolio Showcase</h3>
              <p className="text-gray-600 leading-relaxed">
                Beautiful gallery to display your work with before/after comparisons and client testimonials
              </p>
            </motion.div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Business Analytics */}
            <motion.div
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-pink-200"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <div className="w-8 h-8 flex flex-col gap-1 items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-1 h-3 bg-white rounded"></div>
                    <div className="w-1 h-4 bg-white rounded"></div>
                    <div className="w-1 h-2 bg-white rounded"></div>
                  </div>
                </div>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Business Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Detailed insights into your earnings, popular services, and client retention metrics
              </p>
            </motion.div>

            {/* Professional Protection */}
            <motion.div
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-pink-200"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-1 bg-white rounded"></div>
                  </div>
                </div>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Protection</h3>
              <p className="text-gray-600 leading-relaxed">
                Liability coverage, contract templates, and dispute resolution support for peace of mind
              </p>
            </motion.div>

            {/* Time Tracking */}
            <motion.div
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-pink-200"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center relative">
                  <div className="w-3 h-3 border-2 border-green-500 rounded-full"></div>
                  <div className="w-1 h-2 bg-green-500 absolute top-2 left-1/2 transform -translate-x-1/2 rounded"></div>
                </div>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Time Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Accurate service timing with automatic break calculations and overtime alerts
              </p>
            </motion.div>

            {/* Client Reviews */}
            <motion.div
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-pink-200"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-red-500 fill-current" />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Client Reviews</h3>
              <p className="text-gray-600 leading-relaxed">
                Integrated review system to build your reputation and attract new clients organically
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}