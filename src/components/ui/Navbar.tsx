
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleAuthRedirect = () => {
    navigate("/auth");
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.header
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      initial={{ width: "100%", backdropFilter: "blur(0px)" }}
      animate={{
        width: isScrolled ? "75%" : "85%",
        backdropFilter: isScrolled ? "blur(16px)" : "blur(0px)",
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div
        className="mx-auto rounded-lg border border-white/30 bg-white/80 backdrop-blur-lg"
        style={{
          boxShadow:
            "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
              <span>𝒢</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">
              GlamFlow
            </span>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <a
              className="text-muted-foreground text-sm hover:text-foreground"
              href="#features"
            >
              Feature
            </a>
            <a
              className="text-muted-foreground text-sm hover:text-foreground"
              href="#faq"
            >
              FAQs
            </a>
            <a
              className="text-muted-foreground text-sm hover:text-foreground"
              href="#pricing"
            >
              Pricing
            </a>
            <a
              className="text-muted-foreground text-sm hover:text-foreground"
              href="#about"
            >
              About
            </a>
          </nav>
          <div className="flex gap-4 items-center">
            <Button className="px-6" onClick={handleAuthRedirect}>
              JOIN US
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
