import Navbar from "../../components/layout/Navbar";

import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import Workflow from "../../components/landing/Workflow";
import Capabilities from "../../components/landing/Capabilities";
import Stats from "../../components/landing/Stats";
import Testimonials from "../../components/landing/Testimonials";
import CTA from "../../components/landing/CTA";

import About from "../../components/about/About";

export default function Landing() {
  return (
    <>
      {/* ========================================= */}
      {/* Navbar */}
      {/* ========================================= */}

      <Navbar />

      {/* ========================================= */}
      {/* Hero */}
      {/* ========================================= */}

      <Hero />

      {/* ========================================= */}
      {/* About */}
      {/* ========================================= */}

      <About />

      {/* ========================================= */}
      {/* Features */}
      {/* ========================================= */}

      <Features />

      {/* ========================================= */}
      {/* Workflow */}
      {/* ========================================= */}

      <Workflow />

      {/* ========================================= */}
      {/* Capabilities */}
      {/* ========================================= */}

      <Capabilities />

      {/* ========================================= */}
      {/* Stats */}
      {/* ========================================= */}

      <Stats />

      {/* ========================================= */}
      {/* Testimonials */}
      {/* ========================================= */}

      <Testimonials />

      {/* ========================================= */}
      {/* CTA */}
      {/* ========================================= */}

      <CTA />
    </>
  );
}