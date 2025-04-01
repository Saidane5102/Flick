import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Clock, Sparkles, Users, Laptop, XOctagon, RefreshCw } from "lucide-react";
import AdminSetupButton from "@/components/AdminSetupButton";

export default function LandingPage() {
  const [_, setLocation] = useLocation();
  const [flippedCards, setFlippedCards] = useState({
    client: false,
    audience: false
  });
  
  const goToLogin = () => {
    setLocation("/auth");
  };
  
  const flipCard = (cardType: 'client' | 'audience') => {
    setFlippedCards(prev => ({
      ...prev,
      [cardType]: !prev[cardType]
    }));
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Memorisely Style */}
      <header className="border-b border-[#E9E6DD] bg-[#FAF9F7] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-[#212121] rounded-[8px] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-xl ml-3 text-[#212121]">Design Deck</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={goToLogin} className="border-[#E9E6DD] bg-transparent text-[#212121] hover:bg-[#E9E6DD] rounded-[8px]">
              Log In
            </Button>
            <Button onClick={goToLogin} className="bg-[#212121] text-white hover:bg-black rounded-[8px]">
              Sign Up Free
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section - Memorisely Style */}
      <section className="py-16 md:py-24 px-4 bg-[#FAF9F7]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h1 className="text-[44px] leading-[52px] font-semibold text-[#212121] mb-6">
                Elevate Your Design Skills with Random Challenges
              </h1>
              <p className="text-[16px] leading-[24px] text-[#414141] mb-8">
                Draw cards to create unique design briefs, practice your skills, and build a portfolio of work that stands out. Perfect for junior designers looking to grow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={goToLogin} 
                  className="bg-[#212121] text-white hover:bg-black rounded-[8px] text-base py-3"
                >
                  Start Designing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.scrollTo({ top: document.getElementById('how-it-works')?.offsetTop || 0, behavior: 'smooth' })}
                  className="border-[#E9E6DD] bg-transparent text-[#212121] hover:bg-[#E9E6DD] rounded-[8px] text-base py-3"
                >
                  Learn More
                </Button>
              </div>
              <div className="mt-8 flex items-center text-sm text-[#414141]">
                <Users className="h-4 w-4 mr-2" />
                <span>Join thousands of designers improving their skills every day</span>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                {/* Interactive Card Example - Memorisely & Bento Style */}
                <div className="memo-bento-card overflow-hidden shadow-sm p-6 transition-all hover:shadow-md">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="relative card-container h-48 perspective-500">
                      <div 
                        className="card absolute w-full h-full transition-transform duration-500"
                        style={{ 
                          transformStyle: "preserve-3d",
                          transform: flippedCards.client ? "rotateY(180deg)" : "rotateY(0deg)",
                          transition: "all 0.5s ease"
                        }}
                        onClick={() => flipCard('client')}
                      >
                        {/* Client Card Front */}
                        <div 
                          className="card-front absolute w-full h-full rounded-[16px] flex flex-col items-center justify-center p-5 text-white backface-hidden border border-[#E9E6DD]"
                          style={{ 
                            background: 'linear-gradient(145deg, #313131, #212121)',
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                          }}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="mb-4 bg-white/20 p-3 rounded-[10px] shadow-sm">
                              <Laptop className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-semibold mb-1 text-white">Client</h3>
                            <p className="text-xs text-white/90 text-center mb-4">
                              Who you're designing for
                            </p>
                            <div className="flex items-center justify-center text-xs font-medium bg-white/20 px-3 py-1.5 rounded-[8px] shadow-sm hover:bg-white/25 transition-colors">
                              <Sparkles className="h-3.5 w-3.5 mr-1 text-white" />
                              <span className="text-white">Click to reveal</span>
                            </div>
                          </div>
                          
                          {/* Decorative elements */}
                          <div className="absolute top-3 right-3 opacity-30">
                            <div className="h-8 w-8 rounded-full border-2 border-white/40"></div>
                          </div>
                          <div className="absolute bottom-4 left-3 opacity-30">
                            <div className="h-6 w-6 rounded-[8px] border-2 border-white/40"></div>
                          </div>
                        </div>

                        {/* Client Card Back */}
                        <div
                          className="card-back absolute w-full h-full rounded-[16px] flex flex-col p-4 backface-hidden"
                          style={{ 
                            transform: "rotateY(180deg)",
                            backgroundColor: "#FAF9F7",
                            border: "1px solid #E9E6DD",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
                          }}
                        >
                          <div className="flex items-center mb-2">
                            <div className="rounded-[8px] w-fit p-1.5 mr-2 bg-[#E9E6DD] text-[#212121]">
                              <Laptop className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="text-xs uppercase font-medium tracking-wider text-[#212121]">
                                Client
                              </span>
                            </div>
                          </div>
                          
                          <h4 className="font-semibold text-sm text-[#212121] mb-2">Local coffee shop</h4>
                          <div className="border-t border-[#E9E6DD] mb-2"></div>
                          <div className="flex-1 overflow-auto custom-scrollbar mb-3">
                            <p className="text-xs text-[#414141] leading-[18px]">A neighborhood café looking to modernize their brand while keeping their community focus. They offer artisanal coffee, pastries, and a quiet space to work.</p>
                          </div>
                          <button
                            className="bg-[#212121] text-white text-xs flex items-center justify-center py-1.5 px-3 rounded-[8px] hover:bg-black transition-colors"
                            onClick={(e) => { e.stopPropagation(); flipCard('client'); }}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" strokeWidth={1.5} />
                            Flip card
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative card-container h-48 perspective-500">
                      <div 
                        className="card absolute w-full h-full transition-transform duration-500"
                        style={{ 
                          transformStyle: "preserve-3d",
                          transform: flippedCards.audience ? "rotateY(180deg)" : "rotateY(0deg)",
                          transition: "all 0.5s ease"
                        }}
                        onClick={() => flipCard('audience')}
                      >
                        {/* Audience Card Front */}
                        <div 
                          className="card-front absolute w-full h-full rounded-[16px] flex flex-col items-center justify-center p-5 text-white backface-hidden border border-[#E9E6DD]"
                          style={{ 
                            background: 'linear-gradient(145deg, #313131, #212121)',
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                          }}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="mb-4 bg-white/20 p-3 rounded-[10px] shadow-sm">
                              <Users className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-semibold mb-1 text-white">Audience</h3>
                            <p className="text-xs text-white/90 text-center mb-4">
                              Target demographic
                            </p>
                            <div className="flex items-center justify-center text-xs font-medium bg-white/20 px-3 py-1.5 rounded-[8px] shadow-sm hover:bg-white/25 transition-colors">
                              <Sparkles className="h-3.5 w-3.5 mr-1 text-white" />
                              <span className="text-white">Click to reveal</span>
                            </div>
                          </div>
                          
                          {/* Decorative elements */}
                          <div className="absolute top-3 right-3 opacity-30">
                            <div className="h-8 w-8 rounded-full border-2 border-white/40"></div>
                          </div>
                          <div className="absolute bottom-4 left-3 opacity-30">
                            <div className="h-6 w-6 rounded-[8px] border-2 border-white/40"></div>
                          </div>
                        </div>

                        {/* Audience Card Back */}
                        <div
                          className="card-back absolute w-full h-full rounded-[16px] flex flex-col p-4 backface-hidden"
                          style={{ 
                            transform: "rotateY(180deg)",
                            backgroundColor: "#FAF9F7",
                            border: "1px solid #E9E6DD",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
                          }}
                        >
                          <div className="flex items-center mb-2">
                            <div className="rounded-[8px] w-fit p-1.5 mr-2 bg-[#E9E6DD] text-[#212121]">
                              <Users className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="text-xs uppercase font-medium tracking-wider text-[#212121]">
                                Audience
                              </span>
                            </div>
                          </div>
                          
                          <h4 className="font-semibold text-sm text-[#212121] mb-2">Young professionals</h4>
                          <div className="border-t border-[#E9E6DD] mb-2"></div>
                          <div className="flex-1 overflow-auto custom-scrollbar mb-3">
                            <p className="text-xs text-[#414141] leading-[18px]">Urban professionals aged 25-35 who value quality, sustainability, and a good work environment. They're tech-savvy and willing to pay more for an exceptional experience.</p>
                          </div>
                          <button
                            className="bg-[#212121] text-white text-xs flex items-center justify-center py-1.5 px-3 rounded-[8px] hover:bg-black transition-colors"
                            onClick={(e) => { e.stopPropagation(); flipCard('audience'); }}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" strokeWidth={1.5} />
                            Flip card
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-5 border border-[#E9E6DD] rounded-[16px] bg-[#FAF9F7]">
                    <h4 className="font-semibold text-[#212121] mb-3">Current Challenge:</h4>
                    <p className="text-[#414141]">
                      Create a <span className="text-[#212121] font-semibold">website redesign</span> for a 
                      <span className="text-[#212121] font-semibold"> local coffee shop</span> with 
                      <span className="text-[#212121] font-semibold"> mobile-first design</span>, targeting 
                      <span className="text-[#212121] font-semibold"> young professionals</span>.
                    </p>
                    <Button onClick={goToLogin} className="mt-5 w-full bg-[#212121] text-white hover:bg-black rounded-[8px]">
                      Try This Challenge
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works - Memorisely Style */}
      <section id="how-it-works" className="py-16 md:py-20 px-4 bg-[#E9E6DD] border-y border-[#E9E6DD]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-[32px] leading-[40px] font-semibold text-[#212121] mb-4">How It Works</h2>
            <p className="text-[16px] leading-[24px] text-[#414141] max-w-3xl mx-auto">
              Design Deck makes practice fun and effective with a card-based system that generates random design challenges.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#FAF9F7] p-8 rounded-[20px] border border-[#E9E6DD] transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-[#212121] rounded-[8px] flex items-center justify-center text-white mb-5">
                <Star className="h-5 w-5" />
              </div>
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#212121] mb-3">Draw Cards</h3>
              <p className="text-[14px] leading-[20px] text-[#414141]">
                Draw four random cards: Client, Need, Challenge, and Audience to create a unique design brief every time.
              </p>
            </div>
            
            <div className="bg-[#FAF9F7] p-8 rounded-[20px] border border-[#E9E6DD] transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-[#212121] rounded-[8px] flex items-center justify-center text-white mb-5">
                <Laptop className="h-5 w-5" />
              </div>
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#212121] mb-3">Create Designs</h3>
              <p className="text-[14px] leading-[20px] text-[#414141]">
                Use your favorite design tools to create a solution based on the random brief you've been given.
              </p>
            </div>
            
            <div className="bg-[#FAF9F7] p-8 rounded-[20px] border border-[#E9E6DD] transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-[#212121] rounded-[8px] flex items-center justify-center text-white mb-5">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#212121] mb-3">Get Feedback</h3>
              <p className="text-[14px] leading-[20px] text-[#414141]">
                Share your designs with the community, get valuable feedback, and build a diverse portfolio.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              onClick={goToLogin}
              className="bg-[#212121] text-white hover:bg-black rounded-[8px] text-base py-3 px-6"
            >
              Start Your First Challenge
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features - Memorisely Style */}
      <section className="py-16 md:py-20 px-4 bg-[#FAF9F7]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-[32px] leading-[40px] font-semibold text-[#212121] mb-4">Features Designed for Growth</h2>
            <p className="text-[16px] leading-[24px] text-[#414141] max-w-3xl mx-auto">
              Everything you need to improve your design skills consistently and methodically.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-6 items-start p-6 bg-[#FAF9F7] rounded-[20px] border border-[#E9E6DD] transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-[#212121] rounded-[8px] flex-shrink-0 flex items-center justify-center text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[18px] leading-[24px] font-semibold text-[#212121] mb-2">Random Prompts</h3>
                <p className="text-[14px] leading-[20px] text-[#414141]">
                  Overcome designer's block with our card-based system that generates endless unique design challenges.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start p-6 bg-[#FAF9F7] rounded-[20px] border border-[#E9E6DD] transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-[#212121] rounded-[8px] flex-shrink-0 flex items-center justify-center text-white">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[18px] leading-[24px] font-semibold text-[#212121] mb-2">Timed Challenges</h3>
                <p className="text-[14px] leading-[20px] text-[#414141]">
                  Set a timer to improve your speed and decision-making - critical skills for professional designers.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start p-6 bg-[#FAF9F7] rounded-[20px] border border-[#E9E6DD] transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-[#212121] rounded-[8px] flex-shrink-0 flex items-center justify-center text-white">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[18px] leading-[24px] font-semibold text-[#212121] mb-2">Community Feedback</h3>
                <p className="text-[14px] leading-[20px] text-[#414141]">
                  Share your designs and receive constructive feedback from other designers to improve faster.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start p-6 bg-[#FAF9F7] rounded-[20px] border border-[#E9E6DD] transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-[#212121] rounded-[8px] flex-shrink-0 flex items-center justify-center text-white">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[18px] leading-[24px] font-semibold text-[#212121] mb-2">Progress Tracking</h3>
                <p className="text-[14px] leading-[20px] text-[#414141]">
                  Track your design journey with badges and stats that showcase your growth and achievements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action - Memorisely Style */}
      <section className="py-16 md:py-24 px-4 bg-[#212121] text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-[32px] leading-[40px] md:text-[44px] md:leading-[52px] font-semibold mb-6">Ready to Level Up Your Design Skills?</h2>
          <p className="text-[18px] leading-[28px] opacity-90 mb-8">
            Join Design Deck today and start turning random prompts into portfolio-worthy designs.
          </p>
          <Button
            onClick={goToLogin}
            className="bg-white text-[#212121] hover:bg-[#F5F5F5] rounded-[8px] font-semibold px-8 py-3 text-base"
          >
            Get Started Free
          </Button>
        </div>
      </section>
      
      {/* Footer - Memorisely Style */}
      <footer className="bg-[#FAF9F7] py-10 px-4 border-t border-[#E9E6DD]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-9 w-9 bg-[#212121] rounded-[8px] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg ml-3 text-[#212121]">Design Deck</span>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm text-[#414141]">
                © {new Date().getFullYear()} Design Deck. All rights reserved.
              </div>
              <AdminSetupButton />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}