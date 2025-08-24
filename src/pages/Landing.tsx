// App.jsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-cyan-50 to-violet-50 font-sans antialiased">
      {/* Navbar */}
      <header className="w-full py-6 flex items-center justify-between px-8 bg-white shadow-sm">
        <div className="flex items-center gap-2 text-2xl font-bold text-pink-600">
          <span className="rounded-full bg-pink-100 p-2">💄</span>
          GlamManage
        </div>
        <nav className="flex gap-8 font-medium text-gray-700">
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="flex gap-3">
          <Button variant="ghost" className="text-pink-600">Sign in</Button>
          <Button className="bg-pink-600 hover:bg-pink-500">Register</Button>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        className="mx-auto max-w-4xl text-center py-24 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-5xl font-bold mb-4 text-gray-900 tracking-tight">
          Empower Your Beauty Business 
          <br />
          with Smart Work Management
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          All-in-one platform for makeup artists, salons, and freelancers. Manage appointments, clients, invoices and more — effortlessly.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Button size="lg" className="bg-pink-600 hover:bg-pink-500">Start Free Trial</Button>
          <Button size="lg" variant="outline" className="text-pink-600 border-pink-200 hover:bg-pink-50">Watch Demo</Button>
        </div>
      </motion.section>

      {/* Placeholder Dashboard Image */}
      <motion.div
        className="mx-auto max-w-5xl rounded-xl overflow-hidden shadow-xl my-12"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <img
          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80"
          alt="Dashboard Preview"
          style={{ width: '100%', height: '500px', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Features */}
      <motion.section
        id="features"
        className="mx-auto max-w-6xl py-16 px-6 grid md:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
        }}
      >
        {[
          {
            icon: '📅',
            title: 'Appointment Scheduling',
            desc: 'Easy, intuitive calendar for clients and artists.',
          },
          {
            icon: '🤝',
            title: 'Client Management',
            desc: 'Organize client info, preferences, and booking history.',
          },
          {
            icon: '💰',
            title: 'Payments & Invoices',
            desc: 'Generate, send, and track payments seamlessly.',
          },
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <span className="text-4xl mb-2 bg-pink-100 p-3 rounded-full inline-block">{feature.icon}</span>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">{feature.desc}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Solutions Section */}
      <motion.section
        id="solutions"
        className="mx-auto max-w-6xl py-16 px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Solutions for Beauty Professionals</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { title: 'For Freelance Makeup Artists', desc: 'Streamline bookings, track client preferences, and manage payments on the go.' },
            { title: 'For Hairstylists & Salons', desc: 'Coordinate team schedules, handle group appointments, and automate invoicing.' },
            { title: 'For Beauty Academies', desc: 'Manage classes, student progress, and enterprise-level integrations.' },
            { title: 'For Enterprise Teams', desc: 'Custom workflows, analytics, and scalability for large operations.' },
          ].map((solution, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-pink-600">{solution.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{solution.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section
        id="pricing"
        className="mx-auto max-w-6xl py-16 px-6 grid md:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 col-span-full">Pricing Plans</h2>
        {[
          {
            title: 'Basic',
            price: '₹499',
            desc: 'Perfect for individual freelancers starting out.',
            features: ['1 User', 'Basic Scheduling', 'Client Management', 'Email Support'],
          },
          {
            title: 'Team',
            price: '₹999',
            desc: 'For small teams up to 5 members.',
            features: ['Up to 5 Users', 'Advanced Scheduling', 'Payments & Invoices', 'Priority Support'],
          },
          {
            title: 'Academy/Enterprise',
            price: 'Custom',
            desc: 'Tailored for academies and large enterprises.',
            features: ['Unlimited Users', 'Custom Integrations', 'Analytics Dashboard', 'Dedicated Support'],
          },
        ].map((plan, i) => (
          <motion.div
            key={plan.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.title}</CardTitle>
                <p className="text-3xl font-bold text-pink-600 mt-2">{plan.price}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-center mb-6">{plan.desc}</CardDescription>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="text-gray-600">• {feature}</li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button className="w-full bg-pink-600 hover:bg-pink-500">Choose Plan</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="mx-auto max-w-6xl py-16 px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { quote: 'GlamManage transformed my freelance makeup business!', author: 'Priya S., Makeup Artist' },
            { quote: 'Easy scheduling and payments—highly recommend!', author: 'Rahul K., Hairstylist' },
            { quote: 'Perfect for our salon team management.', author: 'Aisha M., Salon Owner' },
          ].map((testimonial, i) => (
            <Card key={i}>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-pink-600">{testimonial.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        id="faq"
        className="mx-auto max-w-4xl py-16 px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: 'What is GlamManage?', a: 'An all-in-one work management platform for beauty freelancers like makeup artists and hairstylists.' },
            { q: 'Is there a free trial?', a: 'Yes, start with a 14-day free trial, no credit card required.' },
            { q: 'Can I integrate with other tools?', a: 'Yes, we support integrations with calendars, payment gateways, and more.' },
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-16 text-center bg-pink-50 mt-14"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-3 text-pink-600">Ready to transform your beauty business?</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">Sign up and get instant access. No credit card required.</p>
        <Button size="lg" className="bg-pink-600 hover:bg-pink-500">Get Started Free</Button>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-8">
        <div className="mx-auto max-w-6xl grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold mb-4">
              <span className="rounded-full bg-pink-600 p-2">💄</span>
              GlamManage
            </div>
            <p className="text-sm">Empowering beauty freelancers with smart tools.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-pink-300">Features</a></li>
              <li><a href="#solutions" className="hover:text-pink-300">Solutions</a></li>
              <li><a href="#pricing" className="hover:text-pink-300">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#faq" className="hover:text-pink-300">FAQ</a></li>
              <li><a href="#" className="hover:text-pink-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-pink-300">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-pink-300">Twitter</a></li>
              <li><a href="#" className="hover:text-pink-300">Instagram</a></li>
              <li><a href="#" className="hover:text-pink-300">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 text-sm">
          © 2025 GlamManage. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
