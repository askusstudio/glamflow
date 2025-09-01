// TermsPage.tsx
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Menu, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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
export default function TermsPage() {
  return (
    <>
    {/* Navigation */}
    <motion.nav
        className="fixed top-0 left-0 right-0 z-50 my-2"
        // variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-1 bg-white/90 shadow-lg border-b border-white/20 rounded-2xl">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <img src="/logo-1.png" alt="GlamFlow Logo" className="h-14 w-auto object-contain" />
          </motion.div>
          <div className="hidden md:flex items-center gap-8 text-gray-600">
            {[
              { label: 'About', href: '/about', type: 'route' },
              // { label: 'Features', href: '#features', type: 'anchor' },
              { label: 'Pricing', href: '/pricing', type: 'route' },
              { label: 'Talk to Manno', href: 'https://kaya-eight.vercel.app/', external: true, type: 'external' },
              { label: 'Contact', href: '/contactpage', type: 'route' },
            ].map((item) => (
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
                    // onClick={e => handleNavClick(e, item)}
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
                  // onClick={e => handleNavClick(e, item)}
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
            <motion.div whileHover={{ rotate: 90 }}><Menu className="md:hidden w-6 h-6 text-gray-600 cursor-pointer" /></motion.div>
          </div>
        </div>
      </motion.nav>
    <div className="min-h-screen w-full bg-[#f8fafc] py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-12">Terms &amp; Conditions</h1>
        <section className="mb-8">
          <p className="text-lg text-gray-700 mb-4">
            Welcome to GlamFlow! By accessing or using our website, mobile app, or services, you agree to the following Terms &amp; Conditions. Please read them carefully before using GlamFlow.
          </p>
        </section>
        <section className="space-y-4 mb-8">
          <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
            <li>
              <span className="font-semibold text-gray-900">Acceptance of Terms</span>
              <p className="ml-4 mt-1">
                By visiting, registering, or using GlamFlow’s services, you agree to comply with these Terms. If you do not agree, please do not use our platform.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Services Provided</span>
              <p className="ml-4 mt-1">
                GlamFlow offers business management and automation tools designed for freelancers, coaches, consultants, and creative professionals. Features may include appointment booking, invoicing, client management, analytics, and other business growth tools.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Eligibility</span>
              <p className="ml-4 mt-1">
                You must be at least 18 years old to use GlamFlow services. By using our platform, you confirm that all information provided is true, accurate, and complete.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Account Registration</span>
              <ul className="list-disc list-inside ml-8 mt-1 space-y-1">
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                <li>You agree to notify GlamFlow immediately of any unauthorized access to your account.</li>
                <li>GlamFlow is not liable for losses due to your failure to safeguard login details.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Subscription &amp; Payments</span>
              <ul className="list-disc list-inside ml-8 mt-1 space-y-1">
                <li>GlamFlow services may be offered under different subscription plans.</li>
                <li>All payments are to be made securely via our integrated payment gateway.</li>
                <li>Subscriptions are billed either monthly or annually, depending on the plan you choose.</li>
                <li>Failure to make timely payments may result in suspension or termination of services.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Cancellation &amp; Refund Policy</span>
              <ul className="list-disc list-inside ml-8 mt-1 space-y-1">
                <li>You may cancel your subscription anytime through your account dashboard or by contacting support.</li>
                <li>Refunds will be processed in accordance with our Refund Policy.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-gray-900">User Responsibilities</span>
              <ul className="list-disc list-inside ml-8 mt-1 space-y-1">
                <li>You agree not to misuse GlamFlow services (e.g., spamming, hacking, distributing malicious content).</li>
                <li>You are solely responsible for the content and data you upload to GlamFlow.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Data Privacy</span>
              <p className="ml-4 mt-1">
                Your privacy is important to us. All personal information is handled in accordance with our Privacy Policy.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Intellectual Property</span>
              <ul className="list-disc list-inside ml-8 mt-1 space-y-1">
                <li>All content, branding, design, and technology on GlamFlow are owned by us.</li>
                <li>You may not reproduce, copy, or redistribute any part of the platform without written consent.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Termination of Services</span>
              <p className="ml-4 mt-1">
                GlamFlow reserves the right to suspend or terminate accounts found violating these Terms.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Limitation of Liability</span>
              <p className="ml-4 mt-1">
                GlamFlow is not liable for any indirect, incidental, or consequential damages arising from the use of our services.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Modifications</span>
              <p className="ml-4 mt-1">
                We may update these Terms &amp; Conditions from time to time. Updated terms will be effective immediately upon posting.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Contact Information</span>
              <div className="ml-4 mt-1 space-y-1">
                <div>
                  <span className="font-medium">📧 Email:</span> <a href="mailto:askusstudio@gmail.com" className="hover:text-pink-600 transition-colors">askusstudio@gmail.com</a>
                </div>
                <div>
                  <span className="font-medium">📞 Phone:</span> <a href="tel:+918009227002" className="hover:text-pink-600 transition-colors">+91-8009227002</a>
                </div>
              </div>
            </li>
          </ol>
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
    </>
  );
}
