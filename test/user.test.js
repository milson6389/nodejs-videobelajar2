import supertest from "supertest";
import { web } from "../src/app/web.js";
import { createTestUser, removeAllUser } from "./testUtil.js";

describe("POST /api/v1/user", () => {
  afterEach(async () => {
    await removeAllUser();
  });
  it("should reject if request invalid", async () => {
    const result = await supertest(web).post(`/api/v1/user`).send({
      fullName: "",
    });
    expect(result.status).toBe(400);
  });
  it("should reject if user already exists", async () => {
    await createTestUser();
    const result = await supertest(web).post(`/api/v1/user`).send({
      fullName: "user one",
      email: "user1@localhost.local",
      noHp: "+658987654321",
      password: "password",
    });
    expect(result.status).toBe(400);
  });
  it("should be able to register new user", async () => {
    await createTestUser();
    const result = await supertest(web).post(`/api/v1/user`).send({
      fullName: "user two",
      email: "user38@localhost.local",
      noHp: "+65888888888",
      password: "password",
    });
    expect(result.status).toBe(201);
    expect(result.body.userId).toBeDefined();
    expect(result.body.fullName).toBe("user two");
    expect(result.body.email).toBe("user38@localhost.local");
    expect(result.body.noHp).toBe("+65888888888");
    expect(result.body.password).not.toBeDefined();
    expect(result.header["set-cookie"][0]).toContain("jwt");
  });
});

describe("POST /api/v1/user/auth", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeAllUser();
  });
  it("should reject if request invalid", async () => {
    const result = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "",
    });
    expect(result.status).toBe(400);
  });
  it("should reject if credential invalid", async () => {
    const result = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "wrong",
    });
    expect(result.status).toBe(401);
  });
  it("should be able to login", async () => {
    const result = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    expect(result.status).toBe(200);
    expect(result.body.userId).toBeDefined();
    expect(result.body.fullName).toBe("user one");
    expect(result.body.email).toBe("user1@localhost.local");
    expect(result.body.noHp).toBe("+658987654321");
    expect(result.body.password).not.toBeDefined();
    expect(result.header["set-cookie"][0]).toContain("jwt");
  });
});

describe("GET /api/v1/user", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeAllUser();
  });
  it("should be able to reject if user not logged in", async () => {
    const result = await supertest(web).get(`/api/v1/user`);
    expect(result.status).toBe(401);
  });
  it("should be able to get user info if logged in", async () => {
    const result = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const getUser = await supertest(web).get(`/api/v1/user`).set("Cookie", result.header["set-cookie"][0]);
    expect(getUser.status).toBe(200);
    expect(getUser.body.userId).toBeDefined();
    expect(getUser.body.fullName).toBe("user one");
    expect(getUser.body.email).toBe("user1@localhost.local");
    expect(getUser.body.noHp).toBe("+658987654321");
    expect(getUser.body.password).not.toBeDefined();
  });
});

describe("PUT /api/v1/user", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeAllUser();
  });
  it("should reject if request invalid", async () => {
    const result = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const update = await supertest(web)
      .put(`/api/v1/user`)
      .send({
        fullName: "",
        noHp: "",
        password: "password",
      })
      .set("Cookie", result.header["set-cookie"][0]);

    expect(update.status).toBe(400);
  });
  it("should be able to update if request valid", async () => {
    const result = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const update = await supertest(web)
      .put(`/api/v1/user`)
      .send({
        fullName: "updated",
        noHp: "+123456789",
      })
      .set("Cookie", result.header["set-cookie"][0]);

    expect(update.status).toBe(200);
    expect(result.body.userId).toBe(update.body.userId);
    expect(update.body.fullName).toBe("updated");
    expect(update.body.noHp).toBe("+123456789");
    expect(update.body.password).not.toBeDefined();
  });
});

describe("POST /api/v1/user/logout", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeAllUser();
  });
  it("should reject if request invalid", async () => {
    const result = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const update = await supertest(web).post(`/api/v1/user/logout`);
    expect(update.status).toBe(401);
  });
  it("should be able to logout if request valid", async () => {
    const result = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const update = await supertest(web).post(`/api/v1/user/logout`).set("Cookie", result.header["set-cookie"][0]);

    expect(update.status).toBe(200);
  });
});
