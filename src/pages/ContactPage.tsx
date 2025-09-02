import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {  Star } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-white">
      
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
      
    </div>
  );
};

export default ContactPage;
