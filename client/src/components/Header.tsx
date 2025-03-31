import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, Info, LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Logo - Memorisely Style */}
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary flex items-center justify-center rounded-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="ml-2 text-lg md:text-xl font-bold">
              Design Deck Challenge
            </h1>
          </div>
        </div>

        {/* Desktop navigation - Memorisely Style */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/">
            <a className={`text-gray-800 hover:text-primary transition-colors text-sm ${location === "/" ? "text-primary font-medium" : ""}`}>
              Home
            </a>
          </Link>
          <Link href="/#gallery">
            <a className="text-gray-800 hover:text-primary transition-colors text-sm">
              Gallery
            </a>
          </Link>
          <Link href="/#progress">
            <a className="text-gray-800 hover:text-primary transition-colors text-sm">
              Progress
            </a>
          </Link>
          
          <Button variant="ghost" className="text-sm p-0 hover:bg-transparent">
            <Info className="h-5 w-5 text-gray-800 hover:text-primary cursor-pointer" />
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-md p-0 hover:bg-primary/5 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="text-sm py-2">
                  Signed in as <strong className="ml-1">{user.username}</strong>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <div className="flex items-center cursor-pointer py-2">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="py-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile menu button - Memorisely Style */}
        <button
          className="md:hidden text-gray-800"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu - Memorisely Style */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-4 py-4 space-y-4">
            <Link href="/">
              <a className="block text-gray-800 hover:text-primary text-sm" onClick={() => setMobileMenuOpen(false)}>
                Home
              </a>
            </Link>
            <Link href="/#gallery">
              <a className="block text-gray-800 hover:text-primary text-sm" onClick={() => setMobileMenuOpen(false)}>
                Gallery
              </a>
            </Link>
            <Link href="/#progress">
              <a className="block text-gray-800 hover:text-primary text-sm" onClick={() => setMobileMenuOpen(false)}>
                Progress
              </a>
            </Link>
            <button className="flex items-center text-gray-800 hover:text-primary text-sm">
              <Info className="h-4 w-4 mr-2" />
              Help
            </button>
            {user && (
              <>
                {user.isAdmin && (
                  <Link href="/admin">
                    <a className="block text-gray-800 hover:text-primary text-sm" onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </div>
                    </a>
                  </Link>
                )}
                <button 
                  className="flex items-center text-gray-800 hover:text-primary text-sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
