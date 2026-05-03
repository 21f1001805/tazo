import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import { useState } from "react";
import type { ICart, IMenuItem, IRestaurant } from "../types";
import axios from "axios";
import { restaurantService } from "../main";
import toast from "react-hot-toast";
import { VscLoading } from "react-icons/vsc";
import { BiMinus, BiPlus } from "react-icons/bi";
import { TbTrash } from "react-icons/tb";

const Cart = () => {
  const { cart, subTotal, quauntity, fetchCart } = useAppData();
  const navigate = useNavigate();

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [clearingCart, setClearingCart] = useState(false);

  if (!cart || cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="muted-text text-lg">Your cart is empty</p>
      </div>
    );
  }

  const restaurant = cart[0].restaurantId as IRestaurant;

  const deliveryFee = subTotal < 250 ? 49 : 0;
  const platfromFee = 7;
  const grandTotal = subTotal + deliveryFee + platfromFee;

  const increaseQty = async (itemId: string) => {
    try {
      setLoadingItemId(itemId);
      await axios.put(
        `${restaurantService}/api/cart/inc`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchCart();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoadingItemId(null);
    }
  };

  const decreaseQty = async (itemId: string) => {
    try {
      setLoadingItemId(itemId);
      await axios.put(
        `${restaurantService}/api/cart/dec`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchCart();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoadingItemId(null);
    }
  };

  const clearCart = async () => {
    const confirm = window.confirm("Are you sure you want to clear your cart?");
    if (!confirm) return;
    try {
      setClearingCart(true);
      await axios.delete(`${restaurantService}/api/cart/clear`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await fetchCart();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setClearingCart(false);
    }
  };

  const checkout = () => {
    navigate("/checkout");
  };

  return (
    <div className="page-shell max-w-5xl space-y-6">
      <div className="glass-card p-4">
        <h2 className="text-xl font-bold">{restaurant.name}</h2>
        <p className="text-sm text-slate-500">
          {restaurant.autoLocation.formattedAddress}
        </p>
      </div>

      <div className="space-y-4">
        {cart.map((cartItem: ICart) => {
          const item = cartItem.itemId as IMenuItem;
          const isLoading = loadingItemId === item._id;

          return (
            <div key={item._id} className="glass-card flex items-center gap-4 p-4">
              <img
                src={item.image}
                alt=""
                className="h-20 w-20 rounded-xl object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-slate-500">Rs {item.price}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="rounded-full border border-slate-200 p-2 transition hover:bg-slate-100 disabled:opacity-50"
                  disabled={isLoading}
                  onClick={() => decreaseQty(item._id)}
                >
                  {isLoading ? (
                    <VscLoading size={16} className="animate-spin" />
                  ) : (
                    <BiMinus size={16} />
                  )}
                </button>
                <span className="font-medium">{cartItem.quauntity}</span>
                <button
                  className="rounded-full border border-slate-200 p-2 transition hover:bg-slate-100 disabled:opacity-50"
                  disabled={isLoading}
                  onClick={() => increaseQty(item._id)}
                >
                  {isLoading ? (
                    <VscLoading size={16} className="animate-spin" />
                  ) : (
                    <BiPlus size={16} />
                  )}
                </button>
              </div>

              <p className="w-24 text-right font-semibold text-slate-700">
                Rs {item.price * cartItem.quauntity}
              </p>
            </div>
          );
        })}
      </div>

      <div className="glass-card space-y-3 p-4">
        <div className="flex justify-between text-sm">
          <span>Total Items</span>
          <span>{quauntity}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>Rs {subTotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Delivery Fee</span>
          <span>{deliveryFee === 0 ? "Free" : `Rs ${deliveryFee}`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Platform Fee</span>
          <span>Rs {platfromFee}</span>
        </div>

        {subTotal < 250 && (
          <p className="text-xs text-slate-500">
            Add items worth Rs {250 - subTotal} more to get free delivery
          </p>
        )}

        <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-semibold">
          <span>Grand Total</span>
          <span>Rs {grandTotal}</span>
        </div>

        <button
          onClick={checkout}
          className={`btn-primary mt-3 w-full !py-3 ${
            !restaurant.isOpen ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!restaurant.isOpen}
        >
          {!restaurant.isOpen ? "Restaurant is Closed" : "Proceed to Checkout"}
        </button>

        <button
          onClick={clearCart}
          className="btn-soft mt-3 flex w-full items-center justify-center gap-3 !py-3"
          disabled={clearingCart}
        >
          Clear Cart <TbTrash size={16} />
        </button>
      </div>
    </div>
  );
};

export default Cart;
