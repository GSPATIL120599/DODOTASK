import { ArrowRight } from "lucide-react";
import type { DemoProduct } from "../data/products";

type ProductCatalogProps = {
  products: DemoProduct[];
  selectedProduct: DemoProduct;
  selectedCategory: string;
  categories: string[];
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: DemoProduct) => void;
};

export function ProductCatalog({
  products,
  selectedProduct,
  selectedCategory,
  categories,
  onSelectCategory,
  onSelectProduct,
}: ProductCatalogProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Available Products
          </h2>
          <p className="text-xs text-slate-500">
            Select a product below to update the checkout target.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {products.map((prod) => {
          const isSelected = selectedProduct.id === prod.id;
          return (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${isSelected
                  ? "border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-sm"
                  : "border-slate-200/90 bg-white/70 hover:border-slate-300 hover:bg-white shadow-2xs"
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {prod.category}
                  </span>
                  <h3 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {prod.name}
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  ${prod.price}
                </span>
              </div>

              <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {prod.description}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
                <span className={`font-medium ${isSelected ? "text-slate-900 font-semibold" : "text-slate-400"}`}>
                  {isSelected ? "● Selected" : "Select"}
                </span>
                <ArrowRight size={12} className={`transition-transform group-hover:translate-x-1 ${isSelected ? "text-slate-900" : "text-slate-400"}`} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
