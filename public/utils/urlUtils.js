// Helper functions for URL handling
export const isRestrictedUrl = (url) => {
  const restrictedProtocols = [
    'chrome://',
    'chrome-extension://',
    'about:',
    'edge://',
    'brave://',
    ''
  ];
  
  return restrictedProtocols.some(protocol => url.startsWith(protocol));
};

export const extractProductInfo = () => {
  try {
    // Look for common product page indicators
    const hasPrice = document.querySelector('[data-price], .price, .product-price, [itemprop="price"]') !== null;
    const hasProductTitle = document.querySelector('[data-product-title], .product-title, [itemprop="name"]') !== null;
    const hasAddToCart = document.querySelector('button[contains(text(), "Add to Cart")], .add-to-cart, #add-to-cart') !== null;
    const hasProductImage = document.querySelector('[data-product-image], .product-image, [itemprop="image"]') !== null;

    // Get product information
    const title = document.querySelector('h1')?.textContent || document.title;
    const price = document.querySelector('[data-price], .price, .product-price, [itemprop="price"]')?.textContent;
    const imageUrl = document.querySelector('[data-product-image], .product-image, [itemprop="image"]')?.src;
    const vendor = new URL(window.location.href).hostname;

    return {
      isProductPage: hasPrice || hasProductTitle || hasAddToCart || hasProductImage,
      productInfo: {
        title,
        price,
        imageUrl,
        vendor,
        url: window.location.href
      }
    };
  } catch (error) {
    console.error('Error extracting product info:', error);
    return {
      isProductPage: false,
      productInfo: null
    };
  }
};