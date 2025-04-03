import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import CardDeck from "@/components/CardDeck";
import Gallery from "@/components/Gallery";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function HomePage() {
  const [reduceMotion, setReduceMotion] = useState(false);

  // Check user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <Layout>
      {/* Intro Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-3">Practice Your Design Skills</h2>
        <p className="text-lg max-w-2xl">
          Draw cards to generate a random design brief, create your design, and get feedback from the community.
          Perfect for building your portfolio and improving your skills!
        </p>
        
        {/* Accessibility toggle */}
        <div className="mt-6 inline-flex items-center">
          <Label htmlFor="animation-toggle" className="mr-2 text-sm text-gray-800">
            Reduced animations
          </Label>
          <Switch
            id="animation-toggle"
            checked={reduceMotion}
            onCheckedChange={setReduceMotion}
          />
        </div>
      </section>

      {/* Card Deck and Gallery */}
      <div className="space-y-8">
        <CardDeck reduceMotion={reduceMotion} />
        <Gallery />
      </div>
    </Layout>
  );
}
