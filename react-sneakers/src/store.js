import { create } from "zustand";

// Zustand store definition
export const useStore = create((set) => ({
    // User state and setter function
    user: null, // Stores the current user's information
    setUser: (user) => set({ user: user }), // Updates the user state

    // Cart state and functions
    cart: [], // Stores items in the cart
    addToCart: (product) => 
        set((state) => ({
            cart: [...state.cart, { product: product }], // Adds a new product to the cart
        })),
    removeFromCart: (product) => 
        set((state) => ({
            cart: state.cart.filter((p) => p.product.id !== product.id), // Removes a product from the cart by ID
        })),
    setCart: (cart) => set({ cart: cart }), // Sets the cart state directly

    // Favorites state and functions
    favorites: [], // Stores favorite items
    addToFavorites: (product) => 
        set((state) => ({
            favorites: [...state.favorites, { product: product }], // Adds a product to favorites
        })),
    removeFromFavorites: (product) => 
        set((state) => ({
            favorites: state.favorites.filter((p) => p.product.id !== product.id), // Removes a product from favorites by ID
        })),
    setFavorites: (favorites) => set({ favorites: favorites }), // Sets the favorites state directly
}));
