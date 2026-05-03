import axios from "axios";
import { useEffect, useState } from "react";
import { adminService } from "../main";
import AdminRestaurantCard from "../components/AdminRestaurantCard";
import RiderAdmin from "../components/RiderAdmin";
import { useAppData } from "../context/AppContext";
import toast from "react-hot-toast";

const Admin = () => {
  const { setUser, setIsAuth } = useAppData();
  const [restaurant, setRestaurant] = useState<any[]>([]);
  const [riders, setRiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"restaurant" | "rider">("restaurant");

  const logoutHandler = () => {
    localStorage.setItem("token", "");
    setIsAuth(false);
    setUser(null);
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${adminService}/api/v1/admin/restaurant/pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const response = await axios.get(
        `${adminService}/api/v1/admin/rider/pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRestaurant(data.restaurants);
      setRiders(response.data.riders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="muted-text">Loading admin panel...</p>
      </div>
    );
  }
  return (
    <div className="page-shell max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="section-title">Admin Dashboard</h1>
        <button onClick={logoutHandler} className="btn-soft !py-2">
          Logout
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setTab("restaurant")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            tab === "restaurant"
              ? "bg-[#E23744] text-white"
              : "bg-white text-slate-600"
          }`}
        >
          Restaurant
        </button>

        <button
          onClick={() => setTab("rider")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            tab === "rider" ? "bg-[#E23744] text-white" : "bg-white text-slate-600"
          }`}
        >
          Riders
        </button>
      </div>

      {tab === "restaurant" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {restaurant.length === 0 ? (
            <p>No pending restaurants</p>
          ) : (
            restaurant.map((r) => (
              <AdminRestaurantCard
                key={r._id}
                restaurant={r}
                onVerify={fetchData}
              />
            ))
          )}
        </div>
      )}
      {tab === "rider" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {riders.length === 0 ? (
            <p>No pending riders</p>
          ) : (
            riders.map((r) => (
               <RiderAdmin key={r._id} rider={r} onVerify={fetchData} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
