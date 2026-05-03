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
    <div className="sticky top-0 z-50 w-full border-b border-white/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          to={"/"}
          className="cursor-pointer text-2xl font-extrabold tracking-tight text-[#E23744]"
        >
          Tazo
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to={"/cart"}
            className="relative rounded-xl border border-red-100 bg-red-50 p-2.5 text-[#E23744] transition hover:bg-red-100"
          >
            <CgShoppingCart className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#E23744] text-xs font-semibold text-white">
              {quauntity}
            </span>
          </Link>

          {isAuth ? (
            <Link to="/account" className="btn-primary !px-3 !py-2">
              Account
            </Link>
          ) : (
            <Link to="/Login" className="btn-primary !px-3 !py-2">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* search bar */}
      {isHomePage && (
        <div className="border-t border-white/70 px-4 py-3">
          <div className="mx-auto flex max-w-7xl items-center rounded-2xl border border-white/80 bg-white/75 p-1 shadow-md backdrop-blur-sm">
            <div className="flex items-center gap-2 rounded-xl border-r border-slate-200 px-3 py-2 text-slate-700">
              <BiMapPin className="h-4 w-4 text-[#E23744]" />
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
