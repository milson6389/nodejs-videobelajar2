import supertest from "supertest";
import { web } from "../src/app/web.js";
import { createTestUser, createTestTutor, removeAllTutor, removeAllUser } from "./testUtil.js";

describe("POST /api/v1/tutor", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeAllTutor();
    await removeAllUser();
  });
  it("should reject if user not logged in", async () => {
    const result = await supertest(web).post(`/api/v1/tutor`).send({
      tutorTitle: "Jr. Mobile Developer",
    });
    expect(result.status).toBe(401);
  });
  it("should reject if request invalid", async () => {
    const login = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const result = await supertest(web)
      .post(`/api/v1/tutor`)
      .send({
        tutorTitle: "",
      })
      .set("Cookie", login.header["set-cookie"][0]);
    expect(result.status).toBe(400);
  });
  it("should be able to register as tutor", async () => {
    const login = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const result = await supertest(web)
      .post(`/api/v1/tutor`)
      .send({
        tutorTitle: "Jr. Mobile Developer",
      })
      .set("Cookie", login.header["set-cookie"][0]);
    expect(result.status).toBe(201);
    expect(result.body.tutorId).toBeDefined();
    expect(result.body.userId).toBe(login.body.userId);
    expect(result.body.tutorTitle).toBe("Jr. Mobile Developer");
  });
});

describe("GET /api/v1/tutor", () => {
  beforeEach(async () => {
    await createTestTutor();
  });
  afterEach(async () => {
    await removeAllTutor();
    await removeAllUser();
  });

  it("should be able to get tutor list", async () => {
    const result = await supertest(web).get(`/api/v1/tutor?q=Mobile`);
    expect(result.status).toBe(200);
  });
});

describe("GET /api/v1/tutor/:id", () => {
  afterEach(async () => {
    await removeAllTutor();
    await removeAllUser();
  });
  it("should reject if tutor not found", async () => {
    const tutor = await createTestTutor();
    const result = await supertest(web).get(`/api/v1/tutor/${Number(tutor.tutorId) + 1}`);
    expect(result.status).toBe(404);
  });
  it("should be able to get tutor by id", async () => {
    const tutor = await createTestTutor();
    const result = await supertest(web).get(`/api/v1/tutor/${Number(tutor.tutorId)}`);
    expect(result.status).toBe(200);
    expect(Number(result.body.tutorId)).toBe(Number(tutor.tutorId));
    expect(result.body.tutorTitle).toBe("Jr. Mobile Dev");
  });
});

describe("PUT /api/v1/tutor", () => {
  afterEach(async () => {
    await removeAllTutor();
    await removeAllUser();
  });
  it("should reject if tutor not found", async () => {
    const tutor = await createTestTutor();
    const result = await supertest(web).get(`/api/v1/tutor/${Number(tutor.tutorId) + 1}`);
    expect(result.status).toBe(404);
  });
  it("should be reject if request invalid", async () => {
    const tutor = await createTestTutor();
    const login = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const result = await supertest(web)
      .put(`/api/v1/tutor`)
      .send({
        tutorTitle: "a",
      })
      .set("Cookie", login.header["set-cookie"][0]);

    expect(result.status).toBe(400);
  });
  it("should be able to update if request valid", async () => {
    const tutor = await createTestTutor();
    const login = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const result = await supertest(web)
      .put(`/api/v1/tutor`)
      .send({
        tutorTitle: "updated title",
      })
      .set("Cookie", login.header["set-cookie"][0]);

    expect(result.status).toBe(200);
    expect(result.body.tutorTitle).not.toBe(tutor.tutorTitle);
    expect(result.body.tutorTitle).toBe("updated title");
  });
});
