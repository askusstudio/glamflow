import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Features from "@/components/ui/Features";
import Pricing from "@/components/ui/Pricing";
import Faq from "@/components/ui/Faqs";
import ContentSection from "@/components/ui/ContentSection";
import ContentSectionApp from "@/components/ui/ContentSectionApp";
import Footer from "@/components/ui/FooterSection";
import Navbar from "@/components/ui/Navbar";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleAuthRedirect = () => {
    navigate("/auth");
  };

  // Animation variants for fade-in and slide effects
  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <div className="w-full bg-white min-h-screen flex flex-col">
      {/* Navbar with fade-in animation */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        viewport={{ once: true }}
      >
        <Navbar />
      </motion.div>

      {/* Hero section with staggered animations */}
      <motion.section
        className="relative flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-100 to-pink-100 overflow-hidden"
        style={{ color: "#fff" }}
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-0 relative z-10">
          {/* Text column with slide-in from left */}
          <motion.div
            className="w-full md:w-1/2 flex flex-col justify-center items-start space-y-6 py-10 md:pl-10"
            variants={fadeInLeft}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold leading-snug text-gray-800"
              variants={fadeInLeft}
            >
              Empower Your Work<br />
              with Smarter Solutions
            </motion.h1>
            <motion.p
              className="text-base md:text-lg text-gray-600"
              variants={fadeInLeft}
            >
              Smart solutions to hire, manage, and develop top talent seamlessly and efficiently in one intuitive platform.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-3"
              variants={fadeInLeft}
            >
              <Button
                size="lg"
                className="w-52 bg-white text-[#7c3464] text-lg md:text-xl font-semibold rounded-lg md:rounded-xl px-7 py-3 font-sans border-2 border-white shadow-sm hover:bg-gray-100 transition tracking-wide"
                onClick={handleAuthRedirect}
                style={{
                  fontFamily: '"Poppins", Arial, sans-serif',
                  letterSpacing: ".025em",
                }}
              >
                Get start
              </Button>
            </motion.div>
          </motion.div>

          {/* Image column with slide-in from right */}
          <motion.div
            className="w-full md:w-1/2 flex items-center justify-end relative h-[350px] md:h-[600px]"
            variants={fadeInRight}
          >
            <img
              src="/p2.jpeg"
              alt="Makeup Model"
              className="object-contain md:object-cover rounded-2xl border-none w-full h-full max-h-[600px]"
              style={{
                objectPosition: "bottom right",
                background: "transparent",
                marginTop: "100px",
              }}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Rest of sections with fade-in animations and zero gaps */}
      <motion.div
        id="features"
        className="m-0 p-0"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <Features />
      </motion.div>
      <motion.div
        className="m-0 p-0"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <ContentSection />
        <ContentSectionApp />
      </motion.div>
      <motion.div
        id="pricing"
        className="m-0 p-0"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        whileHover={{ scale: 1.05 }}
      >
        <Pricing />
      </motion.div>
      <motion.div
        id="faq"
        className="m-0 p-0"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <Faq />
      </motion.div>
      <motion.div
        className="m-0 p-0"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}