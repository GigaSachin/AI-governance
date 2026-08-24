import { AdminDashboard } from "./components/admin/AdminDashboard";

import { LanguageProvider } from "./context/LanguageContext";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustStrip } from "./components/TrustStrip";
import { HowItWorks } from "./components/HowItWorks";
import { ReportSection } from "./components/ReportSection";
import { ImpactSection } from "./components/ImpactSection";
import { LocationIntelligenceVisual } from "./components/LocationIntelligenceVisual";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <LanguageProvider>
      {window.location.pathname.replace(/\/+$/, "") === "/admin" ? (
        <AdminDashboard />
      ) : (
        <div className="min-h-screen">
          <Navbar />

          <main>
            <Hero />
            <TrustStrip />
            <HowItWorks />
            <ReportSection />
            <ImpactSection />
            <LocationIntelligenceVisual />
          </main>

          <Footer />
        </div>
      )}
    </LanguageProvider>
  );
}