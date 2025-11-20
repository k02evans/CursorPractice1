"use client";

import { useState } from "react";
import Link from "next/link";
import { SECTIONS } from "@/lib/instant";

const GENRE_TABS = [
  { id: "all", name: "All Genres" },
  { id: "hiphop", name: "Hip-Hop" },
  { id: "pop", name: "Pop" },
  { id: "rock", name: "Rock" },
  { id: "edm", name: "EDM" },
  { id: "rnb", name: "R&B" },
  { id: "jazz", name: "Jazz" },
];

export default function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState("all");

  const scrollToServices = () => {
    const servicesSection = document.querySelector("#services");
    if (servicesSection) {
      const offsetTop = servicesSection.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="relative py-32 md:py-40 text-center overflow-hidden">
        <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] pulse-bg bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-transparent" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-5">
          <h2 className="text-5xl md:text-6xl font-black mb-6 animate-fadeInUp tracking-tight leading-tight">
            Empower Your Music Journey
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 animate-fadeInUp-delay-200 leading-relaxed max-w-2xl mx-auto">
            Comprehensive resources for independent artists across all genres
          </p>
          <button
            onClick={scrollToServices}
            className="px-10 py-4 text-lg font-bold rounded-full bg-beige text-navy-blue border-2 border-beige hover:bg-beige-dark hover:border-beige-dark transition-all hover:-translate-y-1 shadow-lg hover:shadow-2xl animate-fadeInUp-delay-400 tracking-wide"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Genre Selector */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          <h3 className="text-4xl font-extrabold text-center mb-8 text-beige tracking-tight">
            Browse by Genre
          </h3>
          <div className="flex justify-center flex-wrap gap-4">
            {GENRE_TABS.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-7 py-3 text-base font-semibold rounded-full border-2 transition-all hover:-translate-y-0.5 ${
                  selectedGenre === genre.id
                    ? "bg-beige border-beige text-navy-blue shadow-lg"
                    : "bg-[rgba(26,54,93,0.6)] border-beige-dark text-beige hover:border-beige hover:bg-[rgba(26,54,93,0.8)]"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          {/* Community Management */}
          <ServiceCard
            icon="CM"
            title="Community Management"
            description="Learn to build and manage artist communities. Connect with your audience through the right platforms and grow your fanbase organically."
            section="community-management"
          />

          {/* Affiliate Marketing */}
          <ServiceCard
            icon="AM"
            title="Affiliate Marketing Strategies"
            description="Monetize your music content with viral short-form, long-form, and affiliate partnerships. Turn your passion into profit."
            section="affiliate-marketing"
          />

          {/* Software & Hardware */}
          <ServiceCard
            icon="SH"
            title="Essential Software & Hardware Links"
            description="Explore trusted tools and equipment for production. From plugins to DAWs, find everything you need to create professional-quality music."
            section="software-hardware"
          />

          {/* Learning Resources */}
          <ServiceCard
            icon="LR"
            title="Learning Resources"
            description="Top YouTube channels to learn music marketing, streaming, and performance. Stay updated with the latest trends and techniques."
            section="learning-resources"
          />

          {/* Local Performance */}
          <ServiceCard
            icon="LP"
            title="Local Performance Finder"
            description="Find bars and clubs near you that host live artist performances. Connect with local venues and expand your reach."
            section="local-performance"
          />
        </div>
      </section>
    </div>
  );
}

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  section: keyof typeof SECTIONS;
}

function ServiceCard({ icon, title, description, section }: ServiceCardProps) {
  const categories = SECTIONS[section].categories;

  return (
    <div className="bg-[rgba(26,54,93,0.7)] backdrop-blur-lg rounded-3xl p-8 md:p-12 mb-10 shadow-md hover:shadow-2xl transition-all hover:-translate-y-2 border border-beige-dark/30 hover:border-beige relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-beige scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      
      <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 mb-6 rounded-2xl bg-beige/20 border border-beige-dark/30 text-beige font-extrabold text-lg md:text-xl tracking-wider shadow-md">
        {icon}
      </div>
      
      <h3 className="text-3xl md:text-4xl font-extrabold mb-5 text-beige tracking-tight">
        {title}
      </h3>
      
      <p className="text-beige-dark mb-6 text-base md:text-lg leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${section}/${category.id}`}
            className="px-7 py-3 text-sm md:text-base font-semibold rounded-full bg-beige text-navy-blue border-2 border-beige hover:bg-beige-dark hover:border-beige-dark transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

