
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShoppingCart, ArrowLeft, Edit, Trash } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { state, addToCart, deleteProduct } = useApp();
  const { products, currentUser } = state;
  
  const [product, setProduct] = useState(
    products.find(p => p.id === productId)
  );
  
  const [quantity, setQuantity] = useState(1);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!product) {
      navigate("/not-found");
      return;
    }

    setIsOwner(currentUser?.id === product.sellerId);
  }, [product, currentUser, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
      toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart`);
    }
  };

  const handleDeleteProduct = () => {
    if (product) {
      deleteProduct(product.id);
      toast.success("Product deleted successfully");
      navigate("/");
    }
  };

  if (!product) {
    return null; // Will redirect in useEffect
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ");
  };

  const formatCondition = (condition: string) => {
    return condition
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

      <div className="grid md:grid-cols-2 gap-8">
        <div className="animate-zoom-in">
          <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-sm">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="animate-slide-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h1>
          
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="outline" className="bg-eco-green-50">
              {formatCategory(product.category)}
            </Badge>
            <Badge variant="outline" className="bg-eco-brown-50">
              {formatCondition(product.condition)}
            </Badge>
          </div>
          
          <p className="text-2xl font-bold text-eco-green-700 mb-4">
            ${product.price.toFixed(2)}
          </p>
          
          <div className="bg-white rounded-lg p-4 border mb-6">
            <h2 className="font-medium mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span>Added by {product.sellerName} on {formatDate(product.createdAt)}</span>
          </div>

          {isOwner ? (
            <div className="flex space-x-4">
              <Button
                className="flex-1"
                variant="outline"
                asChild
              >
                <Link to={`/edit-product/${product.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="flex-1"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      listing.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleDeleteProduct}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button
                  className="px-3 py-2 border-r"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <div className="px-4 py-2">{quantity}</div>
                <button
                  className="px-3 py-2 border-l"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <Button
                className="flex-1 bg-eco-green-600 hover:bg-eco-green-700"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
