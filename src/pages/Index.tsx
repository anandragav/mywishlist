import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import ProductGrid from "@/components/ProductGrid";

const Index = () => {
  console.log('Index component rendering...');
  
  return (
    <Sidebar side="right" variant="floating">
      <SidebarContent>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-4xl mx-auto py-4 px-6">
              <h1 className="text-2xl font-bold text-primary">Similar Products</h1>
            </div>
          </header>
          <ProductGrid />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default Index;