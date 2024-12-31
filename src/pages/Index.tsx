import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import ProductGrid from "@/components/ProductGrid";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const openInNewTab = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      const url = chrome.runtime.getURL('index.html');
      window.open(url, '_blank');
    }
  };

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
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openInNewTab}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in Tab
                  </Button>
                  <SidebarTrigger />
                </div>
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