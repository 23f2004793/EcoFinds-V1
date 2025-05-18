import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "./LOGO-.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  ShoppingCart,
  Menu,
  User,
  LogOut,
  Home,
  Package,
  Heart,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export const Header = () => {
  const { state, logout, setSearchTerm } = useApp();
  const { currentUser, isAuthenticated, cart } = state;
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchQuery);

    // If not already on the home page, navigate there
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-sm animate-fade-in">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <img
            src={logo}
            alt="EcoFinds Logo"
            className="h-10 w-auto object-contain"
          />
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-eco-gradient bg-clip-text text-transparent">
              Eco<span className="text-eco-brown-500">Finds</span>
            </span>
          </Link>

          {/* Search - Hide on mobile */}
          <form className="hidden md:flex flex-1 mx-8" onSubmit={handleSearch}>
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for items..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-eco-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Avatar>
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback className="bg-eco-green-100 text-eco-green-800">
                      {currentUser?.username.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </Button>
                <Button
                  className="bg-eco-green-600 hover:bg-eco-green-700"
                  size="sm"
                  onClick={() => navigate("/register")}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-2 md:hidden">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-eco-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  {/* Search in mobile menu */}
                  <form className="my-4" onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="search"
                        placeholder="Search for items..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>

                  <nav className="flex flex-col space-y-1">
                    <Link
                      to="/"
                      className="flex items-center py-2 px-3 rounded-md hover:bg-eco-green-50"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Link>

                    {isAuthenticated && (
                      <>
                        <Link
                          to="/dashboard"
                          className="flex items-center py-2 px-3 rounded-md hover:bg-eco-green-50"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <Link
                          to="/my-listings"
                          className="flex items-center py-2 px-3 rounded-md hover:bg-eco-green-50"
                        >
                          <Package className="h-4 w-4 mr-2" />
                          My Listings
                        </Link>
                        <Link
                          to="/purchases"
                          className="flex items-center py-2 px-3 rounded-md hover:bg-eco-green-50"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Purchase History
                        </Link>
                      </>
                    )}
                  </nav>

                  <Separator className="my-4" />

                  <div className="mt-auto">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center mb-4">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={currentUser?.avatar} />
                            <AvatarFallback className="bg-eco-green-100 text-eco-green-800">
                              {currentUser?.username.charAt(0).toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {currentUser?.username}
                          </span>
                        </div>
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => {
                            logout();
                            navigate("/");
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Log out
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <Button
                          className="bg-eco-green-600 hover:bg-eco-green-700 w-full"
                          onClick={() => navigate("/register")}
                        >
                          Sign up
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate("/login")}
                        >
                          Log in
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
