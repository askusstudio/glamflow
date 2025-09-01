import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Menu, Star } from 'lucide-react';

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

export default function HelpCenterPage() {
  return (
    <>
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 my-2"
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-1 bg-white/90 shadow-lg border-b border-white/20 rounded-2xl">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src="/logo-1.png"
              alt="GlamFlow Logo"
              className="h-14 w-auto object-contain"
            />
          </motion.div>
          <div className="hidden md:flex items-center gap-8 text-gray-600">
            {[
              { label: 'About', href: '/about', type: 'route' },
              { label: 'Pricing', href: '/pricing', type: 'route' },
              {
                label: 'Talk to Manno',
                href: 'https://kaya-eight.vercel.app/',
                external: true,
                type: 'external',
              },
              { label: 'Contact', href: '/contactpage', type: 'route' },
            ].map((item) =>
              item.external ? (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="relative font-medium transition-colors duration-300 hover:text-pink-600"
                  whileHover={{ y: -2 }}
                  rel="noopener noreferrer"
                  target="_blank"
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
              ) : item.type === 'route' ? (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -2 }}
                  className="relative"
                >
                  <Link
                    to={item.href}
                    className="font-medium transition-colors duration-300 hover:text-pink-600"
                  >
                    {item.label}
                    <motion.div
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-purple-600"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      style={{ originX: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ) : (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="relative font-medium transition-colors duration-300 hover:text-pink-600"
                  whileHover={{ y: -2 }}
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
              )
            )}
          </div>
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="hidden md:block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => (window.location.href = '/auth')}
              >
                Join Us
              </Button>
            </motion.div>
            <motion.div whileHover={{ rotate: 90 }}>
              <Menu className="md:hidden w-6 h-6 text-gray-600 cursor-pointer" />
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <div className="min-h-screen bg-white pb-16">
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-16 md:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-800 mb-6"
          >
            Help Center
          </motion.h1>
          <p className="text-lg text-gray-700 mb-10">How can we help you?</p>

          {/* Sections */}
          <section className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Getting Started
              </h2>
              <p className="text-gray-600 mb-4">
                Welcome to GlamFlow! This guide will help you set up your
                account and start managing your business effortlessly.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <b>How do I sign up?</b> Click the “Join Us” button and fill
                  out the registration form. You’ll receive a confirmation email
                  to activate your account.
                </li>
                <li>
                  <b>Can I try GlamFlow for free?</b> Yes! New users start with
                  a free trial. Explore features before upgrading.
                </li>
                <li>
                  <b>How do I add my services?</b> Once logged in, go to
                  “Services” in your dashboard to add, edit, or remove
                  offerings.
                </li>
                <li>
                  <b>How do I invite my team?</b> In “Settings,” use the “Team”
                  section to send invitations to coworkers or assistants.
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Booking & Scheduling
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <b>How do clients book appointments?</b> Share your booking
                  link or embed a widget on your website. Clients pick a time
                  and service, then confirm.
                </li>
                <li>
                  <b>Can I manage recurring appointments?</b> Yes! Set up repeat
                  bookings for regular clients directly from your calendar.
                </li>
                <li>
                  <b>How do I reschedule or cancel?</b> From the calendar, click
                  any appointment and choose your action—modify times, send
                  reminders, or cancel as needed.
                </li>
                <li>
                  <b>Is there a waitlist feature?</b> Not currently, but we’re
                  working on it! For now, you can note requests manually until
                  availability opens.
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Payments & Invoicing
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <b>How do I accept payments?</b> Integrate your preferred
                  payment gateway (like Stripe or Razorpay) for secure online
                  transactions.
                </li>
                <li>
                  <b>Can I send invoices?</b> Yes! After a service, send
                  professional invoices directly from GlamFlow via email.
                </li>
                <li>
                  <b>How do refunds work?</b> Initiate refunds from the booking
                  details. Processing times depend on your payment provider.
                </li>
                <li>
                  <b>Is my transaction data safe?</b> Absolutely. GlamFlow uses
                  industry-standard encryption and never stores your full
                  payment details.
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Clients & Communication
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <b>How do I add clients?</b> Clients can register themselves
                  via your booking page, or you can add them manually in the
                  “Clients” section.
                </li>
                <li>
                  <b>Can I send reminders and follow-ups?</b> Automate SMS and
                  email reminders for appointments, payments, and special
                  offers.
                </li>
                <li>
                  <b>How do I manage client notes?</b> Every client profile has
                  a notes section for service preferences, allergies, or special
                  requests.
                </li>
                <li>
                  <b>Can clients leave reviews?</b> Yes! After their
                  appointment, clients receive a feedback request to help you
                  grow your reputation.
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Troubleshooting
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <b>I forgot my password.</b> Click “Forgot Password” on the
                  login page and follow instructions to reset.
                </li>
                <li>
                  <b>The site is slow or not loading.</b> Clear your browser
                  cache, use a recent browser, and check your internet
                  connection. If the problem persists, contact support.
                </li>
                <li>
                  <b>My data is missing.</b> Check your filters and ensure
                  you’re logged into the correct account. If it’s still missing,
                  contact support immediately.
                </li>
                <li>
                  <b>I need more help.</b> Visit the{' '}
                  <a
                    href="/contactpage"
                    className="text-pink-600 underline hover:text-pink-700"
                  >
                    Contact
                  </a>{' '}
                  page, or email us at{' '}
                  <a
                    href="mailto:askusstudio@gmail.com"
                    className="text-pink-600 underline hover:text-pink-700"
                  >
                    askusstudio@gmail.com
                  </a>
                  .
                </li>
              </ul>
            </div>
          </section>
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
                  Empowering beauty freelancers with the tools they need to
                  build successful, sustainable businesses.
                </p>
                <div className="flex gap-4 mt-6">
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 hover:border-pink-500 hover:text-pink-500 transition-colors"
                  >
                    <Star className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 hover:border-pink-500 hover:text-pink-500 transition-colors"
                  >
                    <Star className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 hover:border-pink-500 hover:text-pink-500 transition-colors"
                  >
                    <Star className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 hover:border-pink-500 hover:text-pink-500 transition-colors"
                  >
                    <Star className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Column 2: Product Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Product
                </h3>
                <div className="space-y-3">
                  <a
                    href="#features"
                    className="block hover:text-pink-500 transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#pricing"
                    className="block hover:text-pink-500 transition-colors"
                  >
                    Pricing
                  </a>
                  <a
                    href="/security"
                    className="block hover:text-pink-500 transition-colors"
                  >
                    Security
                  </a>
                  <a
                    href="/updates"
                    className="block hover:text-pink-500 transition-colors"
                  >
                    Updates
                  </a>
                </div>
              </div>

              {/* Column 4: Support Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Support
                </h3>
                <div className="space-y-3">
                  <a
                    href="/help"
                    className="block hover:text-pink-500 transition-colors"
                  >
                    Help Center
                  </a>
                  <a
                    href="/contactpage"
                    className="block hover:text-pink-500 transition-colors"
                  >
                    Contact Us
                  </a>
                  <a
                    href="/termspage"
                    className="block hover:text-pink-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="/termspage"
                    className="block hover:text-pink-500 transition-colors"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>

            <hr className="my-8 border-gray-800" />

            <p className="text-center text-gray-500">
              © 2025 GlamFlow. All rights reserved. Built for beauty
              professionals. Powered by Aksus Studios.
            </p>
          </div>
        </AnimatedSection>
      </footer>
    </>
  );
}
