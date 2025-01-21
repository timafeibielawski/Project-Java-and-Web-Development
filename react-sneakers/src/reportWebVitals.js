const reportWebVitals = (onPerfEntry) => {
  // Check if a callback is provided and if it's a function
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the 'web-vitals' library
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Call each web-vitals function with the provided callback
      getCLS(onPerfEntry); // Measures Cumulative Layout Shift (CLS)
      getFID(onPerfEntry); // Measures First Input Delay (FID)
      getFCP(onPerfEntry); // Measures First Contentful Paint (FCP)
      getLCP(onPerfEntry); // Measures Largest Contentful Paint (LCP)
      getTTFB(onPerfEntry); // Measures Time to First Byte (TTFB)
    });
  }
};

export default reportWebVitals;
