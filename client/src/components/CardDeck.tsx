import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Card from "./Card";
import DesignBrief from "./DesignBrief";
import { CardCategory, Card as CardType } from "@shared/schema";
import { Loader2 } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading your design challenge...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-center text-red-500 space-y-2">
          <p className="text-lg font-medium">Failed to load cards</p>
          <p className="text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Conditional rendering of either cards or brief */}
        {showBrief ? (
          <div className="w-full max-w-5xl mx-auto">
            <DesignBrief
              clientCard={selectedCards[CardCategory.CLIENT]}
              needCard={selectedCards[CardCategory.NEED]}
              challengeCard={selectedCards[CardCategory.CHALLENGE]}
              audienceCard={selectedCards[CardCategory.AUDIENCE]}
              cardIds={Object.values(selectedCards)
                .filter((card): card is CardType => card !== null)
                .map(card => card.id)}
              onDrawAgain={() => {
                setSelectedCards({});
                setShowBrief(false);
                drawRandomCards();
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Cards Grid */}
            <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
              {Object.keys(CardCategory).map(categoryKey => {
                const category = CardCategory[categoryKey as keyof typeof CardCategory];
                const card = selectedCards[category];
                
                if (!card) return null;
                
                return (
                  <div 
                    className="flex flex-col items-center space-y-2" 
                    key={`${category}-${card.id}`}
                  >
                    <h3 className="text-sm font-medium text-center capitalize text-[#414141]">
                      {category.toLowerCase()}
                    </h3>
                    <div className="w-full aspect-square max-w-[250px]">
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
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
