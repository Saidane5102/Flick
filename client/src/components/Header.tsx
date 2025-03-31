import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Lightbulb, Menu, X, Info, LogOut, Settings } from "lucide-react";
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
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <h1 className="ml-2 text-xl md:text-2xl font-heading font-bold">
              Design Deck Challenge
            </h1>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`text-gray-800 hover:text-primary font-medium transition-colors ${location === "/" ? "text-primary" : ""}`}>
              Home
            </a>
          </Link>
          <Link href="/#gallery">
            <a className="text-gray-800 hover:text-primary font-medium transition-colors">
              Gallery
            </a>
          </Link>
          <Link href="/#progress">
            <a className="text-gray-800 hover:text-primary font-medium transition-colors">
              Progress
            </a>
          </Link>
          <Info className="h-6 w-6 text-gray-800 hover:text-primary cursor-pointer" />

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-sm">
                  Signed in as <strong>{user.username}</strong>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <div className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-800"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 py-3 space-y-3">
            <Link href="/">
              <a className="block text-gray-800 hover:text-primary font-medium" onClick={() => setMobileMenuOpen(false)}>
                Home
              </a>
            </Link>
            <Link href="/#gallery">
              <a className="block text-gray-800 hover:text-primary font-medium" onClick={() => setMobileMenuOpen(false)}>
                Gallery
              </a>
            </Link>
            <Link href="/#progress">
              <a className="block text-gray-800 hover:text-primary font-medium" onClick={() => setMobileMenuOpen(false)}>
                Progress
              </a>
            </Link>
            <button className="flex items-center text-gray-800 hover:text-primary font-medium">
              <Info className="h-5 w-5 mr-1" />
              Help
            </button>
            {user && (
              <>
                {user.isAdmin && (
                  <Link href="/admin">
                    <a className="block text-gray-800 hover:text-primary font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Admin Panel
                    </a>
                  </Link>
                )}
                <button 
                  className="flex items-center text-gray-800 hover:text-primary font-medium"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-1" />
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
