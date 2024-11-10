import { uploadHandler } from "../utils/uploadHandler.js";

const upload = async (req, res) => {
  await uploadHandler(req, res);
  return {
    uploadedFile: `${req.get("host")}${req.baseUrl}/api/v1/asset/img/${req.file.filename}`,
  };
};

export default {
  upload,
};
