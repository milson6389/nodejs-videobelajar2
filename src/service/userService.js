import { ResponseError } from "../error/responseError.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../app/database.js";
import userValidation from "../validation/userValidation.js";
import authHandler from "../utils/authHandler.js";

const register = async (req) => {
  const registerRequest = validate(userValidation.registerUserValidation, req);
  const existingUserWithSameEmailCount = await prismaClient.user.count({
    where: {
      OR: [
        {
          email: registerRequest.email,
        },
        {
          noHp: registerRequest.noHp,
        },
      ],
    },
  });
  if (existingUserWithSameEmailCount != 0) {
    throw new ResponseError(400, "User Already Exists");
  }
  registerRequest.password = await authHandler.encryptPassword(registerRequest.password);
  return await prismaClient.user.create({
    data: registerRequest,
    select: {
      userId: true,
      fullName: true,
      email: true,
      noHp: true,
      profilePicture: true,
    },
  });
};
const getUser = async (req) => {
  return req;
};
const updateUser = async (req) => {
  const updatedUserInfo = validate(userValidation.updateUserValidation, req.body);
  const data = {};
  if (updatedUserInfo.fullName) {
    data.fullName = updatedUserInfo.fullName;
  }
  if (updatedUserInfo.noHp) {
    data.noHp = updatedUserInfo.noHp;
  }
  if (updatedUserInfo.password) {
    data.password = await authHandler.encryptPassword(updatedUserInfo.password);
  }
  if (updatedUserInfo.profilePicture) {
    data.profilePicture = updatedUserInfo.profilePicture;
  }
  return await prismaClient.user.update({
    where: {
      userId: req.user.userId,
    },
    data: data,
    select: {
      userId: true,
      fullName: true,
      email: true,
      noHp: true,
      profilePicture: true,
    },
  });
};
const login = async (req) => {
  const loginRequest = validate(userValidation.loginUserValidation, req);
  const user = await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      password: true,
    },
  });
  if (!user) {
    throw new ResponseError(401, "Invalid Credentials");
  }
  const isPasswordValid = await authHandler.isValidPassword(loginRequest.password, user.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, "Invalid Credentials");
  }
  return await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      userId: true,
      fullName: true,
      email: true,
      noHp: true,
      profilePicture: true,
    },
  });
};

export default {
  register,
  getUser,
  updateUser,
  login,
};
