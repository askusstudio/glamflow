import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';


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
export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Responsive Navigation */}
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

      {/* About Content */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-16 md:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800 mb-8"
        >
          About Us
        </motion.h1>
        <section className="mb-12">
          <p className="text-lg text-gray-700 mb-6">
            At <span className="font-semibold text-rose-600">GlamFlow</span>, we believe that every beauty, wellness, and fitness professional deserves the chance to grow without limits. Whether you are a freelance makeup artist, salon owner, spa therapist, fitness trainer, or wellness coach, managing your business shouldn’t be stressful.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            That’s why we built GlamFlow — a smart business management platform that makes it simple to handle appointments, clients, payments, promotions, and growth—all from one place.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <span>Our Vision</span>
            </h2>
            <p className="text-gray-600">
              To empower freelancers and small businesses in the beauty and wellness industry with tools that help them scale like world-class brands.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              We simplify business for creators, coaches, and professionals by combining technology with ease of use. With GlamFlow, you can focus on your passion while we handle the systems behind it.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">What Makes Us Different?</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2 mt-0.5 text-pink-500">●</span>
              <span>Designed specifically for beauty, salon, wellness, and fitness professionals.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-0.5 text-pink-500">●</span>
              <span>Affordable & scalable plans for every stage of your journey.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-0.5 text-pink-500">●</span>
              <span>Tools that don’t just manage your business—but help you grow it.</span>
            </li>
          </ul>
        </section>

        <section className="max-w-2xl mx-auto">
          <p className="text-lg font-medium text-gray-700">
            At <span className="font-bold">GlamFlow</span>, it’s not just about booking appointments or tracking payments. It’s about creating freedom, confidence, and growth for professionals who shape lives every day. Because when your business flows, your success shines.
          </p>
        </section>
      </div>
      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
        <AnimatedSection className="py-12 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

              {/* Column 1: Logo and Info */}
              <div className="md:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">GlamFlow</span>
                </div>
                <p className="mt-4 text-gray-400 max-w-md">
                  Empowering beauty freelancers with the tools they need to build successful, sustainable businesses.
                </p>
                <div className="flex gap-4 mt-6">
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 hover:border-pink-500 hover:text-pink-500 transition-colors">
                    <Star className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 hover:border-pink-500 hover:text-pink-500 transition-colors">
                    <Star className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 hover:border-pink-500 hover:text-pink-500 transition-colors">
                    <Star className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 hover:border-pink-500 hover:text-pink-500 transition-colors">
                    <Star className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Column 2: Product Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
                <div className="space-y-3">
                  <a href="#features" className="block hover:text-pink-500 transition-colors">Features</a>
                  <a href="#pricing" className="block hover:text-pink-500 transition-colors">Pricing</a>
                  <a href="/security" className="block hover:text-pink-500 transition-colors">Security</a>
                  <a href="/updates" className="block hover:text-pink-500 transition-colors">Updates</a>
                </div>
              </div>

              {/* Column 3: Company Links */}
              {/* <div>
                <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
                <div className="space-y-3">
                  <a href="/about" className="block hover:text-pink-500 transition-colors">About</a>
                  <a href="/blog" className="block hover:text-pink-500 transition-colors">Blog</a>
                  <a href="/careers" className="block hover:text-pink-500 transition-colors">Careers</a>
                </div>
              </div> */}

              {/* Column 4: Support Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
                <div className="space-y-3">
                  <a href="/help" className="block hover:text-pink-500 transition-colors">Help Center</a>
                  <a href="/contactpage" className="block hover:text-pink-500 transition-colors">Contact Us</a>
                  <a href="/termspage" className="block hover:text-pink-500 transition-colors">Privacy Policy</a>
                  <a href="/termspage" className="block hover:text-pink-500 transition-colors">Terms of Service</a>
                </div>
              </div>

            </div>

            <hr className="my-8 border-gray-800" />

            <p className="text-center text-gray-500">
              © 2025 GlamFlow. All rights reserved. Built for beauty professionals. Powered by Aksus Studios.
            </p>
          </div>
        </AnimatedSection>
      </footer>
    </div>
  );
}
