import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import ProductGrid from "@/components/ProductGrid";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <>
      <Sidebar side="right" variant="floating" className="group-data-[state=expanded]:!w-[75vw]">
        <SidebarContent>
          <motion.div 
            className="min-h-screen bg-gray-50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Your bookmarked products from across the web
                  </p>
                </div>
                <SidebarTrigger />
              </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <ProductGrid />
            </main>
          </motion.div>
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default Index;