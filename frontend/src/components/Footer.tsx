
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-eco-gradient bg-clip-text text-transparent">
                Eco<span className="text-eco-brown-500">Finds</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 mb-4">
              A sustainable marketplace for pre-loved items. Join our community and help reduce waste while finding unique treasures.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-eco-green-600">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-500 hover:text-eco-green-600">About Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-500 hover:text-eco-green-600">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-eco-green-600">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/?category=clothing" className="text-gray-500 hover:text-eco-green-600">Clothing</Link>
              </li>
              <li>
                <Link to="/?category=furniture" className="text-gray-500 hover:text-eco-green-600">Furniture</Link>
              </li>
              <li>
                <Link to="/?category=electronics" className="text-gray-500 hover:text-eco-green-600">Electronics</Link>
              </li>
              <li>
                <Link to="/?category=books" className="text-gray-500 hover:text-eco-green-600">Books</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} EcoFinds. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <Link to="/terms" className="text-xs text-gray-500 hover:text-eco-green-600">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-eco-green-600">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
