import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
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
  return (
    <>
    <AnimatedSection className="py-20 px-4 bg-white" id="pricing">
        

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

          {/* Plan 2: Growth (middle card - highlighted) */}
          <AnimatedItem>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-pink-300 h-full flex flex-col transform md:scale-105 md:z-10">
              <h3 className="text-3xl font-bold text-gray-900 text-center mb-2">Most Popular</h3>
              <h3 className="text-2xl font-bold text-gray-900">Growth</h3>
              <p className="text-gray-500 mt-2">For established solo professionals</p>
              <div className="mt-6">
                <span className="text-5xl font-bold text-gray-900">₹999</span>
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
                <span className="text-5xl font-bold text-gray-900">₹1,999</span>
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
    
    </>
    
    
    
  );
}
