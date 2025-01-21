import { Link } from 'react-router-dom'; // For navigation between pages
import { useStore } from "../store"; // Zustand store for state management

function Header(props) {
  // Calculate tax (5% of total price)
  const tax = props.totalPrice * 0.05;
  const { user } = useStore(); // Access the current user from the store

  return (
    <header className="flex justify-between items-center p-8">
      {/* Logo and shop name section */}
      <div className="flex items-center gap-2">
        <Link to={'/'}>
          <div className="flex items-center flex-row">
            <img
              className="mr-5"
              width={42}
              height={42}
              src="/img/logo.png" // Shop logo
              alt="React Sneakers Logo"
            />
            <div>
              <h3 className="uppercase font-bold text-xl">React Sneakers</h3> {/* Shop name */}
              <p className="opacity-50 text-sm">Sklep najlepszych sneakersów</p> {/* Subtitle */}
            </div>
          </div>
        </Link>
      </div>
      {/* Navigation and actions section */}
      <ul className="flex items-center">
        {/* Cart link with total price */}
        <li
          onClick={props.onClickCart} // Trigger cart drawer opening
          className="mr-2 flex items-center cursor-pointer"
        >
          <img width={18} height={18} src="/img/cart.svg" alt="Cart" />
          <span className="ml-2">{props.totalPrice + tax} pln.</span> {/* Total price including tax */}
        </li>

        {/* Bookmarks link (redirects to Favorites or SignIn depending on user state) */}
        <Link to={user ? '/favorites' : '/SignIn'}>
          <li className="mr-2 flex items-center group cu-p">
            <img width={18} height={18} src="/img/favorites.svg" alt="Bookmarks" />
            <span className="ml-2 text-zinc-400 group-hover:text-zinc-700">
              Bookmarks
            </span>
          </li>
        </Link>

        {/* User account link (redirects to SignIn) */}
        <Link to={'/SignIn'}>
          <li>
            <img
              className="mr-5"
              width={18}
              height={18}
              src="/img/user.svg"
              alt="User"
            />
          </li>
        </Link>
      </ul>
    </header>
  );
}

export default Header;

