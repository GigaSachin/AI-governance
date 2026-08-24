import { Radar } from "lucide-react";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Report Issue", href: "#report" },
  { label: "Privacy", href: "#privacy" },
  { label: "About", href: "#about" },
];

export function Footer() {
  return (
    <footer id="about" className="border-t border-white/5 px-6 py-12 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric/15 border border-electric/30">
              <Radar className="h-4 w-4 text-cyan" aria-hidden="true" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              CIVIC <span className="text-cyan">AI</span>
            </span>
          </div>
          <p className="mt-2 max-w-xs text-sm text-slate-soft">
            Technology for smarter, more responsive communities.
          </p>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-sm text-slate-soft hover:text-offwhite">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
