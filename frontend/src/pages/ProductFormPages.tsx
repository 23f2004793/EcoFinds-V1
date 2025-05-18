
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Upload } from "lucide-react";
import { Product, ProductCategory, ProductCondition } from "../types/models";

const categoryOptions = [
  { value: "clothing", label: "Clothing & Accessories" },
  { value: "furniture", label: "Furniture" },
  { value: "electronics", label: "Electronics" },
  { value: "books", label: "Books" },
  { value: "home_decor", label: "Home Decor" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "toys", label: "Toys & Games" },
  { value: "other", label: "Other" },
];

const conditionOptions = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "worn", label: "Worn" },
];

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: ProductCategory;
  condition: ProductCondition;
  imageUrl: string;
}

const defaultImageUrl = "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3";

export const AddProductPage = () => {
  const navigate = useNavigate();
  const { addProduct, state } = useApp();
  const { isAuthenticated } = state;
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: "",
    category: "clothing",
    condition: "good",
    imageUrl: defaultImageUrl,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to add products");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleRandomImage = () => {
    // Generate a random image for demo purposes
    const images = [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1999&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=987&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=80&w=1925&ixlib=rb-4.0.3",
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setFormData(prev => ({ ...prev, imageUrl: randomImage }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error("Please enter a valid price");
      }

      addProduct({
        title: formData.title,
        description: formData.description,
        price,
        category: formData.category,
        condition: formData.condition,
        imageUrl: formData.imageUrl,
      });

      toast.success("Product added successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Redirected in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="outline"
          size="sm"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold mb-6">Add New Listing</h1>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Vintage Denim Jacket"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange("condition", value as ProductCondition)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 25.99"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your item in detail..."
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Product Image</Label>
                <div className="flex items-center gap-4">
                  <div className="relative h-32 w-32 overflow-hidden rounded-md border">
                    <img
                      src={formData.imageUrl}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="w-full"
                      onClick={handleRandomImage}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Use Demo Image
                    </Button>
                    <p className="text-xs text-gray-500">
                      For this prototype, we'll use a randomly selected image
                    </p>
                  </div>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const EditProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { state, updateProduct } = useApp();
  const { products, isAuthenticated, currentUser } = state;
  const [isLoading, setIsLoading] = useState(false);
  
  const product = products.find(p => p.id === productId);
  
  const [formData, setFormData] = useState<ProductFormData>({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price.toString() || "",
    category: product?.category || "clothing",
    condition: product?.condition || "good",
    imageUrl: product?.imageUrl || defaultImageUrl,
  });

  // Redirect if not authenticated or not the owner
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to edit products");
      navigate("/login");
      return;
    }

    if (!product) {
      toast.error("Product not found");
      navigate("/");
      return;
    }

    if (product.sellerId !== currentUser?.id) {
      toast.error("You can only edit your own listings");
      navigate("/");
      return;
    }
  }, [isAuthenticated, product, currentUser, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleRandomImage = () => {
    // Generate a random image for demo purposes
    const images = [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1999&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=987&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=80&w=1925&ixlib=rb-4.0.3",
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setFormData(prev => ({ ...prev, imageUrl: randomImage }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) {
      toast.error("Product not found");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error("Please enter a valid price");
      }

      const updatedProduct: Product = {
        ...product,
        title: formData.title,
        description: formData.description,
        price,
        category: formData.category,
        condition: formData.condition,
        imageUrl: formData.imageUrl,
      };

      updateProduct(updatedProduct);
      toast.success("Product updated successfully!");
      navigate(`/product/${product.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product || !isAuthenticated || product.sellerId !== currentUser?.id) {
    return null; // Redirected in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="outline"
          size="sm"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold mb-6">Edit Listing</h1>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Vintage Denim Jacket"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange("condition", value as ProductCondition)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 25.99"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your item in detail..."
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Product Image</Label>
                <div className="flex items-center gap-4">
                  <div className="relative h-32 w-32 overflow-hidden rounded-md border">
                    <img
                      src={formData.imageUrl}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="w-full"
                      onClick={handleRandomImage}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Change Image
                    </Button>
                    <p className="text-xs text-gray-500">
                      For this prototype, we'll use a randomly selected image
                    </p>
                  </div>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Updating Product..." : "Update Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
