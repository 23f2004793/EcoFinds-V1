
import { createContext, ReactNode, useContext, useReducer, useEffect, useState } from 'react';
import { User, Product, CartItem, Purchase, ProductCategory } from '../types/models';
import * as api from '../services/api';
import { toast } from "sonner";

// Define the state structure
interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  products: Product[];
  cart: CartItem[];
  purchases: Purchase[];
  searchTerm: string;
  selectedCategory: ProductCategory | 'all';
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: AppState = {
  currentUser: null,
  isAuthenticated: false,
  products: [],
  cart: [],
  purchases: [],
  searchTerm: '',
  selectedCategory: 'all',
  loading: false,
  error: null,
};

// Define action types
type AppAction =
  | { type: 'LOGIN_SUCCESS', payload: User }
  | { type: 'LOGIN_FAILURE', payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: string | null }
  | { type: 'SET_PRODUCTS', payload: Product[] }
  | { type: 'ADD_PRODUCT', payload: Product }
  | { type: 'UPDATE_PRODUCT', payload: Product }
  | { type: 'DELETE_PRODUCT', payload: string }
  | { type: 'SET_PURCHASES', payload: Purchase[] }
  | { type: 'ADD_TO_CART', payload: { productId: string, quantity: number } }
  | { type: 'UPDATE_CART_ITEM', payload: { productId: string, quantity: number } }
  | { type: 'REMOVE_FROM_CART', payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_PURCHASE', payload: Purchase }
  | { type: 'SET_SEARCH_TERM', payload: string }
  | { type: 'SET_CATEGORY', payload: ProductCategory | 'all' };

// Create the reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
        cart: [],
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
      };
    case 'SET_PURCHASES':
      return {
        ...state,
        purchases: action.payload,
      };
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(
        item => item.productId === action.payload.productId
      );

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    }
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.productId !== action.payload),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    case 'ADD_PURCHASE':
      return {
        ...state,
        purchases: [...state.purchases, action.payload],
      };
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload,
      };
    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
      };
    default:
      return state;
  }
}

// Create the context
interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, username: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'createdAt'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addToCart: (productId: string, quantity: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
  setSearchTerm: (term: string) => void;
  setCategory: (category: ProductCategory | 'all') => void;
  fetchProducts: () => Promise<void>;
  fetchPurchases: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Create the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the app
  useEffect(() => {
    const initializeApp = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Load cart from localStorage
      const savedCart = localStorage.getItem('ecofinds-cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          cart.forEach((item: CartItem) => {
            dispatch({
              type: 'ADD_TO_CART',
              payload: { productId: item.productId, quantity: item.quantity },
            });
          });
        } catch (error) {
          console.error('Failed to parse saved cart:', error);
          localStorage.removeItem('ecofinds-cart');
        }
      }

      // Check if user is logged in
      const token = localStorage.getItem('ecofinds-token');
      if (token) {
        try {
          const user = await api.getCurrentUser();
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
          
          // Fetch user's purchases
          await fetchPurchases();
        } catch (error) {
          console.error('Failed to authenticate user:', error);
          localStorage.removeItem('ecofinds-token');
        }
      }

      // Fetch products
      try {
        await fetchProducts();
      } catch (error) {
        console.error('Failed to fetch products:', error);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Failed to load products. Please try again later.' 
        });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
      setIsInitialized(true);
    };

    initializeApp();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('ecofinds-cart', JSON.stringify(state.cart));
    }
  }, [state.cart, isInitialized]);

  // Fetch products based on search term and category
  const fetchProducts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const products = await api.getProducts(
        state.selectedCategory === 'all' ? undefined : state.selectedCategory, 
        state.searchTerm || undefined
      );
      
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products. Please try again later.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch user purchases
  const fetchPurchases = async () => {
    if (!state.isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const purchases = await api.getUserPurchases();
      dispatch({ type: 'SET_PURCHASES', payload: purchases });
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Failed to load purchase history. Please try again later.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Helper functions for common actions
  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { user, token } = await api.loginUser(email, password);
      localStorage.setItem('ecofinds-token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      
      // Fetch user's purchases after login
      await fetchPurchases();
      
      toast.success('Logged in successfully!');
    } catch (error) {
      const errorMsg = 'Invalid email or password';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMsg });
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('ecofinds-token');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const register = async (email: string, password: string, username: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { user, token } = await api.registerUser(email, password, username);
      localStorage.setItem('ecofinds-token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      toast.success('Account created successfully!');
    } catch (error) {
      const errorMsg = 'Registration failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'createdAt'>) => {
    if (!state.currentUser) {
      const errorMsg = 'Must be logged in to add a product';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const newProduct = await api.createProduct({
        ...product,
        sellerId: state.currentUser.id,
        sellerName: state.currentUser.username,
        createdAt: new Date().toISOString(),
      });
      
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      toast.success('Product added successfully!');
      return newProduct;
    } catch (error) {
      const errorMsg = 'Failed to add product. Please try again.';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateProduct = async (product: Product) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const updatedProduct = await api.updateProduct(product.id, product);
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
      toast.success('Product updated successfully!');
    } catch (error) {
      const errorMsg = 'Failed to update product. Please try again.';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteProduct = async (productId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await api.deleteProduct(productId);
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
      toast.success('Product deleted successfully!');
    } catch (error) {
      const errorMsg = 'Failed to delete product. Please try again.';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = (productId: string, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId, quantity } });
    toast.success('Added to cart');
  };

  const updateCartItem = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { productId, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    toast.success('Removed from cart');
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const checkout = async () => {
    if (state.cart.length === 0 || !state.currentUser) {
      toast.error('Your cart is empty or you are not logged in');
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const cartProducts = state.cart.map(item => {
        const product = state.products.find(p => p.id === item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        return {
          product,
          quantity: item.quantity,
        };
      });
      
      const totalAmount = cartProducts.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      
      const purchase = {
        userId: state.currentUser.id,
        products: cartProducts,
        totalAmount,
        purchasedAt: new Date().toISOString(),
      };
      
      const newPurchase = await api.createPurchase(purchase);
      
      dispatch({ type: 'ADD_PURCHASE', payload: newPurchase });
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Purchase completed successfully!');
    } catch (error) {
      const errorMsg = 'Failed to complete purchase. Please try again.';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setSearchTerm = (term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  };

  const setCategory = (category: ProductCategory | 'all') => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  // Effect to fetch products when search term or category changes
  useEffect(() => {
    if (isInitialized) {
      fetchProducts();
    }
  }, [state.searchTerm, state.selectedCategory, isInitialized]);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        register,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        checkout,
        setSearchTerm,
        setCategory,
        fetchProducts,
        fetchPurchases
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook to use the AppContext
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
