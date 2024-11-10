import { prismaClient } from "../src/app/database.js";
import authHandler from "../src/utils/authHandler.js";

export const removeAllUser = async () => {
  return await prismaClient.user.deleteMany({
    where: {
      userId: {
        gte: 0,
      },
    },
  });
};

export const removeAllTutor = async () => {
  return await prismaClient.tutor.deleteMany({
    where: {
      tutorId: {
        gte: 0,
      },
    },
  });
};

export const removeAllCategory = async () => {
  return await prismaClient.productCategory.deleteMany({
    where: {
      productCategoryId: {
        gte: 0,
      },
    },
  });
};

export const removeAllProduct = async () => {
  return await prismaClient.product.deleteMany({
    where: {
      productId: {
        gte: 0,
      },
    },
  });
};

export const createTestUser = async () => {
  return await prismaClient.user.create({
    data: {
      fullName: "user one",
      email: "user1@localhost.local",
      noHp: "+658987654321",
      password: await authHandler.encryptPassword("password"),
    },
  });
};

export const createTestTutor = async () => {
  const tempUser = await createTestUser();
  return await prismaClient.tutor.create({
    data: {
      tutorTitle: "Jr. Mobile Dev",
      userId: tempUser.userId,
    },
  });
};

export const createOtherTestTutor = async () => {
  const otherUser = await prismaClient.user.create({
    data: {
      fullName: "user four",
      email: "user4@localhost.local",
      noHp: "+658987654444",
      password: await authHandler.encryptPassword("password"),
    },
  });
  return await prismaClient.tutor.create({
    data: {
      tutorTitle: "Jr. Mobile Dev",
      userId: otherUser.userId,
    },
  });
};

export const createManyTestUser = async () => {
  for (let i = 3; i < 8; i++) {
    await prismaClient.user.create({
      data: {
        fullName: `user ${i}`,
        email: `user${i}@localhost.local`,
        noHp: `+65898765432${i}`,
        password: await authHandler.encryptPassword("password"),
      },
    });
  }
};

export const createTestCategory = async () => {
  return await prismaClient.productCategory.create({
    data: {
      categoryCode: "TEST",
      categoryDesc: "Test Category",
    },
  });
};

export const createTestProduct = async () => {
  const tempTutor = await createTestTutor();
  const tempCategory = await createTestCategory();
  return await prismaClient.product.create({
    data: {
      productTitle: "TEST PRODUCT",
      productPrice: 88888,
      categoryCode: tempCategory.categoryCode,
      tutorId: Number(tempTutor.tutorId),
    },
  });
};
