
import { ProductCategory } from "../types/models";
import { useApp } from "../context/AppContext";
import { cn } from "@/lib/utils";

// All possible categories plus "all" option
const categories = [
  { value: "all", label: "All Items" },
  { value: "clothing", label: "Clothing" },
  { value: "furniture", label: "Furniture" },
  { value: "electronics", label: "Electronics" },
  { value: "books", label: "Books" },
  { value: "home_decor", label: "Home Decor" },
  { value: "sports", label: "Sports" },
  { value: "toys", label: "Toys" },
  { value: "other", label: "Other" },
];

interface CategoryFilterProps {
  className?: string;
}

export const CategoryFilter = ({ className }: CategoryFilterProps) => {
  const { state, setCategory } = useApp();
  const { selectedCategory } = state;

  return (
    <div className={cn("flex flex-wrap gap-2 my-4", className)}>
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => setCategory(category.value as ProductCategory | "all")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-colors",
            selectedCategory === category.value
              ? "bg-eco-green-500 text-white"
              : "bg-muted hover:bg-eco-green-100 text-foreground"
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};
