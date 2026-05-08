import  { useEffect, useState } from 'react'
import { useAppData } from '../context/AppContext'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { CgShoppingCart } from 'react-icons/cg'
import { BiMapPin, BiSearch } from "react-icons/bi";

const Navbar = () => {
  const { isAuth, city, quauntity } = useAppData();
  const currLocation = useLocation();

  const isHomePage = currLocation.pathname === "/";

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        setSearchParams({ search });
      } else {
        setSearchParams({});
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);
  return (
    <div className="sticky top-0 z-50 w-full border-b border-[#D9480F] bg-[#FF5A1F] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          to={"/"}
          className="cursor-pointer text-2xl font-extrabold tracking-tight text-white"
        >
          Tazo
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to={"/cart"}
            className="relative rounded-xl border border-white/40 bg-white/10 p-2.5 text-white transition hover:bg-white/20"
          >
            <CgShoppingCart className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#FF5A1F]">
              {quauntity}
            </span>
          </Link>

          {isAuth ? (
            <Link
              to="/account"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white px-3 py-2 text-sm font-semibold text-[#FF5A1F] transition hover:bg-white/90"
            >
              Account
            </Link>
          ) : (
            <Link
              to="/Login"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white px-3 py-2 text-sm font-semibold text-[#FF5A1F] transition hover:bg-white/90"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* search bar */}
      {isHomePage && (
        <div className="border-t border-white/20 px-4 py-3">
          <div className="mx-auto flex max-w-7xl items-center rounded-2xl border border-white/90 bg-white p-1 shadow-md backdrop-blur-sm">
            <div className="flex items-center gap-2 rounded-xl border-r border-slate-200 px-3 py-2 text-slate-700">
              <BiMapPin className="h-4 w-4 text-[#FF5A1F]" />
              <span className="max-w-35 truncate text-sm font-medium">{city}</span>
            </div>
            <div className="flex flex-1 items-center gap-2 px-3 py-1">
              <BiSearch className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search for restaurant"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;





