import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Card from "./Card";
import DesignBrief from "./DesignBrief";
import { Button } from "@/components/ui/button";
import { CardCategory, Card as CardType } from "@shared/schema";
import { RefreshCw, Shuffle } from "lucide-react";

interface CardDeckProps {
  reduceMotion: boolean;
}

export default function CardDeck({ reduceMotion }: CardDeckProps) {
  const [selectedCards, setSelectedCards] = useState<Record<string, CardType | null>>({
    [CardCategory.CLIENT]: null,
    [CardCategory.NEED]: null,
    [CardCategory.CHALLENGE]: null,
    [CardCategory.AUDIENCE]: null,
  });
  
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({
    [CardCategory.CLIENT]: false,
    [CardCategory.NEED]: false,
    [CardCategory.CHALLENGE]: false,
    [CardCategory.AUDIENCE]: false,
  });
  
  const [showBrief, setShowBrief] = useState(false);
  const [rerollVisible, setRerollVisible] = useState(false);

  // Fetch all cards
  const { data: cardsData, isLoading, isError } = useQuery<Record<string, CardType[]>>({
    queryKey: ["/api/cards"],
    queryFn: async () => {
      const response = await fetch("/api/cards");
      if (!response.ok) {
        throw new Error("Failed to fetch cards");
      }
      const cards = await response.json();
      
      // Group cards by category
      const groupedCards = cards.reduce((acc: Record<string, CardType[]>, card: CardType) => {
        if (!acc[card.category]) {
          acc[card.category] = [];
        }
        acc[card.category].push(card);
        return acc;
      }, {});
      
      return groupedCards;
    },
  });

  // Draw a random card for each category
  const drawRandomCards = () => {
    if (!cardsData) return;
    
    // Reset flipped state and brief
    setFlippedCards({
      [CardCategory.CLIENT]: false,
      [CardCategory.NEED]: false,
      [CardCategory.CHALLENGE]: false,
      [CardCategory.AUDIENCE]: false,
    });
    
    setShowBrief(false);
    
    // Draw new cards
    const newSelectedCards = { ...selectedCards };
    
    Object.keys(CardCategory).forEach(categoryKey => {
      const category = CardCategory[categoryKey as keyof typeof CardCategory];
      const categoryCards = cardsData[category];
      
      if (categoryCards && categoryCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * categoryCards.length);
        newSelectedCards[category] = categoryCards[randomIndex];
      }
    });
    
    setSelectedCards(newSelectedCards);
    setRerollVisible(true);
  };

  // Reroll a specific card
  const rerollCard = (category: string) => {
    if (!cardsData || !cardsData[category] || cardsData[category].length <= 1) return;
    
    const currentCardId = selectedCards[category]?.id;
    let availableCards = cardsData[category].filter(card => card.id !== currentCardId);
    
    if (availableCards.length === 0) {
      availableCards = cardsData[category];
    }
    
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const newCard = availableCards[randomIndex];
    
    setSelectedCards({
      ...selectedCards,
      [category]: newCard,
    });
    
    // Reset flip state for this card
    setFlippedCards({
      ...flippedCards,
      [category]: false,
    });
    
    // Hide brief until cards are flipped again
    setShowBrief(false);
  };

  // Reroll all cards
  const rerollAll = () => {
    drawRandomCards();
  };

  // Handle card flip
  const flipCard = (category: string) => {
    const newFlippedCards = {
      ...flippedCards,
      [category]: !flippedCards[category],
    };
    
    setFlippedCards(newFlippedCards);
    
    // Show brief if all cards are flipped
    const allFlipped = Object.values(newFlippedCards).every(flipped => flipped);
    if (allFlipped) {
      setShowBrief(true);
    }
  };

  // Draw initial cards when data is loaded
  useEffect(() => {
    if (cardsData && Object.keys(cardsData).length > 0) {
      drawRandomCards();
    }
  }, [cardsData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Failed to load cards. Please try again later.
      </div>
    );
  }

  return (
    <section className="mb-16">
      <div className="flex flex-col items-center">
        {/* Card drawing controls */}
        <div className="mb-12 flex flex-col sm:flex-row items-center gap-4">
          <Button
            onClick={drawRandomCards}
            className="apple-button bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-8 shadow-md hover:shadow-lg transform transition hover:-translate-y-1 flex items-center"
          >
            <Shuffle className="h-4.5 w-4.5 mr-2" />
            Draw Cards
          </Button>
          
          {rerollVisible && (
            <Button
              onClick={rerollAll}
              variant="secondary"
              className="apple-button bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium py-3 px-8 shadow-md hover:shadow-lg transform transition hover:-translate-y-1 flex items-center"
            >
              <RefreshCw className="h-4.5 w-4.5 mr-2" />
              Reroll All
            </Button>
          )}
        </div>

        {/* Card display area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          {Object.keys(CardCategory).map(categoryKey => {
            const category = CardCategory[categoryKey as keyof typeof CardCategory];
            const card = selectedCards[category];
            
            if (!card) return null;
            
            return (
              <div className="flex justify-center" key={`${category}-${card.id}`}>
                <Card
                  id={card.id}
                  category={card.category}
                  promptText={card.promptText}
                  backContent={card.backContent}
                  isFlipped={flippedCards[category]}
                  onFlip={() => flipCard(category)}
                  onReroll={() => rerollCard(category)}
                  reduceMotion={reduceMotion}
                />
              </div>
            );
          })}
        </div>

        {/* Design Brief */}
        {showBrief && (
          <DesignBrief
            clientCard={selectedCards[CardCategory.CLIENT]}
            needCard={selectedCards[CardCategory.NEED]}
            challengeCard={selectedCards[CardCategory.CHALLENGE]}
            audienceCard={selectedCards[CardCategory.AUDIENCE]}
            cardIds={Object.values(selectedCards)
              .filter((card): card is CardType => card !== null)
              .map(card => card.id)}
          />
        )}
      </div>
    </section>
  );
}
