import request from "supertest";
import app from "../../src/api/app.js";
import prisma from "../../src/utils/prismaClient.js";

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Events API", () => {
  test("Crea un evento", async () => {
    const res = await request(app)
      .post("/api/events")
      .send({
        title: "Concierto",
        capacity: 100,
        startAt: "2025-01-01T10:00:00.000Z",
        endAt: "2025-01-01T12:00:00.000Z"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Concierto");
  });
});
