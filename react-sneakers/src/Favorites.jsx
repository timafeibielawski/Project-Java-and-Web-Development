import React, {useEffect} from 'react';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer.js';
import {Link} from 'react-router-dom';
import {useStore} from "./store";
import Card from "./components/Card";

const FavoritesPage = () => {
    const [cartItems, setCartItems] = React.useState([]);
    const [cartOpened, setCartOpened] = React.useState(false);
    const [totalPrice, setTotalPrice] = React.useState([]);
    const {favorites, cart, addToCart, removeFromCart, removeFromFavorites, addToFavorites} = useStore()


    useEffect(() => {
        setTotalPrice(cartItems.reduce((sum, obj) => obj.price + sum, 0));
    }, [cartItems]);

    React.useEffect(() => {
        axios
            .get('https://651831b1582f58d62d357d58.mockapi.io/cart')
            .then((res) => {
                setCartItems(res.data);
            });
    }, []);

    const onAddToCart = async (obj) => {
        await axios
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
        await axios
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
                    items={cartItems}
                    onClose={() => setCartOpened(false)}
                    onRemove={onRemoveItem}
                    totalPrice={totalPrice}
                />
            )}
            <Header totalPrice={totalPrice} onClickCart={() => setCartOpened(true)}/>
            <div className="content p-10">
                <div className="flex items-center gap-3">
                    <Link to={'/'}>
                        <div
                            className="p-2 border-zinc-300 border-[2px] w-7 h-7 flex items-center justify-center rounded-lg">
                            <img src="/img/arrow-back.svg" alt="back"/>
                        </div>
                    </Link>
                    <h1 className="cut-text text-3xl font-bold">My bookmarks</h1>
                </div>
            </div>
            <div className={"overflow-scroll"}>
                {favorites && favorites.length > 0 ? (
                    <div className={"px-10 flex flex-wrap gap-5"}>
                        {favorites.map((obj) => (
                            <Card
                                key={obj.product.id}
                                {...obj.product}
                                favoriteList={favorites}
                                isFavorite={favorites && favorites.some(f => f.product.id === obj.product.id)}
                                isAdded={ cart && cart.some(
                                    (i) => Number(i.id) === Number(obj.id)
                                )}
                                onRemoveFavorite={() => addToFavoriteItem(obj.product)}
                                onFavorite={() => addToFavoriteItem(obj.product)}
                                onPlus={() => onAddToCart(obj.product)}
                            />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className='empty'>
                            <img src="/img/out-of-stock.png" alt="empty icon"/>
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