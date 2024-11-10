import fs from "fs";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { uploadHandler } from "../utils/uploadHandler.js";
import { ResponseError } from "../error/responseError.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const upload = async (req, res) => {
  await uploadHandler(req, res);
  return {
    uploadedFile: `${req.get("host")}${req.baseUrl}/api/v1/asset/img/${req.file.filename}`,
  };
};

const removeFile = async (fileName) => {
  const photoPhysicialPath = path.join(__dirname, "..", "public/uploads", fileName);
  if (fs.existsSync(photoPhysicialPath)) {
    await fs.promises.unlink(photoPhysicialPath, (err) => {
      if (err) {
        throw new ResponseError(500, err);
      }
    });
    return true;
  } else {
    return false;
  }
};

export default {
  upload,
  removeFile,
};
