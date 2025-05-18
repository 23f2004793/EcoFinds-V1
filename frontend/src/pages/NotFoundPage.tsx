
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-500 mb-8">Oops! This page doesn't exist</p>
      
      <div className="max-w-md text-center mb-8">
        <p className="text-muted-foreground">
          The page you're looking for might have been moved, deleted, 
          or it might never have existed in the first place.
        </p>
      </div>
      
      <Button
        className="bg-eco-green-600 hover:bg-eco-green-700"
        size="lg"
        asChild
      >
        <Link to="/">Return to Homepage</Link>
      </Button>
    </div>
  );
};
