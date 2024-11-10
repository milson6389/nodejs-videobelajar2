import bcrypt from "bcrypt";

const encryptPassword = async (plainText) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainText, salt);
};

const isValidPassword = async (inputPassword, savedPassword) => {
  return await bcrypt.compare(inputPassword, savedPassword);
};

export default {
  encryptPassword,
  isValidPassword,
};
