import categoryService from "../service/categoryService.js";

const addCategory = async (req, res, next) => {
  try {
    const result = await categoryService.add(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllCategory = async (req, res, next) => {
  try {
    let keyword = "";
    const query = req.query;
    const params = Object.values(query);
    if (params.length > 0) {
      keyword = params[0];
    }
    const result = await categoryService.getAll(keyword);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const result = await categoryService.update(Number(categoryId), req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    await categoryService.deleteCategory(Number(categoryId));
    res.status(200).json({
      msg: "Success Delete Product Category",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  addCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
};
