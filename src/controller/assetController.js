import assetService from "../service/assetService.js";

const uploadFile = async (req, res, next) => {
  try {
    const result = await assetService.upload(req, res);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  uploadFile,
};
