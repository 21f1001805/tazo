import axios from "axios";
import { adminService } from "../main";
import toast from "react-hot-toast";

const AdminRestaurantCard = ({
  restaurant,
  onVerify,
}: {
  restaurant: any;
  onVerify: () => void;
}) => {
  const verify = async () => {
    try {
      await axios.patch(
        `${adminService}/api/v1/verify/restaurant/${restaurant._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Restaurant verified");
      onVerify();
    } catch (error) {
      toast.error("Failed to verify restaurant");
    }
  };

  return (
    <div className="glass-card space-y-3 p-4">
      <img
        src={restaurant.image}
        className="h-40 w-full rounded-xl object-cover"
        alt=""
      />
      <h3 className="text-lg font-semibold">{restaurant.name}</h3>
      <p className="text-sm text-slate-500">Phone: {restaurant.phone}</p>
      <p className="text-sm text-slate-600">
        {restaurant.autoLocation?.formattedAddress}
      </p>

      <button className="btn-primary w-full" onClick={verify}>
        Verify Restaurant
      </button>
    </div>
  );
};

export default AdminRestaurantCard;
