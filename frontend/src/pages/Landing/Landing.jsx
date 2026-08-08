import { useNavigate } from "react-router-dom";

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
      <Navbar />

      <Hero />

      <About />

      <Features />

      <Workflow />

      <Capabilities />

      <Stats />

      <Testimonials />

      <CTA />
    </>
  );
}