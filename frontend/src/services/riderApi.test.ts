import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentRiderOrder } from "./riderApi";

vi.mock("axios");

const mockedAxios = vi.mocked(axios, true);

describe("getCurrentRiderOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns order data on success", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { order: { _id: "order-1", status: "accepted" } },
    } as any);

    const result = await getCurrentRiderOrder("http://localhost:5005", "jwt-token");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:5005/api/rider/order/current",
      {
        headers: {
          Authorization: "Bearer jwt-token",
        },
      }
    );
    expect(result).toMatchObject({ _id: "order-1" });
  });

  it("returns null when api responds with 404", async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 404,
      },
    });

    const result = await getCurrentRiderOrder("http://localhost:5005", "jwt-token");
    expect(result).toBeNull();
  });

  it("throws when api responds with non-404 error", async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 500,
      },
      message: "Internal Server Error",
    });

    await expect(
      getCurrentRiderOrder("http://localhost:5005", "jwt-token")
    ).rejects.toBeTruthy();
  });
});
