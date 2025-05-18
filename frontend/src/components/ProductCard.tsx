
import { useNavigate } from "react-router-dom";
import { Product } from "../types/models";
import { useApp } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "minimal";
}

export const ProductCard = ({ product, variant = "default" }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useApp();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, 1);
    toast.success("Added to cart");
  };
  
  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  if (variant === "minimal") {
    return (
      <div 
        className="card-hover bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer animate-fade-in"
        onClick={handleViewDetails}
      >
        <div className="aspect-square overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-base truncate">{product.title}</h3>
          <p className="text-eco-green-600 font-medium">${product.price.toFixed(2)}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="card-hover bg-white rounded-lg overflow-hidden shadow-sm animate-slide-in"
      onClick={handleViewDetails}
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg truncate cursor-pointer">{product.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-eco-green-600 font-semibold text-lg">${product.price.toFixed(2)}</p>
          <span className="text-xs px-2 py-1 bg-eco-green-100 text-eco-green-800 rounded-full">
            {product.condition.replace('_', ' ')}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1 truncate">{product.category.replace('_', ' ')}</p>
        <div className="mt-3 flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          <Button 
            className="bg-eco-green-500 hover:bg-eco-green-600" 
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
