import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

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

const AnimatedItem = ({ children, className = "", highlight = false }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ type: "spring", stiffness: 100 }}
  >
    {children}
  </motion.div>
);

export default function PricingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    
    <AnimatedSection className="py-20 px-4 bg-white" id="pricing">
        <motion.nav className="fixed top-0 left-0 right-0 z-50 my-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-1 bg-white/90 shadow-lg border-b border-white/20 rounded-2xl">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <img src="/logo-1.png" alt="GlamFlow Logo" className="h-14 w-auto object-contain" />
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
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Talk to Manno', href: 'https://kaya-eight.vercel.app/', external: true },
            { label: 'Contact', href: '#contact' },
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


      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 mt-14">
            Simple Pricing for Every Beauty Professional.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan to grow with you. All plans come with a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Plan 1: Starter (left card) */}
          <AnimatedItem>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
              <p className="text-gray-500 mt-2">Ideal for freelancers starting out</p>
              <div className="mt-6">
                <span className="text-5xl font-bold text-gray-900">₹999</span>
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

          {/* Plan 2: Growth (middle card - highlighted) */}
          <AnimatedItem>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-pink-300 h-full flex flex-col transform md:scale-105 md:z-10">
              <h3 className="text-3xl font-bold text-gray-900 text-center mb-2">Most Popular</h3>
              <h3 className="text-2xl font-bold text-gray-900">Growth</h3>
              <p className="text-gray-500 mt-2">For established solo professionals</p>
              <div className="mt-6">
                <span className="text-5xl font-bold text-gray-900">₹2,499</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="mt-8 space-y-4 text-gray-600 flex-grow">
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-pink-500" />
                  <span>200 bookings per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-pink-500" />
                  <span>Professional Invoicing</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-pink-500" />
                  <span>Client Database</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-pink-500" />
                  <span>Automated Reminders</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-pink-500" />
                  <span>Basic Reporting</span>
                </li>
              </ul>
              <Button className="w-full mt-8 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Choose Plan
              </Button>
            </div>
          </AnimatedItem>

          {/* Plan 3: Pro (right card) */}
          <AnimatedItem>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
              <p className="text-gray-500 mt-2">For teams and scaling businesses</p>
              <div className="mt-6">
                <span className="text-5xl font-bold text-gray-900">₹4,999</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="mt-8 space-y-4 text-gray-600 flex-grow">
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-pink-500" />
                  <span>Unlimited bookings</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-pink-500" />
                  <span>Professional Invoicing</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-pink-500" />
                  <span>Client Database</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-pink-500" />
                  <span>Automated Reminders</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-pink-500" />
                  <span>Advanced Reporting</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-pink-500" />
                  <span>Team Management</span>
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
      </div>
    </AnimatedSection>
  );
}
