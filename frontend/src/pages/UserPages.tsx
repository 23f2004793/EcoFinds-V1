
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "../components/ProductCard";
import { ArrowLeft, Upload, Edit, Plus } from "lucide-react";
import { toast } from "sonner";

export const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const { currentUser, isAuthenticated, products, purchases } = state;

  // Form state for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(currentUser?.username || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");

  // Filtered lists
  const userListings = products.filter(
    product => isAuthenticated && product.sellerId === currentUser?.id
  );
  
  const userPurchases = purchases.filter(
    purchase => isAuthenticated && purchase.userId === currentUser?.id
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to view your dashboard");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleRandomAvatar = () => {
    // For demo, just use a random avatar
    const avatars = [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    ];
    setAvatar(avatars[Math.floor(Math.random() * avatars.length)]);
  };

  const handleSaveProfile = () => {
    // In a real app, this would update the database
    // For the prototype, just show a success message
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  if (!isAuthenticated || !currentUser) {
    return null; // Redirected in useEffect
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatar} />
                      <AvatarFallback className="bg-eco-green-100 text-eco-green-800 text-2xl">
                        {username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full"
                      onClick={handleRandomAvatar}
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={currentUser.email}
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed in this prototype
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-eco-green-600 hover:bg-eco-green-700"
                    onClick={handleSaveProfile}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="bg-eco-green-100 text-eco-green-800 text-2xl">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mt-4">{currentUser.username}</h2>
                <p className="text-gray-500 mt-1">{currentUser.email}</p>
                <p className="text-sm text-gray-500 mt-4">
                  Member since {new Date(currentUser.createdAt).toLocaleDateString()}
                </p>

                <Button
                  variant="outline"
                  className="mt-6 w-full"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="listings">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="purchases">Purchase History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="listings" className="mt-6">
              {userListings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <p className="text-lg font-medium mb-2">You haven't listed any items yet</p>
                  <p className="text-gray-500 mb-6">
                    Start selling your pre-loved items and join the sustainable movement.
                  </p>
                  <Button
                    className="bg-eco-green-600 hover:bg-eco-green-700"
                    asChild
                  >
                    <Link to="/add-product">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Listing
                    </Link>
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium">Your Listings ({userListings.length})</h2>
                    <Button
                      size="sm"
                      className="bg-eco-green-600 hover:bg-eco-green-700"
                      asChild
                    >
                      <Link to="/add-product">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userListings.map(product => (
                      <ProductCard key={product.id} product={product} variant="minimal" />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="purchases" className="mt-6">
              {userPurchases.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <p className="text-lg font-medium mb-2">No purchase history yet</p>
                  <p className="text-gray-500 mb-6">
                    Items you buy will appear here.
                  </p>
                  <Button
                    className="bg-eco-green-600 hover:bg-eco-green-700"
                    asChild
                  >
                    <Link to="/">Browse Items</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPurchases.map(purchase => (
                    <div 
                      key={purchase.id} 
                      className="bg-white p-4 rounded-lg border"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-medium">Order #{purchase.id.slice(-8)}</span>
                          <p className="text-sm text-gray-500">
                            Purchased on {new Date(purchase.purchasedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="font-bold text-eco-green-700">
                          ${purchase.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                        {purchase.products.slice(0, 3).map(({ product }) => (
                          <div 
                            key={`${purchase.id}-${product.id}`}
                            className="aspect-square rounded-md overflow-hidden"
                          >
                            <Link to={`/product/${product.id}`}>
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            </Link>
                          </div>
                        ))}
                      </div>
                      
                      <Button
                        variant="link"
                        className="mt-2 p-0 h-auto text-eco-green-700"
                        asChild
                      >
                        <Link to="/purchases">View Details</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export const MyListingsPage = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const { currentUser, isAuthenticated, products } = state;

  const userListings = products.filter(
    product => isAuthenticated && product.sellerId === currentUser?.id
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to view your listings");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Redirected in useEffect
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">My Listings</h1>
        <Button
          className="bg-eco-green-600 hover:bg-eco-green-700"
          asChild
        >
          <Link to="/add-product">
            <Plus className="h-4 w-4 mr-2" />
            Add New Listing
          </Link>
        </Button>
      </div>

      {userListings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
          <p className="text-lg font-medium mb-2">You haven't listed any items yet</p>
          <p className="text-gray-500 mb-6">
            Start selling your pre-loved items and join the sustainable movement.
          </p>
          <Button
            className="bg-eco-green-600 hover:bg-eco-green-700"
            asChild
          >
            <Link to="/add-product">
              <Plus className="h-4 w-4 mr-2" />
              Create Listing
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userListings.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
