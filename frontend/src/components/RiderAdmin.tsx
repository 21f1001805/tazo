import toast from "react-hot-toast";
import { adminService } from "../main";
import axios from "axios";

const RiderAdmin = ({
  rider,
  onVerify,
}: {
  rider: any;
  onVerify: () => void;
}) => {
  const verify = async () => {
    try {
      await axios.patch(
        `${adminService}/api/v1/verify/rider/${rider._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Rider verified");
      onVerify();
    } catch (error) {
      toast.error("Failed to verify rider");
    }
  };

  return (
    <div className="glass-card space-y-3 p-4">
      <img
        src={rider.picture}
        className="h-40 w-full rounded-xl object-cover"
        alt=""
      />
      <h3 className="text-lg font-semibold">{rider.phoneNumber}</h3>
      <p className="text-sm text-slate-500">Aadhaar: {rider.aadharNumber}</p>
      <p className="text-sm text-slate-600">
        DL Number: {rider.drivingLicenseNumber}
      </p>

      <button className="btn-primary w-full" onClick={verify}>
        Verify Rider
      </button>
    </div>
  );
};

export default RiderAdmin;
