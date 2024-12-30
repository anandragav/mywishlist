import ProductGrid from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-4 px-6">
          <h1 className="text-2xl font-bold text-primary">Product Comparison</h1>
        </div>
      </header>
      <ProductGrid />
    </div>
  );
};

export default Index;