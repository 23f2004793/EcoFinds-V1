
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Trash, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export const CartPage = () => {
  const { state, updateCartItem, removeFromCart, checkout } = useApp();
  const { cart, products, isAuthenticated } = state;
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product); // Filter out any items where the product doesn't exist

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) {
      return;
    }
    
    updateCartItem(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.success("Item removed from cart");
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    }
    
    setIsProcessing(true);
    
    setTimeout(() => {
      checkout();
      setIsProcessing(false);
      toast.success("Purchase completed successfully!");
      navigate("/purchases");
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <Button
        variant="outline"
        size="sm"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button
            className="bg-eco-green-600 hover:bg-eco-green-700"
            asChild
          >
            <Link to="/">Browse Items</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cartItems.map(({ product, quantity, productId }) => (
              product && (
                <div key={productId} className="flex border-b py-4 animate-slide-in">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </Link>
                  </div>
                  
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <Link 
                        to={`/product/${product.id}`}
                        className="font-medium hover:text-eco-green-600"
                      >
                        {product.title}
                      </Link>
                      <p className="font-medium text-eco-green-700">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-500">
                      {product.category.replace('_', ' ')}
                    </p>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border rounded-md">
                        <button
                          className="px-2 py-1 border-r"
                          onClick={() => handleQuantityChange(productId, quantity - 1)}
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <div className="px-3 py-1">{quantity}</div>
                        <button
                          className="px-2 py-1 border-l"
                          onClick={() => handleQuantityChange(productId, quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        className="text-gray-500 hover:text-red-500 transition-colors"
                        onClick={() => handleRemoveItem(productId)}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
          
          <div>
            <div className="bg-white p-6 border rounded-lg shadow-sm animate-slide-in">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-medium text-lg mb-6">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <Button
                className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                disabled={isProcessing}
                onClick={handleCheckout}
              >
                {isProcessing ? "Processing..." : "Checkout"}
              </Button>
              
              <p className="text-xs text-center mt-4 text-gray-500">
                By checking out, you agree to our{" "}
                <Link to="/terms" className="underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
