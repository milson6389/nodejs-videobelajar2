import assetService from "../service/assetService.js";

const uploadFile = async (req, res, next) => {
  try {
    const result = await assetService.upload(req, res);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    let fileUrl = req.body.src;
    fileUrl = fileUrl.replace("http://", "");
    fileUrl = fileUrl.replace("https://", "");
    const fileName = fileUrl.replace(`${req.get("host")}${req.baseUrl}/api/v1/asset/img/`, "");
    const result = await assetService.removeFile(fileName);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  uploadFile,
  deleteFile,
};
