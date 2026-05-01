import { useEffect, useState } from "react";
import axios from "axios";
import { restaurantService } from "../main";

interface ItemSales {
  itemId: string;
  name: string;
  quantitySold: number;
  grossSales: number;
  allocatedDeductions: number;
  netSales: number;
}

interface SalesSummary {
  success: boolean;
  totalOrders: number;
  totalGrossSales: number;
  totalDeliveryFees: number;
  totalPlatformFees: number;
  totalNetSales: number;
  itemSales: ItemSales[];
}

interface Props {
  restaurantId: string;
}

const formatCurrency = (amount: number) => `Rs ${amount.toFixed(2)}`;

const RestaurantSales = ({ restaurantId }: Props) => {
  const [sales, setSales] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await axios.get(
          `${restaurantService}/api/order/sales/${restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSales(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchSales();
    }
  }, [restaurantId]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading sales data...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!sales) {
    return <p className="text-sm text-gray-500">No sales data available.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border p-3">
          <p className="text-xs text-gray-500">Total Orders</p>
          <p className="text-lg font-semibold">{sales.totalOrders}</p>
        </div>

        <div className="rounded-lg border p-3">
          <p className="text-xs text-gray-500">Gross Sales</p>
          <p className="text-lg font-semibold">
            {formatCurrency(sales.totalGrossSales)}
          </p>
        </div>

        <div className="rounded-lg border p-3">
          <p className="text-xs text-gray-500">Delivery Fees</p>
          <p className="text-lg font-semibold text-amber-600">
            - {formatCurrency(sales.totalDeliveryFees)}
          </p>
        </div>

        <div className="rounded-lg border p-3">
          <p className="text-xs text-gray-500">Platform Fees</p>
          <p className="text-lg font-semibold text-amber-600">
            - {formatCurrency(sales.totalPlatformFees)}
          </p>
        </div>

        <div className="rounded-lg border p-3 bg-green-50 border-green-200">
          <p className="text-xs text-gray-600">Net Sales</p>
          <p className="text-lg font-semibold text-green-700">
            {formatCurrency(sales.totalNetSales)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Menu Item</th>
              <th className="px-4 py-3 text-left font-medium">Qty Sold</th>
              <th className="px-4 py-3 text-left font-medium">Gross Sales</th>
              <th className="px-4 py-3 text-left font-medium">Deductions</th>
              <th className="px-4 py-3 text-left font-medium">Net Sales</th>
            </tr>
          </thead>
          <tbody>
            {sales.itemSales.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={5}>
                  No paid orders yet.
                </td>
              </tr>
            ) : (
              sales.itemSales.map((item) => (
                <tr className="border-t" key={item.itemId || item.name}>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.quantitySold}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(item.grossSales)}
                  </td>
                  <td className="px-4 py-3 text-amber-600">
                    - {formatCurrency(item.allocatedDeductions)}
                  </td>
                  <td className="px-4 py-3 font-medium text-green-700">
                    {formatCurrency(item.netSales)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestaurantSales;
