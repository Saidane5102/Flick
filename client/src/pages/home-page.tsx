import { useState } from "react";
import Layout from "@/components/Layout";
import CardDeck from "@/components/CardDeck";

export default function HomePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-[#212121] mb-4">
            Practice Your Design Skills
          </h1>
          <p className="text-lg text-[#414141]">
            Draw cards to generate unique design challenges, create stunning designs, and showcase your work in our community gallery.
          </p>
        </div>

        {/* Card Deck */}
        <div className="flex flex-col items-center space-y-6">
          <CardDeck reduceMotion={false} />
        </div>
      </div>
    </Layout>
  );
}
