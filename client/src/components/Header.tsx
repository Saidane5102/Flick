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
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-[#FAF9F7] border-b border-[#E9E6DD]">
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Logo - Memorisely Style */}
          <div className="flex items-center">
            <div className="h-10 w-10 bg-[#212121] flex items-center justify-center rounded-[8px]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="ml-3 text-lg md:text-xl font-semibold text-[#212121]">
              Design Deck Challenge
            </h1>
          </div>
        </div>

        {/* Desktop navigation - Memorisely Style */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/">
            <a className={`text-[#212121] hover:text-black transition-colors text-sm ${location === "/" ? "font-semibold" : ""}`}>
              Home
            </a>
          </Link>
          <Link href="/#gallery">
            <a className="text-[#212121] hover:text-black transition-colors text-sm">
              Gallery
            </a>
          </Link>
          <Link href="/#progress">
            <a className="text-[#212121] hover:text-black transition-colors text-sm">
              Progress
            </a>
          </Link>
          
          <Button variant="ghost" className="text-sm p-0 hover:bg-transparent">
            <Info className="h-5 w-5 text-[#212121] hover:text-black cursor-pointer" />
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-[8px] p-0 hover:bg-[#E9E6DD] transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#E9E6DD] text-[#212121]">
                    <User className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-[#E9E6DD] bg-[#FAF9F7] rounded-[8px]">
                <DropdownMenuItem className="text-sm py-2 text-[#212121]">
                  Signed in as <strong className="ml-1">{user.username}</strong>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#E9E6DD]" />
                <DropdownMenuItem asChild>
                  <div className="flex items-center cursor-pointer py-2 text-[#212121]" onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </div>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem asChild>
                    <div className="flex items-center cursor-pointer py-2 text-[#212121]" onClick={() => navigate("/admin")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </div>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="py-2 text-[#212121]">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile menu button - Memorisely Style */}
        <button
          className="md:hidden text-[#212121]"
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
        <div className="md:hidden border-t border-[#E9E6DD] bg-[#FAF9F7]">
          <div className="px-4 py-5 space-y-5">
            <Link href="/">
              <a className="block text-[#212121] hover:text-black text-sm" onClick={() => setMobileMenuOpen(false)}>
                Home
              </a>
            </Link>
            <Link href="/#gallery">
              <a className="block text-[#212121] hover:text-black text-sm" onClick={() => setMobileMenuOpen(false)}>
                Gallery
              </a>
            </Link>
            <Link href="/#progress">
              <a className="block text-[#212121] hover:text-black text-sm" onClick={() => setMobileMenuOpen(false)}>
                Progress
              </a>
            </Link>
            <button className="flex items-center text-[#212121] hover:text-black text-sm">
              <Info className="h-4 w-4 mr-2" />
              Help
            </button>
            {user && (
              <>
                <div className="block" onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/profile");
                }}>
                  <div className="flex items-center text-[#212121] hover:text-black text-sm cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </div>
                </div>
                {user.isAdmin && (
                  <div className="block" onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/admin");
                  }}>
                    <div className="flex items-center text-[#212121] hover:text-black text-sm cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </div>
                  </div>
                )}
                <button 
                  className="flex items-center text-[#212121] hover:text-black text-sm"
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
