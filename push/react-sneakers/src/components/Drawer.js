import { useEffect } from "react";

const Drawer = ({ onClose, onRemove, items = [], totalPrice }) => {

  const tax = totalPrice * 0.05;

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  },[])

  return (
    <div className="overlay overflow-hidden">
      <div className="drawer">
        <h2 className="flex justify-between mb-5">
        Shopping cart
          <img
            onClick={onClose}
            className="removeBtn cursor-pointer "
            src="/img/btn-remove.svg"
            alt="Close"
          />
        </h2>

        <div className="items mt-5">
          {items.map((obj) => (
            <div key={obj.id} className="cartItem flex items-center mb-5 gap-3">
              <div
                style={{ backgroundImage: `url(${process.env.REACT_APP_SERVER_URL}/${obj.image})` }}
                className="cartItemImg !w-[50%] h-[70px]"
              ></div>

              <div className="flex flex-col">
                <p className="mb-5">{obj.name}</p>
                <b>{obj.price}</b>
              </div>
              <img
                className="removeBtn cursor-pointer"
                src="/img/btn-remove.svg"
                onClick={() => onRemove(obj)}
                alt="remove"
              />
            </div>
          ))}
        </div>

        <div className="cartTotalBlock">
          <ul>
            <li>
              <span>To be paid:</span>
              <div></div>
              <b>{totalPrice + tax} pln.</b>
            </li>
            <li>
              <span>Tax 5%:</span>
              <div></div>
              <b>{tax} pln.</b>
            </li>
          </ul>

          <button className="greenButton">
            Złożyć zamówienie <img src="/img/arrow.svg" alt="arrow" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
