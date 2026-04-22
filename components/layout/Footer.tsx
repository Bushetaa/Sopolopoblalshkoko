import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background pt-16 pb-8 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img src="/assets/sopo_logo_1771857176169.png" alt="Sopo Logo" className="w-10 h-10 object-contain" />
              <span className="font-display font-bold text-xl tracking-wider text-foreground uppercase">SOPO</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The intelligent API Gateway for modern teams. Build, secure, and scale your microservices with visual precision.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/#solution" className="text-muted-foreground hover:text-primary text-sm transition-colors">Visual Policies</Link></li>
              <li><Link href="/#solution" className="text-muted-foreground hover:text-primary text-sm transition-colors">Safe Delivery</Link></li>
              <li><Link href="/#why-sopo" className="text-muted-foreground hover:text-primary text-sm transition-colors">Zero Drift</Link></li>
              <li><Link href="/#architecture" className="text-muted-foreground hover:text-primary text-sm transition-colors">Observability</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-6">Community</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Discord Server</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Reddit Community</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Twitter (X)</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary text-sm transition-colors">Research Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/docs" className="text-muted-foreground hover:text-primary text-sm transition-colors">Documentation</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground text-sm order-2 md:order-1 text-center md:text-left">
            © {new Date().getFullYear()} SOPO — ALL LOGIC RESERVED
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 order-1 md:order-2">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors whitespace-nowrap">Privacy Policy</Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors whitespace-nowrap">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}