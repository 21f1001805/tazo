import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import toast from "react-hot-toast";
import { BiLogOut, BiMapPin, BiPackage } from "react-icons/bi";

const Account = () => {
  const { user, setUser, setIsAuth } = useAppData();

  const firstLetter = user?.name.charAt(0).toUpperCase();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.setItem("token", "");
    setUser(null);
    setIsAuth(false);
    navigate("/login");
    toast.success("logout Success");
  };
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="glass-card mx-auto max-w-md overflow-hidden">
        <div className="flex items-center gap-4 border-b border-slate-100 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FF5A1F] to-[#D9480F] text-xl font-semibold text-white">
            {firstLetter}
          </div>
          <div>
            <h2 className="text-lg font-bold">{user?.name}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
        <div className="divide-y">
          <div
            className="flex cursor-pointer items-center gap-4 p-5 transition hover:bg-white/80"
            onClick={() => navigate("/orders")}
          >
            <BiPackage className="h-5 w-5 text-orange-600" />
            <span className="font-medium">Your Orders</span>
          </div>
          <div
            className="flex cursor-pointer items-center gap-4 p-5 transition hover:bg-white/80"
            onClick={() => navigate("/address")}
          >
            <BiMapPin className="h-5 w-5 text-orange-600" />
            <span className="font-medium">Addresses</span>
          </div>
          <div
            className="flex cursor-pointer items-center gap-4 p-5 transition hover:bg-white/80"
            onClick={logoutHandler}
          >
            <BiLogOut className="h-5 w-5 text-orange-600" />
            <span className="font-medium">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;





