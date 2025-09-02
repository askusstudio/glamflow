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


  return (
    <div className="min-h-screen bg-white">
      
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
    </div>
  );
}
