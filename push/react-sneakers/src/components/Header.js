import { Link } from 'react-router-dom';
import {useStore} from "../store";

function Header(props) {
  const tax = props.totalPrice * 0.05;
  const {user} = useStore();

  return (
    <header className="flex justify-between items-center p-8">
      <div className="flex items-center gap-2">
        <Link to={'/'}>
          <div className={'flex items-center flex-row'}>
            <img
              className="mr-5"
              width={42}
              height={42}
              src="/img/logo.png"
              alt=""
            />
            <div className="">
              <h3 className="uppercase font-bold text-xl">React Sneakers</h3>
              <p className="opacity-50 text-sm">Sklep najlepszych sneakersów</p>
            </div>
          </div>
        </Link>
      </div>
      <ul className="flex items-center">
        <li
          onClick={props.onClickCart}
          className="mr-2 flex items-center cursor-pointer"
        >
          <img width={18} height={18} src="/img/cart.svg" alt="" />
          <span className="ml-2">{props.totalPrice + tax} pln.</span>
        </li>
        <Link to={user ? '/favorites' : '/SignIn'}>
          <li className="mr-2 flex items-center group cu-p">
            <img width={18} height={18} src="/img/favorites.svg" alt="" />
            <span className="ml-2 text-zinc-400 group-hover:text-zinc-700">
              Bookmarks
            </span>
          </li>
        </Link>
        <Link to={'/SignIn'}>
          <li>
            <img
              className="mr-5"
              width={18}
              height={18}
              src="/img/user.svg"
              alt=""
            />
          </li>
        </Link>
      </ul>
    </header>
  );
}

export default Header;
