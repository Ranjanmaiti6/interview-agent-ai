import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import Capabilities from "../../components/landing/Capabilities";
import Workflow from "../../components/landing/Workflow";
import Stats from "../../components/landing/Stats";
import Footer from "../../components/landing/Footer";
import CTA from "../../components/landing/CTA";

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <Capabilities />
        <Stats />
        <CTA />
         <Footer />
    </>
  );
}