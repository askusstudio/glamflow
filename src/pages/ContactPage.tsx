import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Menu, X, Star } from 'lucide-react';

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
const ContactPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
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

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-16 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Contact Info */}
          <div className="space-y-10">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900">Contact Us</h1>
              <p className="text-lg text-gray-700 mb-8">
                We’re here to help you grow smarter, faster, and stress-free.<br />
                Whether you have questions about features, pricing, or just need a little guidance, our team is always ready to support you.
              </p>
            </div>
            <section>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-pink-500" />
                  <span>
                    <span className="font-medium">Phone/WhatsApp:</span>{' '}
                    <a href="tel:+918009227002" className="hover:text-pink-600 transition-colors">+91-8009227002</a>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-pink-500" />
                  <span>
                    <span className="font-medium">Email:</span>{' '}
                    <a href="mailto:askusstudio@gmail.com" className="hover:text-pink-600 transition-colors">askusstudio@gmail.com</a>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-pink-500" />
                  <span>
                    <span className="font-medium">Office Hours:</span> Monday – Saturday, 10:00 AM to 7:00 PM IST
                  </span>
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4">Office Address</h2>
              <div className="flex items-start gap-3 text-gray-800">
                <MapPin className="w-5 h-5 text-pink-500 mt-1" />
                <div>
                  <div className="font-medium">GlamFlow Headquarters</div>
                  <div>
                    L78, SECTOR D, LDA COLONY,<br />
                    LUCKNOW, 226012
                  </div>
                </div>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4">Connect With Us Online</h2>
              <p className="mb-3 text-gray-700">
                Follow GlamFlow on social media for updates, tips &amp; community stories:
              </p>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <span>
                    <span className="font-medium">Instagram:</span>{' '}
                    <a href="https://instagram.com/glamflow" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">@glamflow</a>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Linkedin className="w-5 h-5 text-pink-500" />
                  <span>
                    <span className="font-medium">LinkedIn:</span>{' '}
                    <a href="https://linkedin.com/company/glamflow" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">GlamFlow</a>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Facebook className="w-5 h-5 text-pink-500" />
                  <span>
                    <span className="font-medium">Facebook:</span>{' '}
                    <a href="https://facebook.com/glamflow" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">/glamflow</a>
                  </span>
                </li>
              </ul>
            </section>
          </div>
          {/* Right Column: Contact Form */}
          <div>
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
          </div>
        </div>
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
};

export default ContactPage;
