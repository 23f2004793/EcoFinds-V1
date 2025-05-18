
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { CategoryFilter } from "../components/CategoryFilter";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "../types/models";
import { Search, Plus } from "lucide-react";

export const HomePage = () => {
  const { state, setSearchTerm } = useApp();
  const { products, searchTerm, selectedCategory, isAuthenticated } = state;
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Filter products based on search term and category
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearch);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search - Mobile only */}
      <form 
        className="mb-4 md:hidden" 
        onSubmit={handleSearch}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search for items..."
            className="pl-10"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </form>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-eco-green-100 to-eco-green-50 rounded-xl p-6 md:p-12 mb-8 animate-fade-in">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Find Sustainable Treasures, <br className="hidden sm:block" /> Share the Joy of Reuse
          </h1>
          <p className="text-gray-700 mb-6">
            Join our community dedicated to extending the lifecycle of products and reducing waste.
            Buy, sell, and discover unique pre-loved items.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              className="bg-eco-green-600 hover:bg-eco-green-700"
              size="lg"
              onClick={() => window.scrollTo({ top: document.getElementById('browse')?.offsetTop || 0, behavior: 'smooth' })}
            >
              Browse Items
            </Button>
            {isAuthenticated && (
              <Button
                variant="outline"
                size="lg"
                asChild
              >
                <Link to="/add-product">
                  <Plus className="mr-2 h-4 w-4" />
                  List an Item
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div id="browse">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Browse Items</h2>
          
          {isAuthenticated && (
            <Button
              className="bg-eco-green-600 hover:bg-eco-green-700"
              size="sm"
              asChild
            >
              <Link to="/add-product">
                <Plus className="mr-2 h-4 w-4" />
                List an Item
              </Link>
            </Button>
          )}
        </div>

        <CategoryFilter />
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? "Try adjusting your search or category filter" 
                : "No items available in this category"}
            </p>
            {isAuthenticated && (
              <Button
                className="bg-eco-green-600 hover:bg-eco-green-700"
                asChild
              >
                <Link to="/add-product">
                  <Plus className="mr-2 h-4 w-4" />
                  List an Item
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
