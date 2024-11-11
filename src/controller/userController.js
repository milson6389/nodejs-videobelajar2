import userService from "../service/userService.js";
import { generateToken } from "../utils/generateToken.js";

const registerUser = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    generateToken(res, result.userId);
    res.status(201).json(result);
  } catch (error) {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    next(error);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const result = await userService.updateUser(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    generateToken(res, result.userId);
    res.status(200).json(result);
  } catch (error) {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    next(error);
  }
};

const userLogout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logout Success" });
  } catch (error) {
    next(error);
  }
};

const getToken = async (req, res, next) => {
  try {
    const result = await userService.getToken(req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const result = await userService.verifyToken(req.user, req.body.token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const verifyTokenByParameters = async (req, res, next) => {
  try {
    const tokenParam = req.params.token;
    const result = await userService.verifyToken(req.user, tokenParam);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  registerUser,
  getUserInfo,
  updateUserInfo,
  userLogin,
  userLogout,
  getToken,
  verifyToken,
  verifyTokenByParameters,
};
