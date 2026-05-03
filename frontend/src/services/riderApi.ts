import axios from "axios";
import type { IOrder } from "../types";

interface RiderOrderResponse {
  order: IOrder | null;
}

export const getCurrentRiderOrder = async (
  riderServiceBaseUrl: string,
  token: string | null
): Promise<IOrder | null> => {
  try {
    const { data } = await axios.get<RiderOrderResponse>(
      `${riderServiceBaseUrl}/api/rider/order/current`,
      {
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
        },
      }
    );

    return data.order ?? null;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
