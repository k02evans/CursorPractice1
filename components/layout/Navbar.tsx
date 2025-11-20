"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import { db } from "@/lib/instant";
import { AuthModal } from "@/components/auth/AuthModal";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { isLoading, user, error } = db.useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#home", label: "Home" },
    { href: "/#services", label: "Services" },
    { href: "/#resources", label: "Resources" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`sticky top-0 z-[1000] backdrop-blur-lg border-b border-beige-dark/20 transition-all duration-300 ${
        scrolled ? "shadow-lg" : "shadow-md"
      }`}
      style={{ background: "rgba(26, 54, 93, 0.95)" }}
    >
      <div className="max-w-[1200px] mx-auto px-5 py-5">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-beige text-3xl font-extrabold tracking-tight hover:text-beige-dark transition-colors">
            IndieLab
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-beige font-medium hover:text-beige-dark transition-all relative group"
                >
                  {link.label}
                  <span className="absolute bottom-[-5px] left-0 w-0 h-0.5 bg-beige transition-all group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-beige/20 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-beige/10 border-2 border-beige text-beige hover:bg-beige hover:text-navy-blue transition-all"
                >
                  <User size={18} />
                  <span className="text-sm font-semibold">{user.email}</span>
                </Link>
                <button
                  onClick={() => db.auth.signOut()}
                  className="p-2 rounded-full hover:bg-beige/10 text-beige hover:text-beige-dark transition-all"
                  title="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2 rounded-full bg-beige text-navy-blue font-semibold hover:bg-beige-dark transition-all"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-beige" />
            ) : (
              <Menu className="w-6 h-6 text-beige" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-beige-dark/20 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-beige font-medium hover:text-beige-dark transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isLoading && !user && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowAuthModal(true);
                }}
                className="px-6 py-2 rounded-full bg-beige text-navy-blue font-semibold hover:bg-beige-dark transition-all self-start"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </nav>
  );
}

