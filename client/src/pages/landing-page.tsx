import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Clock, Sparkles, Users, Laptop, XOctagon } from "lucide-react";

export default function LandingPage() {
  const [_, setLocation] = useLocation();
  
  const goToLogin = () => {
    setLocation("/auth");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Memorisely Style */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl ml-2 text-gray-900">DesignDeck</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={goToLogin} className="memo-button-outline border">
              Log In
            </Button>
            <Button onClick={goToLogin} className="memo-button-primary">
              Sign Up Free
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section - Memorisely Style */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Elevate Your Design Skills with Random Challenges
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Draw cards to create unique design briefs, practice your skills, and build a portfolio of work that stands out. Perfect for junior designers looking to grow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={goToLogin} 
                  className="memo-button-primary text-base py-3"
                >
                  Start Designing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.scrollTo({ top: document.getElementById('how-it-works')?.offsetTop || 0, behavior: 'smooth' })}
                  className="memo-button-outline text-base py-3"
                >
                  Learn More
                </Button>
              </div>
              <div className="mt-8 flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                <span>Join thousands of designers improving their skills every day</span>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                {/* Card previews - Memorisely style */}
                <div className="memo-card overflow-hidden shadow-sm p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-preview rounded-md flex flex-col items-center justify-center p-4 text-white shadow-sm h-48"
                         style={{ background: 'linear-gradient(135deg, #F37485 0%, #E93C67 100%)' }}>
                      <div className="bg-white/10 rounded-full p-3 mb-3">
                        <Laptop className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-base mb-1">Client</h3>
                      <p className="text-xs text-center opacity-80">Who you're designing for</p>
                      <p className="text-sm mt-3 font-medium">Click to reveal</p>
                    </div>
                    <div className="card-preview rounded-md flex flex-col items-center justify-center p-4 text-white shadow-sm h-48"
                         style={{ background: 'linear-gradient(135deg, #40C8E0 0%, #2BA4BE 100%)' }}>
                      <div className="bg-white/10 rounded-full p-3 mb-3">
                        <Users className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-base mb-1">Audience</h3>
                      <p className="text-xs text-center opacity-80">Target demographic</p>
                      <p className="text-sm mt-3 font-medium">Click to reveal</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 border border-gray-100 rounded-md">
                    <h4 className="font-bold text-gray-900 mb-2">Current Challenge:</h4>
                    <p className="text-gray-600">Create a <span className="text-[#FF5E3A] font-medium">website redesign</span> for a <span className="text-[#E93C67] font-medium">local coffee shop</span> with <span className="text-[#5038ED] font-medium">mobile-first design</span>, targeting <span className="text-[#2BA4BE] font-medium">young professionals</span>.</p>
                    <Button onClick={goToLogin} className="mt-4 w-full memo-button-primary">
                      Join to Start This Challenge
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works - Memorisely Style */}
      <section id="how-it-works" className="py-16 md:py-20 px-4 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              DesignDeck makes practice fun and effective with a card-based system that generates random design challenges.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-md border border-gray-100 hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center text-primary mb-4">
                <Star className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Draw Cards</h3>
              <p className="text-gray-600">
                Draw four random cards: Client, Need, Challenge, and Audience to create a unique design brief every time.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-md border border-gray-100 hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center text-primary mb-4">
                <Laptop className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Designs</h3>
              <p className="text-gray-600">
                Use your favorite design tools to create a solution based on the random brief you've been given.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-md border border-gray-100 hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center text-primary mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Feedback</h3>
              <p className="text-gray-600">
                Share your designs with the community, get valuable feedback, and build a diverse portfolio.
              </p>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Button 
              onClick={goToLogin}
              className="memo-button-primary text-base py-3"
            >
              Start Your First Challenge
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features - Memorisely Style */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features Designed for Growth</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to improve your design skills consistently and methodically.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 items-start border border-gray-100 p-5 rounded-md hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-md flex-shrink-0 flex items-center justify-center text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Random Prompts</h3>
                <p className="text-gray-600">
                  Overcome designer's block with our card-based system that generates endless unique design challenges.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start border border-gray-100 p-5 rounded-md hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-md flex-shrink-0 flex items-center justify-center text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Timed Challenges</h3>
                <p className="text-gray-600">
                  Set a timer to improve your speed and decision-making - critical skills for professional designers.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start border border-gray-100 p-5 rounded-md hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-md flex-shrink-0 flex items-center justify-center text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Community Feedback</h3>
                <p className="text-gray-600">
                  Share your designs and receive constructive feedback from other designers to improve faster.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start border border-gray-100 p-5 rounded-md hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-md flex-shrink-0 flex items-center justify-center text-primary">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Progress Tracking</h3>
                <p className="text-gray-600">
                  Track your design journey with badges and stats that showcase your growth and achievements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action - Memorisely Style */}
      <section className="py-16 md:py-20 px-4 bg-primary text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Level Up Your Design Skills?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join DesignDeck today and start turning random prompts into portfolio-worthy designs.
          </p>
          <Button
            onClick={goToLogin}
            className="bg-white text-primary hover:bg-gray-50 rounded-md font-medium px-6 py-3 text-base"
          >
            Get Started for Free
          </Button>
        </div>
      </section>
      
      {/* Footer - Memorisely Style */}
      <footer className="bg-gray-50 py-10 px-4 border-t border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg ml-2">DesignDeck</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} DesignDeck. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}