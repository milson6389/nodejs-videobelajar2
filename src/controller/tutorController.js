import tutorService from "../service/tutorService.js";

const registerTutor = async (req, res, next) => {
  try {
    const result = await tutorService.register(req);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getListTutor = async (req, res, next) => {
  try {
    let keyword = "";
    const query = req.query;
    const params = Object.values(query);
    if (params.length > 0) {
      keyword = params[0];
    }
    const result = await tutorService.getAll(keyword);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getTutorById = async (req, res, next) => {
  try {
    const tutorId = req.params.id;
    const result = await tutorService.getById(Number(tutorId));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateTutor = async (req, res, next) => {
  try {
    const result = await tutorService.updateTutor(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  registerTutor,
  getListTutor,
  getTutorById,
  updateTutor,
};
