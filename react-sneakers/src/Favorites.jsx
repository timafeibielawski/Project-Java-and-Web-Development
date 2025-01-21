import React, { useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer.js';
import { Link } from 'react-router-dom';
import { useStore } from "./store";
import Card from "./components/Card";

const FavoritesPage = () => {
    // State variables
    const [cartItems, setCartItems] = React.useState([]); // Stores cart items
    const [cartOpened, setCartOpened] = React.useState(false); // Toggles cart drawer
    const [totalPrice, setTotalPrice] = React.useState([]); // Tracks total price of items in the cart

    // Extracting state and actions from the store
    const { 
        favorites, cart, 
        addToCart, removeFromCart, 
        removeFromFavorites, addToFavorites 
    } = useStore();

    // Calculate total price whenever cart items change
    useEffect(() => {
        setTotalPrice(cartItems.reduce((sum, obj) => obj.price + sum, 0));
    }, [cartItems]);

    // Fetch initial cart items from mock API
    React.useEffect(() => {
        axios.get('https://651831b1582f58d62d357d58.mockapi.io/cart')
            .then((res) => {
                setCartItems(res.data); // Set cart items in state
            });
    }, []);

    // Add an item to the cart
    const onAddToCart = async (obj) => {
        await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/cart/${obj.id}`, {
            withCredentials: true,
        }).then(() => {
            addToCart(obj); // Update cart in the store
        }).catch((error) =>
            console.error('Error adding to cart:', error)
        );
    };

    // Remove an item from the cart
    const onRemoveItem = async (obj) => {
        await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/cart/${obj.id}`, {
            withCredentials: true,
        }).then(() => {
            removeFromCart(obj); // Remove item from store
            // Recalculate total price after removal
            setTotalPrice(cart.filter(p => p.product.id !== obj.id).reduce((sum, obj) => obj.product.price + sum, 0));
        });
    };

    // Toggle an item in favorites
    const addToFavoriteItem = async (obj) => {
        await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/favorite/${obj.id}`, {
            withCredentials: true,
        }).then(() => {
            if (favorites && favorites.some(f => f.product.id === obj.id)) {
                removeFromFavorites(obj); // Remove from favorites
            } else {
                addToFavorites(obj); // Add to favorites
            }
        }).catch((error) =>
            console.error('Error toggling favorite status:', error)
        );
    };

    return (
        <div className="wrapper clear">
            {/* Conditional rendering of the cart drawer */}
            {cartOpened && (
                <Drawer
                    items={cartItems} // Items in the cart
                    onClose={() => setCartOpened(false)} // Close drawer callback
                    onRemove={onRemoveItem} // Remove item callback
                    totalPrice={totalPrice} // Pass total price
                />
            )}
            {/* Header with cart total price and cart toggle */}
            <Header totalPrice={totalPrice} onClickCart={() => setCartOpened(true)} />
            <div className="content p-10">
                <div className="flex items-center gap-3">
                    <Link to={'/'}>
                        {/* Back button */}
                        <div
                            className="p-2 border-zinc-300 border-[2px] w-7 h-7 flex items-center justify-center rounded-lg">
                            <img src="/img/arrow-back.svg" alt="back" />
                        </div>
                    </Link>
                    <h1 className="cut-text text-3xl font-bold">My bookmarks</h1>
                </div>
            </div>
            <div className={"overflow-scroll"}>
                {favorites && favorites.length > 0 ? (
                    <div className={"px-10 flex flex-wrap gap-5"}>
                        {/* Render favorite items */}
                        {favorites.map((obj) => (
                            <Card
                                key={obj.product.id} // Unique key for React
                                {...obj.product} // Pass product details
                                favoriteList={favorites}
                                isFavorite={favorites && favorites.some(f => f.product.id === obj.product.id)}
                                isAdded={cart && cart.some(
                                    (i) => Number(i.id) === Number(obj.id)
                                )}
                                onRemoveFavorite={() => addToFavoriteItem(obj.product)} // Remove from favorites
                                onFavorite={() => addToFavoriteItem(obj.product)} // Toggle favorite status
                                onPlus={() => onAddToCart(obj.product)} // Add to cart
                            />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Empty state when no favorites */}
                        <div className='empty'>
                            <img src="/img/out-of-stock.png" alt="empty icon" />
                        </div>
                        <div className='emptyFavorites'>
                            <p>You don't have any bookmarks yet.</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
