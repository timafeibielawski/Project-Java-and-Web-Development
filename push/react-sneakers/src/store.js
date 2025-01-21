import {create} from "zustand";

export const useStore = create((set ) => ({
    user: null,
    setUser: (user) => set({user: user}),
    cart: [],
    addToCart: (product) => set((state) => ({cart: [...state.cart, {product: product}]})),
    removeFromCart: (product) => set((state) => ({cart: state.cart.filter((p) => p.product.id !== product.id)})),
    setCart: (cart) => set({cart: cart}),
    favorites: [],
    addToFavorites: (product) => set((state) => ({favorites: [...state.favorites, {product: product}]})),
    removeFromFavorites: (product) => set((state) => ({favorites: state.favorites.filter((p) => p.product.id !== product.id)})),
    setFavorites: (favorites) => set({favorites: favorites}),
}))