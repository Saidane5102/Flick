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
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="h-7 w-7 text-blue-600 mr-2" />
            <span className="font-bold text-xl text-gray-800">DesignDeck</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={goToLogin} className="apple-button border border-gray-200">
              Log In
            </Button>
            <Button onClick={goToLogin} className="apple-button bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5">
              Sign Up Free
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Elevate Your Design Skills with Random Challenges
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Draw cards to create unique design briefs, practice your skills, and build a portfolio of work that stands out. Perfect for junior designers looking to grow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={goToLogin} 
                  className="apple-button bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg shadow-lg"
                >
                  Start Designing <ArrowRight className="ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.scrollTo({ top: document.getElementById('how-it-works')?.offsetTop || 0, behavior: 'smooth' })}
                  className="apple-button border-2 border-gray-300 text-gray-700 px-8 py-6 text-lg"
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
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-100 rounded-full z-0"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-100 rounded-full z-0"></div>
                <div className="relative z-10 bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-preview bg-gradient-to-br from-teal-500 to-teal-600 h-56 rounded-lg flex flex-col items-center justify-center p-4 text-white shadow-md">
                      <div className="bg-white/20 rounded-full p-3 mb-3">
                        <Laptop className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">Client</h3>
                      <p className="text-xs text-center opacity-80">Who you're designing for</p>
                      <p className="text-sm mt-3 font-medium">Click to reveal</p>
                    </div>
                    <div className="card-preview bg-gradient-to-br from-orange-500 to-orange-600 h-56 rounded-lg flex flex-col items-center justify-center p-4 text-white shadow-md">
                      <div className="bg-white/20 rounded-full p-3 mb-3">
                        <Users className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">Audience</h3>
                      <p className="text-xs text-center opacity-80">Target demographic</p>
                      <p className="text-sm mt-3 font-medium">Click to reveal</p>
                    </div>
                  </div>
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Current Challenge:</h4>
                    <p className="text-gray-600">Create a <span className="text-orange-500 font-medium">website redesign</span> for a <span className="text-teal-500 font-medium">local coffee shop</span> with <span className="text-purple-500 font-medium">mobile-first design</span>, targeting <span className="text-emerald-500 font-medium">young professionals</span>.</p>
                    <Button className="mt-4 w-full apple-button bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      Join to Start This Challenge
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              DesignDeck makes practice fun and effective with a card-based system that generates random design challenges.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Draw Cards</h3>
              <p className="text-gray-600">
                Draw four random cards: Client, Need, Challenge, and Audience to create a unique design brief every time.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                <Laptop className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Create Designs</h3>
              <p className="text-gray-600">
                Use your favorite design tools to create a solution based on the random brief you've been given.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Get Feedback</h3>
              <p className="text-gray-600">
                Share your designs with the community, get valuable feedback, and build a diverse portfolio.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              onClick={goToLogin}
              className="apple-button bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 text-lg"
            >
              Start Your First Challenge
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features Designed for Growth</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to improve your design skills consistently and methodically.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4 items-start bg-white p-6 rounded-xl border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-green-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Random Prompts</h3>
                <p className="text-gray-600">
                  Overcome designer's block with our card-based system that generates endless unique design challenges.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start bg-white p-6 rounded-xl border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex-shrink-0 flex items-center justify-center text-purple-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Timed Challenges</h3>
                <p className="text-gray-600">
                  Set a timer to improve your speed and decision-making - critical skills for professional designers.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start bg-white p-6 rounded-xl border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Community Feedback</h3>
                <p className="text-gray-600">
                  Share your designs and receive constructive feedback from other designers to improve faster.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start bg-white p-6 rounded-xl border border-gray-100">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex-shrink-0 flex items-center justify-center text-amber-600">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Progress Tracking</h3>
                <p className="text-gray-600">
                  Track your design journey with badges and stats that showcase your growth and achievements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-6 text-white/80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Level Up Your Design Skills?</h2>
          <p className="text-xl text-white/80 mb-8">
            Join DesignDeck today and start turning random prompts into portfolio-worthy designs.
          </p>
          <Button
            onClick={goToLogin}
            className="apple-button bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-lg"
          >
            Get Started for Free
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Sparkles className="h-6 w-6 text-white/80 mr-2" />
              <span className="font-bold text-xl">DesignDeck</span>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} DesignDeck. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}