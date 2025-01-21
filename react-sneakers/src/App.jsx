import React, { useEffect } from 'react';
import axios from 'axios';
import Card from './components/Card';
import Header from './components/Header';
import Drawer from './components/Drawer.js';
import CarouselElement from './components/Carousel';
import { useStore } from "./store";

function App({ children }) {
    // State variables
    const [items, setItems] = React.useState([]); // Stores sneaker items
    const [searchValue, setSearchValue] = React.useState(''); // Manages search input
    const [cartOpened, setCartOpened] = React.useState(false); // Toggles cart drawer
    const [totalPrice, setTotalPrice] = React.useState([]); // Tracks total cart price
    
    // Extracting state and actions from the store
    const { 
        cart, favorites, user, 
        setCart, setFavorites, removeFromFavorites, 
        addToFavorites, setUser, addToCart, removeFromCart 
    } = useStore();

    // Fetch user data and cart/favorites information on component mount
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/me`, {
            withCredentials: true,
        }).then((res) => {
            setUser(res.data.user); // Set user data
            setFavorites(res.data.user.favorite); // Set favorite items
            setCart(res.data.user.cart); // Set cart items
        }).catch(() => {
            // Attempt to refresh session if not authenticated
            axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/refresh`, {
                withCredentials: true,
            }).then((res) => {
                setUser(res.data.user);
                setFavorites(res.data.user.favorite);
                setCart(res.data.user.cart);
            }).catch(() => {
                // Log out user if session cannot be refreshed
                axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, {
                    withCredentials: true,
                });
            });
        });
    }, []);

    // Recalculate total price when cart changes
    useEffect(() => {
        if (cart && cart.length) {
            setTotalPrice(cart.reduce((sum, obj) => obj.product.price + sum, 0));
        }
    }, [cart.length]);

    // Fetch all sneaker items from the server on component mount
    React.useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/sneakers`)
            .then((res) => {
                setItems(res.data); // Set items in state
            });
    }, []);

    // Updates search input state
    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    // Adds an item to the cart
    const onAddToCart = (obj) => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/users/cart/${obj.id}`, {
            withCredentials: true,
        }).then(() => {
            addToCart(obj); // Add to cart in the store
        }).catch((error) =>
            console.error('Error adding to cart:', error)
        );
    };

    // Removes an item from the cart
    const onRemoveItem = async (obj) => {
        await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/cart/${obj.id}`, {
            withCredentials: true,
        }).then(() => {
            removeFromCart(obj); // Remove from cart in the store
            // Update total price after removal
            setTotalPrice(cart.filter(p => p.product.id !== obj.id).reduce((sum, obj) => obj.product.price + sum, 0));
        });
    };

    // Toggles item in favorites
    const addToFavoriteItem = async (obj) => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/users/favorite/${obj.id}`, {
            withCredentials: true,
        }).then(() => {
            if (favorites && favorites.some(f => f.product.id === obj.id)) {
                removeFromFavorites(obj); // Remove from favorites
            } else {
                addToFavorites(obj); // Add to favorites
            }
        }).catch((error) =>
            console.error('Error adding to favorites:', error)
        );
    };

    return (
        <div className="wrapper clear">
            {/* Conditional rendering of the cart drawer */}
            {cartOpened && (
                <Drawer
                    items={cart.map((obj) => obj.product)} // Pass cart items to the drawer
                    onClose={() => setCartOpened(false)} // Close drawer callback
                    onRemove={onRemoveItem} // Remove item callback
                    totalPrice={totalPrice} // Pass total price
                />
            )}
            {/* Header with cart toggle functionality */}
            <Header totalPrice={totalPrice} onClickCart={() => setCartOpened(true)} />
            <CarouselElement />
            <div className="content p-10">
                <div className="flex items-center justify-between mb-10">
                    {/* Display search results or a default title */}
                    <h1 className="cut-text text-3xl font-bold">
                        {searchValue
                            ? `Search results for: "${searchValue}"`
                            : 'All Sneakers'}
                    </h1>
                    {/* Search bar */}
                    <div className="search-block flex">
                        <img src="/img/search.svg" alt="search" />
                        {searchValue && (
                            <img
                                className="remove_input-btn"
                                src="/img/btn-remove.svg"
                                alt="clear"
                                onClick={() => setSearchValue('')} // Clear search input
                            />
                        )}
                        <input
                            onChange={onChangeSearchInput}
                            value={searchValue}
                            type="text"
                            placeholder="Search"
                        />
                    </div>
                </div>

                {/* Display sneaker cards or empty state */}
                <div className="card-wrapper flex flex-wrap">
                    {items.filter((item) =>
                        item.name.toLowerCase().includes(searchValue)
                    ).length ? (
                        items
                            .filter((item) => item.name.toLowerCase().includes(searchValue))
                            .map((item) => (
                                <Card
                                    key={item.id}
                                    {...item}
                                    favoriteList={favorites}
                                    isFavorite={favorites && favorites.some(f => f.product.id === item.id)}
                                    isAdded={cart && cart.some(
                                        (obj) => Number(obj.id) === Number(item.id)
                                    )}
                                    onRemoveFavorite={() => addToFavoriteItem(item)}
                                    onFavorite={() => addToFavoriteItem(item)}
                                    onPlus={() => onAddToCart(item)}
                                />
                            ))
                    ) : (
                        <div className="empty">
                            <img src="/img/out-of-stock.png" alt="empty" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
