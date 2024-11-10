import productService from "../service/productService.js";

const addProduct = async (req, res, next) => {
  try {
    const result = await productService.addProduct(req);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getProductList = async (req, res, next) => {
  try {
    const request = {
      search: req.query.search,
      filter: req.query.filter,
      sort: req.query.sort,
    };
    const result = await productService.getProdcutList(request);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const result = await productService.getProductById(Number(productId));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const loggedInUser = req.user.userId;
    const result = await productService.updateProduct(Number(loggedInUser), Number(productId), req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const loggedInUser = req.user.userId;
    await productService.deleteProduct(Number(loggedInUser), Number(productId));
    res.status(200).json({
      msg: "Success Delete Product",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  addProduct,
  getProductList,
  getProductById,
  updateProduct,
  deleteProduct,
};
