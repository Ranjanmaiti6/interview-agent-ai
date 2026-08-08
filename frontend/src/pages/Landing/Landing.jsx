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
  const navigate = useNavigate();

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
      {/* Login Portal Selection */}
      {/* ========================================= */}

      <section className="bg-slate-950 text-white py-16">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-10">

            <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider">
              Choose Your Portal
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Login to Continue
            </h2>

            <p className="text-slate-400 mt-3">
              Select the portal that matches your role.
            </p>

          </div>


          {/* ================================= */}
          {/* Login Cards */}
          {/* ================================= */}

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">


            {/* ================================= */}
            {/* Employee */}
            {/* ================================= */}

            <div className="bg-slate-900 border border-blue-500/20 rounded-2xl p-8">

              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-3xl mb-5">
                👨‍💼
              </div>

              <h3 className="text-2xl font-bold">
                Employee
              </h3>

              <p className="text-slate-400 mt-3">
                Access AI interviews, submit your resume,
                attend scheduled meetings and view your
                interview results.
              </p>

              <button
                onClick={() =>
                  navigate("/login?role=employee")
                }
                className="mt-7 w-full bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-xl font-semibold transition"
              >
                Employee Login
              </button>

            </div>


            {/* ================================= */}
            {/* Admin */}
            {/* ================================= */}

            <div className="bg-slate-900 border border-purple-500/20 rounded-2xl p-8">

              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center text-3xl mb-5">
                👨‍💻
              </div>

              <h3 className="text-2xl font-bold">
                Admin
              </h3>

              <p className="text-slate-400 mt-3">
                Manage employees, review resumes,
                schedule interviews and meetings, and
                view AI-generated interview results.
              </p>

              <button
                onClick={() =>
                  navigate("/login?role=admin")
                }
                className="mt-7 w-full bg-purple-600 hover:bg-purple-700 py-3 px-6 rounded-xl font-semibold transition"
              >
                Admin Login
              </button>

            </div>

          </div>

        </div>

      </section>


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