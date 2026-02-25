import Link from "next/link";

const footerLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Demo", href: "/simulation" },
  { label: "About", href: "/about" },
  { label: "Login", href: "/login" },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-border/60 bg-background/70 py-12 backdrop-blur">
      <div className="container mx-auto flex flex-col items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-3">
          <span aria-hidden className="logo-mask h-[72px] w-[72px]"></span>
          <span className="font-display text-2xl font-bold text-foreground">SOPO</span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="text-xs text-muted-foreground">
          Built for developers who want clear policies and fast, safe releases.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
