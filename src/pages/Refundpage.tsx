import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

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

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-16 md:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800 mb-6"
        >
          Refund &amp; Cancellation Policy
        </motion.h1>
        <p className="text-lg text-gray-700 mb-10">
          At GlamFlow, we strive to provide the best possible experience for freelancers and businesses using our platform. Please read our Refund &amp; Cancellation Policy carefully.
        </p>
        <section className="space-y-8">
          {/* 1. Subscription Cancellations */}
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Subscription Cancellations
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                You may cancel your GlamFlow subscription at any time via your account dashboard or by contacting our support team.
                 if refund will approved it will be credited to the original payment method with in 5-7 days.
              </li>
              <li>
                Once cancelled, you will continue to have access until the end of your current billing cycle.
              </li>
            </ul>
          </div>
          {/* 2. Refund Eligibility */}
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Refund Eligibility
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <b>Monthly Subscriptions:</b> Non-refundable once billed.
              </li>
              <li>
                <b>Annual Subscriptions:</b> Refunds will be considered only if requested within 7 days of purchase.
              </li>
              <li>
                No partial refunds are provided for unused periods after cancellation.
              </li>
            </ul>
          </div>
          {/* 3. Trial Period */}
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Trial Period
            </h2>
            <p className="text-gray-700">
              If GlamFlow offers a free trial, you can cancel anytime before the trial ends to avoid charges.
            </p>
          </div>
          {/* 4. Exceptions */}
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Exceptions
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                Refunds will not be issued in cases of account suspension due to policy violations.
              </li>
              <li>
                Refunds will not be issued for technical issues caused by third-party apps or user error.
              </li>
            </ul>
          </div>
          {/* 5. How to Request a Refund */}
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. How to Request a Refund
            </h2>
            <p className="text-gray-700 mb-2">
              To request a cancellation or refund, please contact us at:
               for other inquiry contact askus studio
            </p>
            <ul className="pl-2 text-gray-700 space-y-1">
              <li>
                <span role="img" aria-label="email">📧</span> <a href="mailto:askusstudio@gmail.com" className="text-pink-600 underline hover:text-pink-700">askusstudio@gmail.com</a>
              </li>
              <li>
                <span role="img" aria-label="phone">📞</span> <a href="tel:+918009227002" className="text-pink-600 underline hover:text-pink-700">+91-8009227002</a>
              </li>
            </ul>
          </div>
        </section>
        <p className="mt-10 text-gray-500 text-sm">
          By subscribing to GlamFlow, you agree to this Refund &amp; Cancellation Policy.
        </p>
      </div>
    </div>
  );
}
