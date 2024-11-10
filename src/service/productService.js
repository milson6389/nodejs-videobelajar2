import { ResponseError } from "../error/responseError.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../app/database.js";
import productValidation from "../validation/productValidation.js";

const getTutorIdByUserId = async (userId) => {
  const existingTutor = await prismaClient.tutor.findFirst({
    where: {
      userId: userId,
    },
  });
  if (!existingTutor) {
    throw new ResponseError(404, "User Not Registered as Tutor");
  }
  return Number(existingTutor.tutorId);
};

const addProduct = async (req) => {
  const addProductRequest = validate(productValidation.addProductValidation, req.body);
  addProductRequest.tutorId = await getTutorIdByUserId(Number(req.user.userId));

  const addProduct = await prismaClient.product.create({
    data: addProductRequest,
    select: {
      productId: true,
      productTitle: true,
      productSummary: true,
      productDesc: true,
      productPrice: true,
      productThumbnail: true,
      categoryCode: true,
      tutorId: true,
      tutor: {
        select: {
          tutorTitle: true,
          tutorDesc: true,
          user: {
            select: {
              fullName: true,
              email: true,
              noHp: true,
              profilePicture: true,
            },
          },
        },
      },
    },
  });

  return addProduct;
};

const getProdcutList = async (request = "") => {
  const products = await prismaClient.product.findMany({
    select: {
      productId: true,
      productTitle: true,
      productSummary: true,
      productDesc: true,
      productPrice: true,
      productThumbnail: true,
      tutorId: true,
      tutor: {
        select: {
          tutorTitle: true,
          tutorDesc: true,
          user: {
            select: {
              fullName: true,
              email: true,
              noHp: true,
              profilePicture: true,
            },
          },
        },
      },
    },
  });

  if (request !== "") {
    const productList = await prismaClient.product.findMany({
      where: {
        OR: [
          {
            productTitle: {
              contains: request,
            },
          },
          {
            productDesc: {
              contains: request,
            },
          },
          {
            tutor: {
              tutorTitle: {
                contains: request,
              },
            },
          },
          {
            tutor: {
              user: {
                fullName: {
                  contains: request,
                },
              },
            },
          },
        ],
      },
      select: {
        productId: true,
        productTitle: true,
        productSummary: true,
        productDesc: true,
        productPrice: true,
        productThumbnail: true,
        categoryCode: true,
        tutorId: true,
        tutor: {
          select: {
            tutorTitle: true,
            tutorDesc: true,
            user: {
              select: {
                fullName: true,
                email: true,
                noHp: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });
    return productList;
  }

  return products;
};

const getProductById = async (req) => {
  const productCount = await prismaClient.product.count({
    where: {
      productId: req,
    },
  });

  if (productCount == 0) {
    throw new ResponseError(404, "Product Not Found");
  }

  const product = await prismaClient.product.findFirst({
    where: {
      productId: req,
    },
    select: {
      productId: true,
      productTitle: true,
      productSummary: true,
      productDesc: true,
      productPrice: true,
      productThumbnail: true,
      categoryCode: true,
      tutorId: true,
      tutor: {
        select: {
          tutorTitle: true,
          tutorDesc: true,
          user: {
            select: {
              fullName: true,
              email: true,
              noHp: true,
              profilePicture: true,
            },
          },
        },
      },
    },
  });
  return product;
};

const updateProduct = async (userId, productId, req) => {
  const updateProductInfo = validate(productValidation.updateProductValidation, req);
  const tutorId = await getTutorIdByUserId(userId);
  const existingProduct = await prismaClient.product.findFirst({
    where: {
      productId: productId,
    },
  });
  if (!existingProduct) {
    throw new ResponseError(404, "Product Not Found");
  }
  if (Number(existingProduct.tutorId) !== Number(tutorId)) {
    throw new ResponseError(401, "Not Allowed to Modify / Delete");
  }

  const data = {};
  if (updateProductInfo.productTitle) {
    data.productTitle = updateProductInfo.productTitle;
  }
  if (updateProductInfo.productSummary) {
    data.productSummary = updateProductInfo.productSummary;
  }
  if (updateProductInfo.productDesc) {
    data.productDesc = updateProductInfo.productDesc;
  }
  if (updateProductInfo.productPrice) {
    data.productPrice = updateProductInfo.productPrice;
  }
  if (updateProductInfo.productThumbnail) {
    data.productThumbnail = updateProductInfo.productThumbnail;
  }
  if (updateProductInfo.categoryCode) {
    data.categoryCode = updateProductInfo.categoryCode;
  }

  return await prismaClient.product.update({
    where: {
      productId: productId,
    },
    data: data,
    select: {
      productId: true,
      productTitle: true,
      productSummary: true,
      productDesc: true,
      productPrice: true,
      productThumbnail: true,
      categoryCode: true,
      tutorId: true,
      tutor: {
        select: {
          tutorTitle: true,
          tutorDesc: true,
          user: {
            select: {
              fullName: true,
              email: true,
              noHp: true,
              profilePicture: true,
            },
          },
        },
      },
    },
  });
};

const deleteProduct = async (userId, productId) => {
  const tutorId = await getTutorIdByUserId(userId);
  const existingProduct = await prismaClient.product.findFirst({
    where: {
      productId: productId,
    },
  });

  if (!existingProduct) {
    throw new ResponseError(404, "Product Not Found");
  }

  if (Number(existingProduct.tutorId) !== Number(tutorId)) {
    throw new ResponseError(401, "Not Allowed to Modify / Delete");
  }

  return await prismaClient.product.delete({
    where: {
      productId: productId,
    },
  });
};

export default {
  addProduct,
  getProdcutList,
  getProductById,
  updateProduct,
  deleteProduct,
};
