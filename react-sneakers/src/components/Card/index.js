import React from 'react';
import styles from './Card.module.scss'; // Importing module CSS for scoped styles

function Card({
  image, // Image URL of the product
  name, // Name of the product
  price, // Price of the product
  id, // ID of the product
  onPlus, // Callback for adding the product to the cart
  isAdded, // Boolean indicating if the product is already added to the cart
  setFavorite, // Callback for setting a product as favorite
  favoriteList, // List of favorite products
  isFavorite, // Boolean indicating if the product is in the favorites list
  onFavorite, // Callback for adding the product to the favorites
  onRemoveFavorite, // Callback for removing the product from the favorites
}) {
  // Handle adding the product to the cart
  const onClickPlus = () => {
    onPlus({ image, name, price, id }); // Pass product details to the callback
  };

  // Handle adding/removing the product from favorites
  const onFavoriteClick = () => {
    if (isFavorite) {
      onRemoveFavorite(id); // Remove from favorites if already added
    } else {
      onFavorite(); // Add to favorites if not already added
    }
  };

  return (
    <div className={styles.card}>
      {/* Favorite icon */}
      <div className={styles.favorite} onClick={onFavoriteClick}>
        <img
          src={isFavorite ? "/img/heart2.svg" : "/img/heart1.svg"} // Toggle heart icon based on favorite status
          alt="Favorite"
        />
      </div>

      {/* Product image */}
      <img
        width={133}
        height={112}
        src={process.env.REACT_APP_SERVER_URL + "/" + image} // Dynamically load image
        alt="Sneakers"
        className="mb-[20px] mx-auto"
      />

      {/* Product name */}
      <h5>{name}</h5>

      {/* Price and add to cart button */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span>Cena</span>
          <b>{price} pln.</b> {/* Display product price */}
        </div>

        {/* Add to cart button */}
        {isAdded ? (
          <img
            className={styles.plus}
            src={'/img/checked.svg'} // Checked icon if product is already in the cart
            alt="Checked"
          />
        ) : (
          <img
            onClick={onClickPlus} // Add to cart callback
            className={styles.plus}
            src={'/img/plus.svg'} // Plus icon for adding to cart
            alt="Add"
          />
        )}
      </div>
    </div>
  );
}

export default Card;

