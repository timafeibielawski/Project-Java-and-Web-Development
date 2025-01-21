import React from 'react';
import { createRoot } from 'react-dom/client'; // React 18+ method to render React apps
import './index.scss'; // Import global styles
import App from './App'; // Main app component
import reportWebVitals from './reportWebVitals'; // Tool for measuring app performance
import { RouterProvider, createBrowserRouter } from 'react-router-dom'; // React Router for routing
import FavoritesPage from './Favorites'; // Favorites page component
import SignIn from './SignIn'; // Sign-in page component
import SignUp from './SignUp'; // Sign-up page component

// Define the routes for the application
const router = createBrowserRouter([
  {
    path: '/', // Default path for the home page
    element: <App />, // Renders the main App component
  },
  {
    path: '/favorites', // Path for the favorites page
    element: <FavoritesPage />, // Renders the FavoritesPage component
  },
  {
    path: '/signin', // Path for the sign-in page
    element: <SignIn />, // Renders the SignIn component
  },
  {
    path: '/signup', // Path for the sign-up page
    element: <SignUp />, // Renders the SignUp component
  },
]);

// Render the application to the DOM
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} /> // Provides routing context to the app
);

// Measure app performance (optional)
reportWebVitals();
