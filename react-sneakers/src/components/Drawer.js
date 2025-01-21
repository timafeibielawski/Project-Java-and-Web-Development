import { useEffect } from "react";

const Drawer = ({ onClose, onRemove, items = [], totalPrice }) => {
  // Calculate tax based on the total price (5% of total price)
  const tax = totalPrice * 0.05;

  useEffect(() => {
    // Prevent scrolling on the body when the drawer is open
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable scrolling when the drawer is closed
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="overlay overflow-hidden">
      <div className="drawer">
        {/* Drawer header with title and close button */}
        <h2 className="flex justify-between mb-5">
          Shopping cart
          <img
            onClick={onClose} // Close the drawer
            className="removeBtn cursor-pointer"
            src="/img/btn-remove.svg"
            alt="Close"
          />
        </h2>

        {/* Cart items list */}
        <div className="items mt-5">
          {items.map((obj) => (
            <div key={obj.id} className="cartItem flex items-center mb-5 gap-3">
              {/* Product image */}
              <div
                style={{ backgroundImage: `url(${process.env.REACT_APP_SERVER_URL}/${obj.image})` }}
                className="cartItemImg !w-[50%] h-[70px]"
              ></div>

              {/* Product details */}
              <div className="flex flex-col">
                <p className="mb-5">{obj.name}</p> {/* Product name */}
                <b>{obj.price}</b> {/* Product price */}
              </div>

              {/* Remove button */}
              <img
                className="removeBtn cursor-pointer"
                src="/img/btn-remove.svg"
                onClick={() => onRemove(obj)} // Remove item from cart
                alt="remove"
              />
            </div>
          ))}
        </div>

        {/* Total and tax section */}
        <div className="cartTotalBlock">
          <ul>
            {/* Total price including tax */}
            <li>
              <span>To be paid:</span>
              <div></div>
              <b>{totalPrice + tax} pln.</b>
            </li>
            {/* Tax amount */}
            <li>
              <span>Tax 5%:</span>
              <div></div>
              <b>{tax} pln.</b>
            </li>
          </ul>

          {/* Order button */}
          <button className="greenButton">
            Złożyć zamówienie <img src="/img/arrow.svg" alt="arrow" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
