
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface AuthFormData {
  email: string;
  password: string;
  username?: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Since we're using mock data, use jane@example.com as the demo login
      await login(formData.email || 'jane@example.com', formData.password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Invalid email or password");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="max-w-md mx-auto">
        <Button
          variant="outline"
          size="sm"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-4">
            <span className="text-3xl font-bold bg-eco-gradient bg-clip-text text-transparent">
              Eco<span className="text-eco-brown-500">Finds</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Log in to your EcoFinds account</p>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="******"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-eco-green-600 hover:underline">
              Sign up
            </Link>
          </p>

          <p className="text-sm text-gray-500 mt-4">
            For demo purposes, you can use: <br />
            Email: jane@example.com <br />
            Password: any password will work
          </p>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useApp();
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.username) {
        throw new Error("Username is required");
      }

      await register(formData.email, formData.password, formData.username);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="max-w-md mx-auto">
        <Button
          variant="outline"
          size="sm"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-4">
            <span className="text-3xl font-bold bg-eco-gradient bg-clip-text text-transparent">
              Eco<span className="text-eco-brown-500">Finds</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-gray-500 mt-2">Join the sustainable marketplace</p>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="e.g. eco_shopper"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="******"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-eco-green-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
