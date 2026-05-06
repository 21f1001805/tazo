import axios from "axios";
import type { IOrder } from "../types";

interface RiderOrderResponse {
  order: IOrder | null;
}

interface RiderOrdersResponse {
  orders: IOrder[];
}

export type RiderOrderStatus =
  | "current"
  | "past"
  | "placed"
  | "accepted"
  | "preparing"
  | "ready_for_rider"
  | "rider_assigned"
  | "picked_up"
  | "delivered"
  | "cancelled";

export const getRiderOrders = async (
  riderServiceBaseUrl: string,
  token: string | null,
  status: RiderOrderStatus = "current"
): Promise<IOrder | IOrder[] | null> => {
  try {
    if (status === "current") {
      const { data } = await axios.get<RiderOrderResponse>(
        `${riderServiceBaseUrl}/api/rider/order/current?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        }
      );

      return data.order ?? null;
    }

    const { data } = await axios.get<RiderOrdersResponse>(
      `${riderServiceBaseUrl}/api/rider/order/current?status=${status}`,
      {
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
        },
      }
    );

    return Array.isArray(data.orders) ? data.orders : [];
  } catch (error: any) {
    if (error?.response?.status === 404 && status === "current") {
      return null;
    }
    throw error;
  }
};

export const getCurrentRiderOrder = async (
  riderServiceBaseUrl: string,
  token: string | null,
  status: RiderOrderStatus = "current"
): Promise<IOrder | null> => {
  const data = await getRiderOrders(riderServiceBaseUrl, token, status);
  return data && !Array.isArray(data) ? data : null;
};
