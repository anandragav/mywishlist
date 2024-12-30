import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import ProductGrid from "@/components/ProductGrid";

const Index = () => {
  return (
    <Sidebar side="right" variant="floating">
      <SidebarContent>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="mt-2 text-sm text-gray-600">
                Your bookmarked products from across the web
              </p>
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <ProductGrid />
          </main>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default Index;