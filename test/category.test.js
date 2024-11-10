import supertest from "supertest";
import { web } from "../src/app/web.js";
import { removeAllCategory, createTestCategory } from "./testUtil.js";

describe("POST /api/v1/category", () => {
  afterEach(async () => {
    await removeAllCategory();
  });

  it("should be able to reject if request invalid", async () => {
    const result = await supertest(web).post(`/api/v1/category`).send({
      categoryCode: "",
      categoryDesc: "",
    });
    expect(result.status).toBe(400);
  });
  it("should be able to reject if category already exists", async () => {
    const category = await createTestCategory();
    const result = await supertest(web).post(`/api/v1/category`).send({
      categoryCode: category.categoryCode,
      categoryDesc: category.categoryDesc,
    });
    expect(result.status).toBe(400);
  });
  it("should be able to add category", async () => {
    const result = await supertest(web).post(`/api/v1/category`).send({
      categoryCode: "MKT",
      categoryDesc: "Marketing",
    });
    expect(result.status).toBe(201);
    expect(result.body.productCategoryId).toBeDefined();
    expect(result.body.categoryCode).toBe("MKT");
    expect(result.body.categoryDesc).toBe("Marketing");
  });
});

describe("GET /api/v1/category", () => {
  beforeEach(async () => {
    await createTestCategory();
  });
  afterEach(async () => {
    await removeAllCategory();
  });
  it("should be able to get Category List", async () => {
    const result = await supertest(web).get(`/api/v1/category`);
    expect(result.status).toBe(200);
    expect(result.body[0].productCategoryId).toBeDefined();
    expect(result.body[0].categoryCode).toBe("TEST");
    expect(result.body[0].categoryDesc).toBe("Test Category");
  });
});

describe("PUT /api/v1/category/:id", () => {
  afterEach(async () => {
    await removeAllCategory();
  });
  it("should reject if category not found", async () => {
    const category = await createTestCategory();
    const result = await supertest(web)
      .put(`/api/v1/category/${Number(category.productCategoryId) + 1}`)
      .send({
        categoryCode: "UPD",
        categoryDesc: "Updated Test",
      });
    expect(result.status).toBe(404);
  });
  it("should reject if request invalid", async () => {
    const category = await createTestCategory();
    const result = await supertest(web)
      .put(`/api/v1/category/${Number(category.productCategoryId)}`)
      .send({
        categoryCode: "A",
        categoryDesc: "A",
      });
    expect(result.status).toBe(400);
  });
  it("should be able to update Category", async () => {
    const category = await createTestCategory();
    const result = await supertest(web).put(`/api/v1/category/${category.productCategoryId}`).send({
      categoryCode: "UPD",
      categoryDesc: "Updated Test",
    });
    expect(result.status).toBe(200);
    expect(result.body.categoryCode).not.toBe("test");
    expect(result.body.categoryDesc).not.toBe("test category");
    expect(result.body.categoryCode).toBe("UPD");
    expect(result.body.categoryDesc).toBe("Updated Test");
  });
});

describe("DELETE /api/v1/category/:id", () => {
  afterEach(async () => {
    await removeAllCategory();
  });
  it("should reject if category not found", async () => {
    const category = await createTestCategory();
    const result = await supertest(web).delete(`/api/v1/category/${Number(category.productCategoryId) + 1}`);
    expect(result.status).toBe(404);
  });
  it("should be able to Delete Category", async () => {
    const category = await createTestCategory();
    const result = await supertest(web).delete(`/api/v1/category/${category.productCategoryId}`);
    expect(result.status).toBe(200);
  });
});
