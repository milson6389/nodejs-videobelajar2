import { ResponseError } from "../error/responseError.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../app/database.js";
import categoryValidation from "../validation/categoryValidation.js";

const add = async (req) => {
  const addRequest = validate(categoryValidation.addCategoryValidation, req);
  const existingCategoryCount = await prismaClient.productCategory.count({
    where: {
      categoryCode: addRequest.categoryCode,
    },
  });
  if (existingCategoryCount != 0) {
    throw new ResponseError(400, "Product Category Already Exists");
  }
  return await prismaClient.productCategory.create({
    data: addRequest,
    select: {
      productCategoryId: true,
      categoryCode: true,
      categoryDesc: true,
    },
  });
};

const getAll = async (request = "") => {
  const categories = await prismaClient.productCategory.findMany({
    select: {
      productCategoryId: true,
      categoryCode: true,
      categoryDesc: true,
    },
  });

  if (request !== "") {
    return await prismaClient.productCategory.findMany({
      where: {
        categoryDesc: {
          contains: request,
        },
      },
      select: {
        productCategoryId: true,
        categoryCode: true,
        categoryDesc: true,
      },
    });
  }

  return categories;
};

const update = async (categoryId, req) => {
  const updatedProductCategory = validate(categoryValidation.updateCategoryValidation, req);
  const existingCategory = await prismaClient.productCategory.findFirst({
    where: {
      productCategoryId: categoryId,
    },
  });
  if (!existingCategory) {
    throw new ResponseError(404, "Product Category Not Found");
  }
  const updatedValueExistsCount = await prismaClient.productCategory.count({
    where: {
      categoryCode: updatedProductCategory.categoryCode,
    },
  });
  if (updatedValueExistsCount != 0) {
    throw new ResponseError(400, "Product Category Code Already Exists");
  }

  const data = {};
  if (updatedProductCategory.categoryCode) {
    data.categoryCode = updatedProductCategory.categoryCode;
  }
  if (updatedProductCategory.categoryDesc) {
    data.categoryDesc = updatedProductCategory.categoryDesc;
  }
  return await prismaClient.productCategory.update({
    where: {
      productCategoryId: categoryId,
    },
    data: data,
    select: {
      productCategoryId: true,
      categoryCode: true,
      categoryDesc: true,
    },
  });
};

const deleteCategory = async (categoryId) => {
  const existingCategory = await prismaClient.productCategory.findFirst({
    where: {
      productCategoryId: categoryId,
    },
  });
  if (!existingCategory) {
    throw new ResponseError(404, "Product Category Not Found");
  }
  return await prismaClient.productCategory.delete({
    where: {
      productCategoryId: categoryId,
    },
  });
};

export default {
  add,
  getAll,
  update,
  deleteCategory,
};
