import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import Capabilities from "../../components/landing/Capabilities";
import Workflow from "../../components/landing/Workflow";

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <Capabilities />
    </>
  );
}