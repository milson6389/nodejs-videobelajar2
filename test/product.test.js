import supertest from "supertest";
import { web } from "../src/app/web.js";
import {
  createTestProduct,
  createTestTutor,
  createOtherTestTutor,
  createTestCategory,
  removeAllTutor,
  removeAllUser,
  removeAllCategory,
  removeAllProduct,
} from "./testUtil.js";

describe("POST /api/v1/product", () => {
  beforeEach(async () => {
    await createTestTutor();
    await createTestCategory();
  });
  afterEach(async () => {
    await removeAllProduct();
    await removeAllCategory();
    await removeAllTutor();
    await removeAllUser();
  });

  it("should reject if user not logged in", async () => {
    const result = await supertest(web).post(`/api/v1/product`).send({
      productTitle: "",
      productPrice: 0,
      categoryCode: "BIZ",
    });
    expect(result.status).toBe(401);
  });
  it("should reject if request invalid", async () => {
    const login = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const result = await supertest(web)
      .post(`/api/v1/product`)
      .send({
        productTitle: "",
        productPrice: 0,
        categoryCode: "BIZ",
      })
      .set("Cookie", login.header["set-cookie"][0]);
    expect(result.status).toBe(400);
  });
  it("should be able to add product", async () => {
    const login = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const result = await supertest(web)
      .post(`/api/v1/product`)
      .send({
        productTitle: "TESTING",
        productPrice: 383838,
        categoryCode: "TEST",
      })
      .set("Cookie", login.header["set-cookie"][0]);
    expect(result.status).toBe(201);
    expect(result.body.productId).toBeDefined();
    expect(result.body.productTitle).toBe("TESTING");
    expect(result.body.productPrice).toBe(383838);
    expect(result.body.categoryCode).toBe("TEST");
  });
});

describe("GET /api/v1/product", () => {
  beforeEach(async () => {
    await createTestProduct();
  });
  afterEach(async () => {
    await removeAllProduct();
    await removeAllCategory();
    await removeAllTutor();
    await removeAllUser();
  });

  it("should be able to get product list", async () => {
    const result = await supertest(web).get(`/api/v1/product`);
    expect(result.status).toBe(200);
  });
  it("should be able search through product list", async () => {
    const result = await supertest(web).get(`/api/v1/product?search=product`);
    expect(result.status).toBe(200);
    expect(result.body[0].productTitle).toContain("product".toUpperCase());
  });
});

describe("GET /api/v1/product/:id", () => {
  afterEach(async () => {
    await removeAllProduct();
    await removeAllCategory();
    await removeAllTutor();
    await removeAllUser();
  });

  it("should reject if product not found", async () => {
    const tempProduct = await createTestProduct();
    const result = await supertest(web).get(`/api/v1/product/${Number(tempProduct.productId) + 1}`);
    expect(result.status).toBe(404);
  });
  it("should be able to find product by id", async () => {
    const tempProduct = await createTestProduct();
    const result = await supertest(web).get(`/api/v1/product/${Number(tempProduct.productId)}`);
    expect(result.status).toBe(200);
  });
});

describe("PUT /api/v1/product/:id", () => {
  afterEach(async () => {
    await removeAllProduct();
    await removeAllCategory();
    await removeAllTutor();
    await removeAllUser();
  });
  it("should reject if product not found", async () => {
    const tempProduct = await createTestProduct();
    const result = await supertest(web).get(`/api/v1/product/${Number(tempProduct.productId) + 1}`);
    expect(result.status).toBe(404);
  });
  it("should reject if request invalid", async () => {
    const tempProduct = await createTestProduct();
    const login = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const result = await supertest(web)
      .put(`/api/v1/product/${tempProduct.productId}`)
      .send({
        productTitle: "T",
        productPrice: 88888,
        categoryCode: "TEST",
        tutorId: Number(tempProduct.tutorId),
      })
      .set("Cookie", login.header["set-cookie"][0]);
    expect(result.status).toBe(400);
  });
  it("should reject if request invalid", async () => {
    const tempProduct = await createTestProduct();
    const login = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const result = await supertest(web)
      .put(`/api/v1/product/${tempProduct.productId}`)
      .send({
        productTitle: "INVALID CATEGORY",
        productPrice: 88888,
        categoryCode: "SDVG",
        tutorId: Number(tempProduct.tutorId),
      })
      .set("Cookie", login.header["set-cookie"][0]);
    expect(result.status).toBe(500);
  });
  it("should be able to update", async () => {
    const tempProduct = await createTestProduct();
    const login = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const result = await supertest(web)
      .put(`/api/v1/product/${tempProduct.productId}`)
      .send({
        productTitle: "UPDATED",
        productPrice: 8383838,
        categoryCode: "TEST",
        tutorId: Number(tempProduct.tutorId),
      })
      .set("Cookie", login.header["set-cookie"][0]);
    expect(result.status).toBe(200);
    expect(result.body.productTitle).not.toBe(tempProduct.productTitle);
    expect(result.body.productTitle).toBe("UPDATED");
  });
});

describe("DELETE /api/v1/product/:id", () => {
  beforeEach(async () => {
    await createOtherTestTutor();
  });
  afterEach(async () => {
    await removeAllProduct();
    await removeAllCategory();
    await removeAllTutor();
    await removeAllUser();
  });
  it("should reject if product not found", async () => {
    const tempProduct = await createTestProduct();
    const result = await supertest(web).get(`/api/v1/product/${Number(tempProduct.productId) + 1}`);
    expect(result.status).toBe(404);
  });
  it("should reject if user not logged in", async () => {
    const tempProduct = await createTestProduct();
    const result = await supertest(web).delete(`/api/v1/product/${Number(tempProduct.productId)}`);
    expect(result.status).toBe(401);
  });
  it("should reject if product not created by logged in user", async () => {
    const tempProduct = await createTestProduct();
    const login = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user3@localhost.local",
      password: "password",
    });
    const result = await supertest(web)
      .delete(`/api/v1/product/${Number(tempProduct.productId)}`)
      .set("Cookie", login.header["set-cookie"][0]);

    expect(result.status).toBe(401);
  });
  it("should be able to delete product", async () => {
    const tempProduct = await createTestProduct();
    const login = await supertest(web).post(`/api/v1/user/auth`).send({
      email: "user1@localhost.local",
      password: "password",
    });
    const result = await supertest(web)
      .delete(`/api/v1/product/${Number(tempProduct.productId)}`)
      .set("Cookie", login.header["set-cookie"][0]);

    expect(result.status).toBe(200);
  });
});
