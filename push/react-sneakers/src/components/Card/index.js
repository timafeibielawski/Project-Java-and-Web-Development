import React from 'react';
import styles from './Card.module.scss';

function Card({image, name, price, id, onPlus, isAdded, setFavorite, favoriteList,isFavorite, onFavorite, onRemoveFavorite}) {
    const onClickPlus = () => {
        onPlus({image, name, price, id});
    };

    const onFavoriteClick = () => {
        if (isFavorite) {
            onRemoveFavorite(id)
        } else {
            onFavorite()
        }

    }

    return (
        <div className={styles.card}>
            <div className={styles.favorite} onClick={onFavoriteClick}>
                <img src={isFavorite ? "/img/heart2.svg" : "/img/heart1.svg"} alt="unliked"/>
            </div>
            <img width={133} height={112} src={process.env.REACT_APP_SERVER_URL + "/" + image} alt="Sneakers"
                 className='mb-[20px] mx-auto'/>
            <h5>{name}</h5>
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <span>Cena</span>
                    <b>{price} pln.</b>
                </div>
                {isAdded ? (
                    <img className={styles.plus} src={'/img/checked.svg'} alt="Plus"/>
                ) : (
                    <img
                        onClick={onClickPlus}
                        className={styles.plus}
                        src={'/img/plus.svg'}
                        alt="Plus"
                    />
                )}
            </div>
        </div>
    );
}

export default Card;
