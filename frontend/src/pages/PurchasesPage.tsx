
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

export const PurchasesPage = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const { purchases, currentUser, isAuthenticated } = state;

  // Filter purchases to only show the current user's if authenticated
  const userPurchases = isAuthenticated
    ? purchases.filter(purchase => purchase.userId === currentUser?.id)
    : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

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

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Purchase History</h1>

      {userPurchases.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">No purchases yet</h2>
          <p className="text-muted-foreground mb-6">
            Once you make a purchase, it will appear here.
          </p>
          <Button
            className="bg-eco-green-600 hover:bg-eco-green-700"
            asChild
          >
            <Link to="/">Browse Items</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {userPurchases.map((purchase) => (
            <div 
              key={purchase.id} 
              className="border rounded-lg bg-white overflow-hidden animate-slide-in"
            >
              <div className="p-4 border-b bg-muted/30">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Order #{purchase.id.slice(-8)}</span>
                    <p className="text-sm text-gray-500">
                      Purchased on {formatDate(purchase.purchasedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">Total:</span>
                    <p className="text-lg font-bold text-eco-green-700">
                      ${purchase.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {purchase.products.map(({ product, quantity }) => (
                  <div 
                    key={`${purchase.id}-${product.id}`} 
                    className="flex py-3 first:pt-0 last:pb-0 border-b last:border-b-0"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
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
                        <div className="text-right">
                          <p className="font-medium">${product.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Qty: {quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
