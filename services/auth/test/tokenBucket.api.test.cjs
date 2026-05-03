const express = require("express");
const request = require("supertest");

describe("loginRateLimiter", () => {
  it("allows requests until capacity and then returns 429", async () => {
    const { loginRateLimiter } = await import(
      "../dist/middleware/tokenBucket.js"
    );

    const app = express();
    app.use(express.json());
    app.post("/api/auth/login", loginRateLimiter, (_req, res) => {
      res.status(200).json({ ok: true });
    });

    for (let i = 0; i < 10; i += 1) {
      const res = await request(app).post("/api/auth/login").send({ code: "demo" });
      expect(res.status).toBe(200);
    }

    const blocked = await request(app).post("/api/auth/login").send({ code: "demo" });

    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual({
      message: "Too many login attempts. Please try again later.",
    });
    expect(blocked.headers["retry-after"]).toBeDefined();
  });
});
