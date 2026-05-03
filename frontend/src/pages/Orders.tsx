import { useEffect, useState } from "react";
import type { IOrder } from "../types";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { restaurantService } from "../main";

const ACTIVE_STATUSES = [
  "placed",
  "accepted",
  "preparing",
  "ready_for_rider",
  "rider_assigned",
  "picked_up",
];

const Orders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { socket } = useSocket();

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${restaurantService}/api/order/myorder`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onOrderUpdate = () => {
      fetchOrders();
    };

    socket.on("order:update", onOrderUpdate);
    socket.on("order:rider_assigned", onOrderUpdate);

    return () => {
      socket.off("order:update", onOrderUpdate);
      socket.off("order:rider_assigned", onOrderUpdate);
    };
  }, [socket]);

  if (loading) {
    return <p className="muted-text text-center">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="muted-text">No orders yet</p>
      </div>
    );
  }

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const completedOrders = orders.filter(
    (o) => !ACTIVE_STATUSES.includes(o.status)
  );

  return (
    <div className="page-shell max-w-4xl space-y-6">
      <h1 className="section-title">My Orders</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Active Orders</h2>

        {activeOrders.length === 0 ? (
          <p className="muted-text">No active orders</p>
        ) : (
          activeOrders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              onClick={() => navigate(`/order/${order._id}`)}
            />
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Completed Orders</h2>

        {completedOrders.length === 0 ? (
          <p className="muted-text">No completed orders</p>
        ) : (
          completedOrders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              onClick={() => navigate(`/order/${order._id}`)}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default Orders;

const OrderRow = ({
  order,
  onClick,
}: {
  order: IOrder;
  onClick: () => void;
}) => {
  return (
    <div
      className="glass-card cursor-pointer p-4 transition hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Order #{order._id.slice(-6)}</p>
        <span className="chip bg-slate-100 capitalize text-slate-600">
          {order.status}
        </span>
      </div>

      <div className="mt-2 text-sm text-slate-600">
        {order.items.map((item, i) => (
          <span key={i}>
            {item.name} x {item.quauntity}
            {i < order.items.length - 1 && ", "}
          </span>
        ))}
      </div>

      <div className="mt-2 flex justify-between text-sm font-medium">
        <span>Total</span>
        <span>Rs {order.totalAmount}</span>
      </div>
    </div>
  );
};
