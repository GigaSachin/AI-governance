import { Radar } from "lucide-react";
import { Button } from "./ui/primitives";
import {
  useLanguage,
  type Language,
} from "../context/LanguageContext";

const NAV_LINKS = [
  { key: "home", href: "#home" },
  { key: "howItWorks", href: "#how-it-works" },
  { key: "report", href: "#report" },
  { key: "impact", href: "#impact" },
  { key: "contact", href: "#about" },
] as const;

const LANGUAGES: {
  value: Language;
  label: string;
}[] = [
  { value: "en", label: "🇬🇧 English" },
  { value: "hi", label: "🇮🇳 हिन्दी" },
  { value: "or", label: "🇮🇳 ଓଡ଼ିଆ" },
  { value: "bn", label: "🇮🇳 বাংলা" },
  { value: "mr", label: "🇮🇳 मराठी" },
  { value: "te", label: "🇮🇳 తెలుగు" },
  { value: "ta", label: "🇮🇳 தமிழ்" },
  { value: "gu", label: "🇮🇳 ગુજરાતી" },
  { value: "kn", label: "🇮🇳 ಕನ್ನಡ" },
  { value: "pa", label: "🇮🇳 ਪੰਜਾਬੀ" },
];

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-midnight/80 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10"
      >
        {/* LOGO */}
        <a
          href="#home"
          className="flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric/15 border border-electric/30">
            <Radar
              className="h-5 w-5 text-cyan"
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>

          <span className="font-display text-lg font-semibold tracking-tight">
            CIVIC <span className="text-cyan">AI</span>
          </span>
        </a>

        {/* DESKTOP NAVIGATION */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-soft transition-colors hover:text-offwhite"
              >
                {t(link.key)}
              </a>
            </li>
          ))}
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* LANGUAGE SELECTOR */}
          <select
            value={language}
            onChange={(event) =>
              setLanguage(
                event.target.value as Language
              )
            }
            aria-label={t("selectLanguage")}
            className="
              hidden
              sm:block
              rounded-lg
              border
              border-white/10
              bg-[#0a112e]
              px-3
              py-2
              text-sm
              text-white
              outline-none
              cursor-pointer
              transition
              hover:border-cyan/40
              focus:border-cyan
            "
          >
            {LANGUAGES.map((lang) => (
              <option
                key={lang.value}
                value={lang.value}
                className="bg-[#0a112e] text-white"
              >
                {lang.label}
              </option>
            ))}
          </select>

          {/* REPORT BUTTON */}
          <Button
            size="sm"
            onClick={() => scrollToReport()}
          >
            {t("report")}
          </Button>
        </div>
      </nav>

      {/* MOBILE LANGUAGE SELECTOR */}
      <div className="border-t border-white/5 px-6 py-3 sm:hidden">
        <select
          value={language}
          onChange={(event) =>
            setLanguage(
              event.target.value as Language
            )
          }
          aria-label={t("selectLanguage")}
          className="
            w-full
            rounded-lg
            border
            border-white/10
            bg-[#0a112e]
            px-3
            py-2
            text-sm
            text-white
            outline-none
          "
        >
          {LANGUAGES.map((lang) => (
            <option
              key={lang.value}
              value={lang.value}
              className="bg-[#0a112e] text-white"
            >
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}

function scrollToReport() {
  document
    .getElementById("report")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
}