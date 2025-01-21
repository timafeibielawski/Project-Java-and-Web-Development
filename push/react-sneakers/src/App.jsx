import React, {useEffect} from 'react';
import axios from 'axios';
import Card from './components/Card';
import Header from './components/Header';
import Drawer from './components/Drawer.js';
import CarouselElement from './components/Carousel';
import {useStore} from "./store";

function App({children}) {
    const [items, setItems] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');
    const [cartOpened, setCartOpened] = React.useState(false);
    const [totalPrice, setTotalPrice] = React.useState([]);
    const {cart, favorites, user, setCart, setFavorites, removeFromFavorites, addToFavorites, setUser, addToCart, removeFromCart} = useStore()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/me`, {
            withCredentials: true,
        }).then((res) => {
            setUser(res.data.user)
            setFavorites(res.data.user.favorite)
            setCart(res.data.user.cart)
        }).catch(() => {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/refresh`, {
                withCredentials: true,
            }).then((res) => {
                setUser(res.data.user)
                setFavorites(res.data.user.favorite)
                setCart(res.data.user.cart)
            }).catch(() => {
                axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, {
                    withCredentials: true,
                })
            })
        })
    }, []);


    useEffect(() => {
        if(cart && cart.length) {
            setTotalPrice(cart.reduce((sum, obj) => obj.product.price + sum, 0));
        }
    }, [cart.length]);

    React.useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_URL}/sneakers`)
            .then((res) => {
                setItems(res.data);
            });
    }, []);

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    const onAddToCart = (obj) => {
        axios
            .get(`${process.env.REACT_APP_SERVER_URL}/users/cart/${obj.id}`, {
                withCredentials: true,
            })
            .then((re) => {
                addToCart(obj);
            })
            .catch((error) =>
                console.error('Ошибка при добавлении в корзину:', error)
            );
    };

    const onRemoveItem = async (obj) => {
        await axios
            .get(`${process.env.REACT_APP_SERVER_URL}/users/cart/${obj.id}`, {
                withCredentials: true,
            })
            .then((res) => {
                removeFromCart(obj)
                setTotalPrice(cart.filter(p => p.product.id !== obj.id).reduce((sum, obj) => obj.product.price + sum, 0));
            });
    };

    const addToFavoriteItem = async  (obj) => {
        console.log(obj)
        axios
            .get(`${process.env.REACT_APP_SERVER_URL}/users/favorite/${obj.id}`, {
                withCredentials: true,
            })
            .then((re) => {
                if(favorites && favorites.some(f => f.product.id === obj.id)) {
                    removeFromFavorites(obj)
                }else {
                    addToFavorites(obj);
                }

            })
            .catch((error) =>
                console.error('Ошибка при добавлении в корзину:', error)
            );
    }

    return (
        <div className="wrapper clear">
            {cartOpened && (
                <Drawer
                    items={cart.map((obj) => obj.product)}
                    onClose={() => setCartOpened(false)}
                    onRemove={onRemoveItem}
                    totalPrice={totalPrice}
                />
            )}
            <Header totalPrice={totalPrice} onClickCart={() => setCartOpened(true)}/>
            <CarouselElement/>
            <div className="content p-10">
                <div className="flex items-center justify-between mb-10">
                    <h1 className="cut-text text-3xl font-bold">
                        {searchValue
                            ? `Wyszukiwanie na żądanie: "${searchValue}"`
                            : 'Wszystkie sneakersy'}
                    </h1>
                    <div className="search-block flex">
                        <img src="/img/search.svg" alt="search"/>
                        {searchValue && (
                            <img
                                className="remove_input-btn"
                                src="/img/btn-remove.svg"
                                alt="search"
                                onClick={() => setSearchValue('')}
                            />
                        )}
                        <input
                            onChange={onChangeSearchInput}
                            value={searchValue}
                            type="browse"
                            placeholder="Wyszukaj"
                        />
                    </div>
                </div>

                <div className="card-wrapper flex flex-wrap">
                    {items.filter((item) =>
                        item.name.toLowerCase().includes(searchValue)
                    ).length ? (
                        items
                            .filter((item) => item.name.toLowerCase().includes(searchValue))
                            .map((item, index) => (
                                <Card
                                    key={item.id}
                                    {...item}
                                    favoriteList={favorites}
                                    isFavorite={favorites && favorites.some(f => f.product.id === item.id)}
                                    isAdded={ cart && cart.some(
                                        (obj) => Number(obj.id) === Number(item.id)
                                    )}
                                    onRemoveFavorite={() => addToFavoriteItem(item)}
                                    onFavorite={() => addToFavoriteItem(item)}
                                    onPlus={(item) => onAddToCart(item)}
                                />
                            ))
                    ) : (
                        <div className="empty">
                            <img src="/img/out-of-stock.png" alt="empty icon"/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;