import { useNavigate } from "react-router-dom";

type props = {
  id: string;
  image: string;
  name: string;
  distance: string;
  isOpen: boolean;
};

const RestaurantCard = ({ id, image, name, distance, isOpen }: props) => {
  const navigate = useNavigate();
  return (
    <div
      className={`glass-card cursor-pointer overflow-hidden transition hover:-translate-y-1 ${
        !isOpen ? "opacity-80" : ""
      }`}
      onClick={() => navigate(`/restaurant/${id}`)}
    >
      <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
        <img
          src={image}
          alt=""
          className={`h-full w-full object-cover transition duration-300 hover:scale-110 ${
            !isOpen ? "grayscale" : ""
          }`}
        />

        {!isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-md bg-black/80 px-3 py-1 font-semibold text-sm text-white">
              Closed
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1 p-4">
        <h3 className="truncate text-base font-bold text-slate-800">
          {name}
        </h3>
        <p className="text-sm text-slate-500">{distance} km away</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
