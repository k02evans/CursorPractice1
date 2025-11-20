import Link from "next/link";

export function Footer() {
  const quickLinks = [
    { href: "/#home", label: "Home" },
    { href: "/#services", label: "Services" },
    { href: "/#resources", label: "Resources" },
  ];

  const socialLinks = [
    { href: "#", label: "Instagram" },
    { href: "#", label: "Twitter" },
    { href: "#", label: "YouTube" },
    { href: "#", label: "TikTok" },
    { href: "#", label: "Discord" },
  ];

  return (
    <footer id="contact" className="relative z-[2] text-white py-16">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-xl font-semibold mb-4">IndieLab</h4>
            <p className="text-beige-dark leading-relaxed">
              Empowering independent artists worldwide
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="list-none space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-beige-dark hover:text-beige transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Connect With Us</h4>
            <div className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-beige-dark hover:text-beige transition-all hover:translate-x-1 inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-beige-dark/20 text-beige-dark">
          <p>&copy; 2024 IndieLab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

